import { Row } from "@/types/database-helpers.types";
import { Database } from "@/types/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export default abstract class DatabaseClient {
    protected client: SupabaseClient<Database>;
    public auth: SupabaseClient<Database>["auth"];

    constructor(client: SupabaseClient<Database>) {
        this.client = client;
        this.auth = client.auth;
    }
}
