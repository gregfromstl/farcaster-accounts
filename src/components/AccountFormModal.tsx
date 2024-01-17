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

function AccountFormModal({
    userAccount,
    isOpen,
    close,
}: {
    userAccount: FarcasterUserAccount;
    isOpen: boolean;
    close: () => void;
}) {
    const [username, setUsername] = useState(userAccount.username);
    const [displayName, setDisplayName] = useState(userAccount.display_name);
    const [bio, setBio] = useState(userAccount.bio);
    const [profileImage, setProfileImage] = useState(userAccount.profile_image);
    const [hasChanges, setHasChanges] = useState(false);

    const cancel = () => {
        setUsername(userAccount.username);
        setDisplayName(userAccount.display_name);
        setBio(userAccount.bio);
        setProfileImage(userAccount.profile_image);
        close();
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
        <Dialog open={isOpen} onClose={close} size="3xl">
            <DialogTitle>Edit Account</DialogTitle>
            <DialogBody>
                <form action="/orders" method="POST">
                    <Fieldset
                        aria-label="Account"
                        className="grid grid-cols-1 lg:grid-cols-2 max-w-3xl mx-auto"
                    >
                        <FieldGroup className="py-8">
                            <div className="w-72 h-72 rounded-full overflow-hidden relative bg-gray-100 cursor-pointer">
                                {userAccount.profile_image && (
                                    <Image
                                        src={userAccount.profile_image}
                                        alt="Profile Image"
                                        fill
                                        className="object-cover object-center"
                                    />
                                )}
                            </div>
                        </FieldGroup>
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
                </form>
            </DialogBody>
            <DialogActions>
                <Button plain onClick={cancel} href="/">
                    Cancel
                </Button>
                <Button type="submit" disabled={!hasChanges}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default AccountFormModal;
