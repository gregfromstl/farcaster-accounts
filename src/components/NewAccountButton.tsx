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
import { Account, WalletClient } from "viem";
import { optimism } from "viem/chains";
import { useAccount, useNetwork, useWalletClient } from "wagmi";
import ConnectWalletButton from "./ConnectWalletButton";
import { publicClient } from "@/util/viemClient";
import { generateApprovedNeynarSigner } from "@/util/generateNeynarSigner";
import toast from "react-hot-toast";
import { FarcasterAccount } from "@/types/farcaster-account.types";
import axios from "axios";
import { User, usePrivy } from "@privy-io/react-auth";

const createAccountAndSigner = async (
    walletClient: WalletClient & { account: Account },
    user: User,
    authToken: string
): Promise<FarcasterAccount> => {
    if (!walletClient.account)
        throw new Error("Account not found on wallet client");
    // const { address, privateKey } = generateAddress();
    // const account = privateKeyToAccount(privateKey);

    // const price = await getAccountPrice();
    // const txHash = await walletClient.sendTransaction({
    //     account: walletClient.account,
    //     chain: optimism,
    //     to: address,
    //     value: BigInt(Math.ceil(Number(price) * 1.5)),
    // });
    // await publicClient.waitForTransactionReceipt({
    //     hash: txHash,
    // });
    // const fid = await generateFarcasterAccount(account);

    // const signerUUID = await generateApprovedNeynarSigner(
    //     account,
    //     walletClient
    // );
    const fid = 10;
    const signerUUID = "0x123";
    const privateKey = "0x123";
    const address = "0x8d474e96C3b78C0dF518266f7506840192531e8D";

    const farcasterAccount = {
        user: user.id,
        fid,
        signerUUID,
        privateKey,
        custodyAddress: address,
    };
    await axios.post("/api/accounts", farcasterAccount, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
    return farcasterAccount;
};

const NewAccountButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: walletClient } = useWalletClient();
    const account = useAccount();
    const { getAccessToken, user } = usePrivy();
    const { chain } = useNetwork();

    const create = async () => {
        setIsLoading(true);
        if (!walletClient) throw new Error("Wallet client not found");
        const authToken = await getAccessToken();
        if (!authToken || !user) throw new Error("User not logged in");
        try {
            const promise = createAccountAndSigner(
                walletClient,
                user,
                authToken
            );
            await toast.promise<FarcasterAccount>(promise, {
                loading: "Creating account...",
                success: "Account created!",
                error: "Failed to create account.",
            });
            setIsOpen(false);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>New Account</Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Generate a new account</DialogTitle>
                <DialogDescription></DialogDescription>
                <DialogBody></DialogBody>
                <DialogActions>
                    <Button
                        disabled={isLoading}
                        plain
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>
                    {!account || !walletClient || chain?.id !== 10 ? (
                        <ConnectWalletButton />
                    ) : (
                        <Button disabled={isLoading} onClick={create}>
                            Create
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NewAccountButton;
