"use client";
import React, { useState } from "react";
import { Button } from "@components/button";
import {
    Dialog,
    DialogActions,
    DialogBody,
    DialogDescription,
    DialogTitle,
} from "@components/dialog";
import generateAddress from "@/util/generateAddress";
import {
    generateFarcasterAccount,
    getAccountPrice,
} from "@/util/farcasterAccount";
import { privateKeyToAccount } from "viem/accounts";
import {
    Account,
    WalletClient,
    createWalletClient,
    http,
    parseEther,
} from "viem";
import { optimism } from "viem/chains";
import { useNetwork, useWalletClient } from "wagmi";
import ConnectWalletButton from "./ConnectWalletButton";
import { publicClient } from "@/util/viemClient";
import { generateApprovedNeynarSigner } from "@/util/generateNeynarSigner";
import toast from "react-hot-toast";
import { FarcasterAccount } from "@/types/farcaster-account.types";
import axios from "axios";
import { User, usePrivy } from "@privy-io/react-auth";
import { PlusIcon } from "@heroicons/react/24/solid";
import useAuthToken from "@/hooks/useAuthToken";
import { useRouter } from "next/navigation";
import { Settings } from "@/types/settings.types";

const createAccountAndSigner = async (
    walletClient: WalletClient & { account: Account },
    user: User,
    neynarApiKey: string,
    authToken: string
): Promise<FarcasterAccount> => {
    if (!walletClient.account)
        throw new Error("Account not found on wallet client");
    const { address, privateKey } = generateAddress();
    console.log(address, privateKey);
    const account = privateKeyToAccount(privateKey);

    const price = await getAccountPrice();
    const txHash = await walletClient.sendTransaction({
        account: walletClient.account,
        chain: optimism,
        to: address,
        value: BigInt(Math.ceil(Number(price) * 1.5)),
    });
    await publicClient.waitForTransactionReceipt({
        hash: txHash,
    });
    const fid = await generateFarcasterAccount(account);
    console.log(fid);
    const signerUUID = await generateApprovedNeynarSigner(
        fid,
        account,
        walletClient,
        neynarApiKey
    );
    console.log(signerUUID);

    const farcasterAccount = {
        user: user.id,
        fid,
        signer_uuid: signerUUID,
        private_key: privateKey,
        custody_address: address,
    };
    await axios.post("/api/accounts", farcasterAccount, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    // return remaining funds
    try {
        const balance = await publicClient.getBalance({ address });
        const gasReserve = parseEther("0.0001");

        if (balance > gasReserve) {
            const amountToSend = balance - gasReserve;
            const newWalletClient = createWalletClient({
                account,
                chain: optimism,
                transport: http(process.env.NEXT_PUBLIC_OP_RPC_URL),
            });
            const txHash = await newWalletClient.sendTransaction({
                to: walletClient.account.address,
                value: amountToSend,
            });
        }
    } catch (e) {}

    return farcasterAccount;
};

const NewAccountButton = ({ settings }: { settings?: Settings }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: walletClient } = useWalletClient();
    const { user, authenticated } = usePrivy();
    const { authToken } = useAuthToken();
    const { chain } = useNetwork();
    const router = useRouter();

    const create = async () => {
        if (!walletClient) throw new Error("Wallet client not found");
        if (!authToken || !user) throw new Error("User not logged in");
        if (!settings?.neynar_api_key)
            throw new Error("Neynar API key not set");

        const promise = createAccountAndSigner(
            walletClient,
            user,
            settings?.neynar_api_key,
            authToken
        );
        await toast.promise<FarcasterAccount>(promise, {
            loading: "Creating account...",
            success: "Account created!",
            error: "Failed to create account.",
        });
        setIsOpen(false);
        router.refresh();
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>
                <PlusIcon />
                New Account
            </Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Generate a new account</DialogTitle>
                <DialogDescription>
                    After generating the account, you'll be able to edit its
                    profile.
                </DialogDescription>
                <DialogBody></DialogBody>
                <DialogActions>
                    <Button
                        disabled={isLoading}
                        plain
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    {!authenticated || !walletClient || chain?.id !== 10 ? (
                        <ConnectWalletButton />
                    ) : (
                        <Button
                            disabled={isLoading}
                            onClick={async () => {
                                setIsLoading(true);
                                try {
                                    await create();
                                } catch (e: any) {
                                    toast.error(e.message);
                                } finally {
                                    setIsLoading(false);
                                }
                            }}
                        >
                            Create
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NewAccountButton;
