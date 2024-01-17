import { Field, FieldGroup, Fieldset, Label } from "@components/fieldset";
import { Textarea } from "@components/textarea";
import { Input } from "@components/input";
import { FarcasterUserAccount } from "@/types/farcaster-account.types";
import { useState } from "react";

async function AccountForm({
    userAccount,
}: {
    userAccount: FarcasterUserAccount;
}) {
    const [username, setUsername] = useState(userAccount.username);
    const [displayName, setDisplayName] = useState(userAccount.display_name);
    const [bio, setBio] = useState(userAccount.bio);

    return (
        <form action="/orders" method="POST">
            <Fieldset
                aria-label="Account"
                className="grid grid-cols-1 lg:grid-cols-2"
            >
                <FieldGroup></FieldGroup>
                <FieldGroup>
                    <Field>
                        <Label>Username</Label>
                        <Input
                            name="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Field>
                    <Field>
                        <Label>Display Name</Label>
                        <Input
                            name="display_name"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
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
    );
}
