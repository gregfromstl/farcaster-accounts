import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";
import DatabaseClient from "./DatabaseClient";
import { Insert, Row } from "@/types/database-helpers.types";
import { FarcasterAccount } from "@/types/farcaster-account.types";
import { Settings } from "@/types/settings.types";

class AdminDatabaseClient extends DatabaseClient {
    constructor() {
        const client = createClient<Database>(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_ADMIN_KEY!
        );
        super(client);
    }

    public async addAccount(
        account: FarcasterAccount
    ): Promise<Row<"accounts">> {
        const insert: Insert<"accounts"> = {
            user: account.user,
            custody_address: account.custody_address,
            private_key: account.private_key,
            fid: account.fid,
            signer_uuid: account.signer_uuid,
        };

        const result = await this.client
            .from("accounts")
            .insert(insert)
            .select()
            .single();
        if (result.error) {
            throw result.error;
        }

        return result.data;
    }

    public async getAccounts(user: string): Promise<Row<"accounts">[]> {
        const result = await this.client
            .from("accounts")
            .select()
            .eq("user", user);
        if (result.error) throw result.error;

        return result.data;
    }

    public async getAccount(fid: number): Promise<Row<"accounts">> {
        const result = await this.client
            .from("accounts")
            .select()
            .eq("fid", fid);
        if (result.error) throw result.error;

        return result.data[0];
    }

    public async upsertSettings(settings: Settings): Promise<Row<"settings">> {
        const res = await this.client
            .from("settings")
            .upsert(settings)
            .eq("user", settings.user)
            .select()
            .single();

        if (res.error) throw res.error;

        return res.data;
    }

    public async getSettings(user: string): Promise<Row<"settings">> {
        const res = await this.client
            .from("settings")
            .select()
            .eq("user", user);

        if (res.error) throw res.error;

        if (res.data.length === 0) {
            return this.upsertSettings({
                user,
            });
        } else {
            return res.data[0];
        }
    }
}
export default () => new AdminDatabaseClient();
