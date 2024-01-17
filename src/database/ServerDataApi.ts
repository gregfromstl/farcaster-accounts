import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";
import DatabaseClient from "./DatabaseClient";
import { Insert, Row } from "@/types/database-helpers.types";
import {
    FarcasterAccount,
    FarcasterUserAccount,
} from "@/types/farcaster-account.types";
import { Settings } from "@/types/settings.types";
import { cookies } from "next/headers";
import request from "@/util/request";
import getNeynarClient from "@/util/neynarClient";

class ServerDataApi {
    private authToken: string | undefined = undefined;
    constructor() {
        const c = cookies();
        this.authToken = c.get("privy-token")?.value;
    }

    async getSettings(): Promise<Settings> {
        if (!this.authToken) throw new Error("User is not logged in");
        const settings = await request<Settings>({
            path: `${process.env.BASE_URL}/api/settings`,
            method: "GET",
            authToken: this.authToken,
        });
        return settings;
    }

    async getAccount(fid: number): Promise<FarcasterAccount> {
        if (!this.authToken) throw new Error("User is not logged in");
        const account = await request<FarcasterAccount>({
            path: `${process.env.BASE_URL}/api/account?fid=${fid}`,
            method: "GET",
            authToken: this.authToken,
        });
        return account;
    }

    async getUserAccount(fid: number): Promise<FarcasterUserAccount> {
        if (!this.authToken) throw new Error("User is not logged in");
        const account = await this.getAccount(fid);

        const settings = await this.getSettings();

        if (!settings.neynar_api_key)
            throw new Error("Neynar API key is not set");
        const neynar = getNeynarClient(settings.neynar_api_key);
        const userResult = await neynar.lookupUserByFid(account.fid);
        const user = userResult.result.user;
        return {
            ...account,
            username: user.username,
            profile_image: user.pfp.url,
            display_name: user.displayName,
            bio: user.profile.bio.text,
        };
    }
}
export default () => new ServerDataApi();
