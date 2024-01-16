import AdminDatabaseClient from "@/database/AdminDatabaseClient";
import { FarcasterAccountSchema } from "@/types/farcaster-account.types";
import verifyRequest from "@/util/verifyAuthToken";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
    const data = await request.json();
    const parsedAccount = FarcasterAccountSchema.parse(data);
    const isAuthorized = await verifyRequest(request, parsedAccount.user);
    if (!isAuthorized)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = AdminDatabaseClient();
    const result = await db.addAccount(parsedAccount);
    return NextResponse.json(result);
}
