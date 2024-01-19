import CryptoJS from "crypto-js";
import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";
import DatabaseClient from "./DatabaseClient";
import { Insert, Row } from "@/types/database-helpers.types";
import { FarcasterAccount } from "@/types/farcaster-account.types";
import { Settings } from "@/types/settings.types";

class AdminDatabaseClient extends DatabaseClient {
    private encryptionSecret: string = process.env.ENCRYPTION_SECRET as string;
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
            private_key: CryptoJS.AES.encrypt(
                account.private_key,
                this.encryptionSecret
            ).toString(),
            mnemonic: account.mnemonic
                ? CryptoJS.AES.encrypt(
                      account.mnemonic,
                      this.encryptionSecret
                  ).toString()
                : undefined,
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

        result.data.forEach((account) => {
            const privateKeyBytes = CryptoJS.AES.decrypt(
                account.private_key,
                this.encryptionSecret
            );
            account.private_key = privateKeyBytes.toString(CryptoJS.enc.Utf8);
            if (account.mnemonic) {
                const mnemonicBytes = CryptoJS.AES.decrypt(
                    account.mnemonic,
                    this.encryptionSecret
                );
                account.mnemonic = mnemonicBytes.toString(CryptoJS.enc.Utf8);
            }
        });

        return result.data;
    }

    public async getAccount(fid: number): Promise<Row<"accounts">> {
        const result = await this.client
            .from("accounts")
            .select()
            .eq("fid", fid);
        if (result.error) throw result.error;

        result.data.forEach((account) => {
            const privateKeyBytes = CryptoJS.AES.decrypt(
                account.private_key,
                this.encryptionSecret
            );
            account.private_key = privateKeyBytes.toString(CryptoJS.enc.Utf8);
            if (account.mnemonic) {
                const mnemonicBytes = CryptoJS.AES.decrypt(
                    account.mnemonic,
                    this.encryptionSecret
                );
                account.mnemonic = mnemonicBytes.toString(CryptoJS.enc.Utf8);
            }
        });

        return result.data[0];
    }

    public async upsertSettings(settings: Settings): Promise<Row<"settings">> {
        if (settings.neynar_api_key)
            settings.neynar_api_key = CryptoJS.AES.encrypt(
                settings.neynar_api_key,
                this.encryptionSecret
            ).toString();

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

        let result;
        if (res.data.length === 0) {
            result = await this.upsertSettings({
                user,
            });
        } else {
            result = res.data[0];
        }

        if (result.neynar_api_key)
            result.neynar_api_key = CryptoJS.AES.decrypt(
                result.neynar_api_key,
                this.encryptionSecret
            ).toString(CryptoJS.enc.Utf8);
        return result;
    }
}
export default () => new AdminDatabaseClient();
