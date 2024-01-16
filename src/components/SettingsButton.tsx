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
import { Cog6ToothIcon, CogIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";
import axios from "axios";
import { usePrivy } from "@privy-io/react-auth";
import { Field, Label } from "@components/fieldset";
import { Input } from "@components/input";
import { Settings } from "@/types/settings.types";

const updateSettings = async (settings: Settings, authToken: string) => {
    await axios.put("/api/settings", settings, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
    });
};

const SettingsButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [neyanrAPIKey, setNeynarAPIKey] = useState<string>();
    const { getAccessToken, user } = usePrivy();

    const save = async () => {
        setIsLoading(true);
        const authToken = await getAccessToken();
        if (!authToken || !user) throw new Error("User not logged in");
        try {
            const promise = updateSettings(
                { user: user.id, neynar_api_key: neyanrAPIKey },
                authToken
            );
            await toast.promise<void>(promise, {
                loading: "Saving...",
                success: "Settings saved.",
                error: "Failed to save settings.",
            });
            setIsOpen(false);
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
                <Cog6ToothIcon className="w-8 h-8" />
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
