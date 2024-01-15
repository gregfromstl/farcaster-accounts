import { cookies } from "next/headers";

import DatabaseClient from "./DatabaseClient";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

class RouteDatabaseClient extends DatabaseClient {
    constructor() {
        const client = createRouteHandlerClient({
            cookies,
        });
        super(client);
    }
}
export default () => new RouteDatabaseClient();
