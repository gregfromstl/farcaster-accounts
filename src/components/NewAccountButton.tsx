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
import { PlusIcon } from "@heroicons/react/24/solid";
import useSettings from "@/hooks/useSettings";
import useAuthToken from "@/hooks/useAuthToken";
import { useRouter } from "next/navigation";

const createAccountAndSigner = async (
    walletClient: WalletClient & { account: Account },
    user: User,
    neynarApiKey: string,
    authToken: string
): Promise<FarcasterAccount> => {
    if (!walletClient.account)
        throw new Error("Account not found on wallet client");
    const { address, privateKey } = generateAddress();
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

    const signerUUID = await generateApprovedNeynarSigner(
        account,
        walletClient,
        neynarApiKey
    );

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
    return farcasterAccount;
};

const NewAccountButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: walletClient } = useWalletClient();
    const { user, authenticated } = usePrivy();
    const { authToken } = useAuthToken();
    const { settings } = useSettings();
    const { chain } = useNetwork();
    const router = useRouter();

    const create = async () => {
        setIsLoading(true);
        if (!walletClient) throw new Error("Wallet client not found");
        if (!authToken || !user) throw new Error("User not logged in");
        if (!settings?.neynar_api_key)
            throw new Error("Neynar API key not set");
        try {
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
        } finally {
            setIsLoading(false);
        }
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
                                try {
                                    await create();
                                } catch (e: any) {
                                    toast.error(e.message);
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
