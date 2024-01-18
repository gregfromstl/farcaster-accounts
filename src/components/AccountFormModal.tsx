"use client";
import Image from "next/image";
import { Field, FieldGroup, Fieldset, Label } from "@components/fieldset";
import { FarcasterUserAccount } from "@/types/farcaster-account.types";
import { Input } from "@components/input";
import { Textarea } from "@components/textarea";
import { Button } from "@components/button";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogActions,
    DialogBody,
    DialogTitle,
} from "@components/dialog";
import useAccounts from "@/hooks/useAccounts";
import toast from "react-hot-toast";
import { registerFName } from "@/util/fname";

function AccountFormModal({
    userAccount,
    isOpen,
    close,
}: {
    userAccount: FarcasterUserAccount;
    isOpen: boolean;
    close: () => void;
}) {
    const [username, setUsername] = useState(userAccount.username ?? undefined);
    const [displayName, setDisplayName] = useState(
        userAccount.display_name ?? undefined
    );
    const [bio, setBio] = useState(userAccount.bio ?? undefined);
    const [profileImage, setProfileImage] = useState(
        userAccount.profile_image ?? undefined
    );
    const [hasChanges, setHasChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const { updateUser } = useAccounts();

    const cancel = () => {
        setUsername(userAccount.username);
        setDisplayName(userAccount.display_name);
        setBio(userAccount.bio);
        setProfileImage(userAccount.profile_image);
        close();
    };

    const updateAccount = async () => {
        setLoading(true);
        try {
            if (!username) throw new Error("Username cannot be empty");
            if (!userAccount.signer_uuid) throw new Error("No signer UUID");
            if (username !== userAccount.username) {
                await toast.promise(registerFName(userAccount, username), {
                    loading: "Registering new fname...",
                    success: "fname registered",
                    error: (err) => err.message,
                });
            }
            const promise = updateUser(userAccount.signer_uuid, {
                username:
                    username !== userAccount.username ? username : undefined,
                displayName,
                bio,
                pfpUrl: profileImage,
            });
            await toast.promise(promise, {
                loading: "Updating account...",
                success: "Account updated!",
                error: "Failed to update account.",
            });
            close();
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setHasChanges(
            username !== userAccount.username ||
                displayName !== userAccount.display_name ||
                bio !== userAccount.bio ||
                profileImage !== userAccount.profile_image
        );
    }, [username, displayName, bio, profileImage]);

    return (
        <Dialog open={isOpen} onClose={close} size="xl">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    updateAccount();
                }}
            >
                <DialogTitle>Edit Account</DialogTitle>
                <DialogBody>
                    <Fieldset aria-label="Account">
                        <FieldGroup>
                            <Field>
                                <Label>Username</Label>
                                <Input
                                    name="username"
                                    value={`@${username}`}
                                    onChange={(e) =>
                                        setUsername(e.target.value.slice(1))
                                    }
                                />
                            </Field>

                            <Field>
                                <Label>Profile Image</Label>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full overflow-hidden relative bg-gray-100 cursor-pointer">
                                        {profileImage &&
                                            profileImage.length > 0 && (
                                                <Image
                                                    src={profileImage}
                                                    alt="Profile Image"
                                                    fill
                                                    className="object-cover object-center"
                                                />
                                            )}
                                    </div>
                                    <Input
                                        name="image"
                                        className="flex-1"
                                        value={profileImage}
                                        onChange={(e) =>
                                            setProfileImage(e.target.value)
                                        }
                                    />
                                </div>
                            </Field>
                            <Field>
                                <Label>Display Name</Label>
                                <Input
                                    name="display_name"
                                    value={displayName}
                                    onChange={(e) =>
                                        setDisplayName(e.target.value)
                                    }
                                />
                            </Field>
                            <Field>
                                <Label>Bio</Label>
                                <Textarea
                                    name="bio"
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                            </Field>
                        </FieldGroup>
                    </Fieldset>
                </DialogBody>
                <DialogActions>
                    <Button plain onClick={cancel} disabled={loading} href="/">
                        Cancel
                    </Button>
                    <Button type="submit" disabled={!hasChanges || loading}>
                        Save
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default AccountFormModal;
