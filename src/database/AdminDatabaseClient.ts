import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";
import DatabaseClient from "./DatabaseClient";
import { Insert, Row } from "@/types/database-helpers.types";
import { FarcasterAccount } from "@/types/farcaster-account.types";

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
            custody_address: account.custodyAddress,
            private_key: account.privateKey,
            fid: account.fid,
            signer_uuid: account.signerUUID,
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
}
export default () => new AdminDatabaseClient();
