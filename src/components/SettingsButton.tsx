"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@components/button";
import {
    Dialog,
    DialogActions,
    DialogBody,
    DialogDescription,
    DialogTitle,
} from "@components/dialog";
import { CogIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";
import { Field, Label } from "@components/fieldset";
import { Input } from "@components/input";
import { Settings } from "@/types/settings.types";
import { usePrivyWagmi } from "@privy-io/wagmi-connector";
import { useRouter } from "next/navigation";

const updateSettings = async (settings: Settings, authToken: string) => {
    await axios.put("/api/settings", settings, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
};

const getSettings = async (authToken: string) => {
    const { data } = await axios.get<Settings>("/api/settings", {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });

    return data;
};

const SettingsButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [neyanrAPIKey, setNeynarAPIKey] = useState<string>();
    const { getAccessToken, user, authenticated } = usePrivy();
    const { wallet: activeWallet } = usePrivyWagmi();
    const router = useRouter();

    useEffect(() => {
        if (!user) return;
        (async () => {
            const authToken = await getAccessToken();
            if (!authToken || !user) throw new Error("User not logged in");
            const settings = await getSettings(authToken);
            setNeynarAPIKey(settings.neynar_api_key || undefined);
        })();
    }, [isOpen]);

    if (!activeWallet || !authenticated) return <></>;

    const save = async () => {
        setIsLoading(true);
        const authToken = await getAccessToken();
        if (!authToken || !user) throw new Error("User not logged in");
        try {
            const promise = updateSettings(
                {
                    user: user.id,
                    neynar_api_key:
                        neyanrAPIKey && neyanrAPIKey.length > 0
                            ? neyanrAPIKey
                            : null,
                },
                authToken
            );
            await toast.promise<void>(promise, {
                loading: "Saving...",
                success: "Settings saved.",
                error: "Failed to save settings.",
            });
            setIsOpen(false);
            router.refresh();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <Button
                color="white"
                disabled={!user}
                onClick={() => setIsOpen(true)}
            >
                <CogIcon /> Settings
            </Button>
            <Dialog open={isOpen} onClose={setIsOpen}>
                <DialogTitle>Settings</DialogTitle>
                <DialogDescription></DialogDescription>
                <DialogBody>
                    <Field>
                        <Label>Neynar API key</Label>
                        <Input
                            name="neynar-api-key"
                            type="password"
                            value={neyanrAPIKey}
                            onChange={(e) => setNeynarAPIKey(e.target.value)}
                            placeholder="••••••••••••••••"
                        />
                    </Field>
                </DialogBody>
                <DialogActions>
                    <Button
                        disabled={isLoading}
                        plain
                        onClick={() => setIsOpen(false)}
                    >
                        Cancel
                    </Button>

                    <Button disabled={isLoading} onClick={save}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default SettingsButton;
