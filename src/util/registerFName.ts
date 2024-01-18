import {
    FarcasterAccount,
    FarcasterUserAccount,
} from "@/types/farcaster-account.types";
import axios from "axios";
import { Address, Hex, createWalletClient, getAddress, http } from "viem";
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

export default async function registerFName(
    farcasterAccount: FarcasterAccount | FarcasterUserAccount,
    fname: string
) {
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

    const result = await axios.post("https://fnames.farcaster.xyz/transfers", {
        ...registration,
    });
    console.log(result);

    return result.data;
}
