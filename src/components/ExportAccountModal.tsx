"use client";
import React from "react";
import { Button } from "@components/button";
import {
    Dialog,
    DialogActions,
    DialogDescription,
    DialogTitle,
} from "@components/dialog";
import toast from "react-hot-toast";
import { FarcasterAccount } from "@/types/farcaster-account.types";

const ExportAccountModal = ({
    account,
    isOpen,
    close,
}: {
    account: FarcasterAccount;
    isOpen: boolean;
    close: () => void;
}) => {
    const copyPrivateKey = async () => {
        await navigator.clipboard.writeText(account.private_key);
        toast("Copied private key to clipboard", {
            id: "copy-private-key",
            position: "top-center",
            duration: 1500,
        });
    };

    const copyMnemonic = async () => {
        if (!account.mnemonic) throw new Error("No mnemonic");
        await navigator.clipboard.writeText(account.mnemonic);
        toast("Copied mnemonic to clipboard", {
            id: "copy-mnemonic",
            position: "top-center",
            duration: 1500,
        });
    };

    return (
        <Dialog open={isOpen} onClose={close}>
            <DialogTitle>Export account</DialogTitle>
            <DialogDescription>
                Export your custody address private key or mnemonic to import it
                to another wallet or a Farcaster client.
            </DialogDescription>
            <DialogActions>
                {account.private_key && (
                    <Button color="white" onClick={() => copyPrivateKey()}>
                        Copy Private Key
                    </Button>
                )}
                {account.mnemonic && (
                    <Button onClick={() => copyMnemonic()}>
                        Copy Mnemonic
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ExportAccountModal;
