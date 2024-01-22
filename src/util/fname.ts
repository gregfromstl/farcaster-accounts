import {
    FarcasterAccount,
    FarcasterUserAccount,
} from "@/types/farcaster-account.types";
import axios from "axios";
import { Address, Hex, createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "wagmi";

const MESSAGE_DOMAIN = {
    name: "Farcaster name verification",
    version: "1",
    chainId: 1,
    verifyingContract: "0xe3be01d99baa8db9905b33a3ca391238234b79d1",
} as const;

const MESSAGE_TYPE = {
    UserNameProof: [
        { name: "name", type: "string" },
        { name: "timestamp", type: "uint256" },
        { name: "owner", type: "address" },
    ],
} as const;

export async function getFName(
    farcasterAccount: FarcasterAccount | FarcasterUserAccount
) {
    const result = await axios.get(
        `https://fnames.farcaster.xyz/transfers?fid=${farcasterAccount.fid}`
    );

    const transfers = result.data.transfers.filter(
        (t: any) => t.to === farcasterAccount.fid
    );

    if (transfers.length === 0) return undefined;

    const fname = transfers[transfers.length - 1].username;

    return fname;
}

export async function unregisterFName(
    farcasterAccount: FarcasterAccount,
    fname?: string
) {
    if (!fname) {
        fname = await getFName(farcasterAccount);
    }

    if (!fname) {
        throw new Error("No fname to unregister");
    }

    const privateKey = farcasterAccount.private_key;

    const account = privateKeyToAccount(privateKey as Hex);
    const walletClient = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
    });

    const timestamp = Math.floor(Date.now() / 1000);

    const signature = await walletClient.signTypedData({
        account,
        domain: MESSAGE_DOMAIN,
        types: MESSAGE_TYPE,
        primaryType: "UserNameProof",
        message: {
            name: fname,
            timestamp: BigInt(timestamp),
            owner: account.address as Address,
        },
    });

    const registration = {
        name: fname,
        from: farcasterAccount.fid,
        to: 0,
        fid: farcasterAccount.fid,
        owner: farcasterAccount.custody_address,
        timestamp,
        signature,
    };

    try {
        const result = await axios.post(
            "https://fnames.farcaster.xyz/transfers",
            {
                ...registration,
            }
        );
        return result.data;
    } catch (e: any) {
        console.log(e);
        if (e.response.data.code === "THROTTLED")
            throw new Error("You can only change your username every 28 days.");
        else throw new Error("Failed to unregister current username.");
    }
}

export async function registerFName(
    farcasterAccount: FarcasterAccount | FarcasterUserAccount,
    fname: string
) {
    const existingName = await getFName(farcasterAccount);

    // if they already have this name assigned something is out of whack with neynar, so just pass through so it can properly update
    if (existingName && existingName === fname) {
        return;
    }

    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (existingName) {
        await unregisterFName(farcasterAccount, existingName);
    }

    const privateKey = farcasterAccount.private_key;

    const account = privateKeyToAccount(privateKey as Hex);
    const walletClient = createWalletClient({
        account,
        chain: mainnet,
        transport: http(),
    });

    const timestamp = Math.floor(Date.now() / 1000);

    const signature = await walletClient.signTypedData({
        account,
        domain: MESSAGE_DOMAIN,
        types: MESSAGE_TYPE,
        primaryType: "UserNameProof",
        message: {
            name: fname,
            timestamp: BigInt(timestamp),
            owner: account.address as Address,
        },
    });

    const registration = {
        name: fname,
        from: 0,
        to: farcasterAccount.fid,
        fid: farcasterAccount.fid,
        owner: farcasterAccount.custody_address,
        timestamp,
        signature,
    };

    try {
        const result = await axios.post(
            "https://fnames.farcaster.xyz/transfers",
            {
                ...registration,
            }
        );
        // wait for registration to be processed
        await new Promise((resolve) => setTimeout(resolve, 10000));
        return result.data;
    } catch (e: any) {
        if (e.response.data.code === "USERNAME_TAKEN")
            throw new Error("Username is already taken.");
        else throw new Error("Failed to register username.");
    }
}
