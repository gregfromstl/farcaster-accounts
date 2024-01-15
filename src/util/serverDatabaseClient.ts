import { Database } from "@/types/database.types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default () => createServerComponentClient<Database>({ cookies });
