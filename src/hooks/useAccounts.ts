import { useEffect, useState } from "react";
import useAuthToken from "./useAuthToken";
import request from "@/util/request";
import {
    FarcasterAccount,
    FarcasterUserAccount,
} from "@/types/farcaster-account.types";
import useNeynarClient from "./useNeynarClient";
import { useRouter } from "next/navigation";

export default function useAccounts() {
    const { authToken } = useAuthToken();
    const { client: neynar } = useNeynarClient();
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [accounts, setAccounts] = useState<FarcasterAccount[]>([]);
    const [userAccounts, setUserAccounts] = useState<FarcasterUserAccount[]>(
        []
    );
    const router = useRouter();

    const refreshUserAccounts = async () => {
        const result = await neynar?.fetchBulkUsers(
            accounts.map((account) => account.fid),
            {}
        );
        const userAccountsResult: FarcasterUserAccount[] = accounts.map(
            (account) => {
                const user = result?.users.find(
                    (user) => user.fid === account.fid
                );
                if (!account) throw new Error("Account not found");
                return {
                    ...account,
                    username: user?.username || "",
                    display_name: user?.display_name || "",
                    profile_image: user?.pfp_url || "",
                    bio: user?.profile.bio.text || "",
                };
            }
        );
        setUserAccounts(userAccountsResult);
    };

    const refreshAccounts = async () => {
        setLoading(true);
        try {
            if (!authToken) return;
            const accountsResult = await request<FarcasterAccount[]>({
                path: "/api/accounts",
                method: "GET",
                authToken,
            });
            setAccounts(accountsResult);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const updateUser = async (account: FarcasterUserAccount) => {
        if (!account?.signer_uuid) throw new Error("No Neynar API key");
        const result = await neynar?.updateUser(account.signer_uuid, {
            username: account.username,
            displayName: account.display_name,
            pfpUrl: account.profile_image,
            bio: account.bio,
        });
        if (!result) throw new Error("Failed to update user");
        setTimeout(() => {
            router.refresh();
        }, 500);
    };

    useEffect(() => {
        refreshAccounts();
    }, [authToken]);

    useEffect(() => {
        refreshUserAccounts();
    }, [accounts]);

    return { loading, error, accounts, userAccounts, updateUser };
}
