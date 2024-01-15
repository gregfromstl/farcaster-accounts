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
import { useAccount, useWalletClient } from "wagmi";
import ConnectWalletButton from "./ConnectWalletButton";
import { publicClient } from "@/util/viemClient";
import { generateApprovedNeynarSigner } from "@/util/generateNeynarSigner";

const createAccountAndSigner = async (
    walletClient: WalletClient & { account: Account }
) => {
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

    const signer_uuid = await generateApprovedNeynarSigner(
        account,
        walletClient
    );
    console.log("FID:", fid);
    console.log("Signer:", signer_uuid);
};

const NewAccountButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { data: walletClient } = useWalletClient();
    const account = useAccount();

    return (
        <>
            <Button onClick={() => setIsOpen(true)}>New Account</Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Generate a new account</DialogTitle>
                <DialogDescription></DialogDescription>
                <DialogBody></DialogBody>
                <DialogActions>
                    <Button plain onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    {!account || !walletClient || account.chainId !== 10 ? (
                        <ConnectWalletButton />
                    ) : (
                        <Button
                            onClick={() => createAccountAndSigner(walletClient)}
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