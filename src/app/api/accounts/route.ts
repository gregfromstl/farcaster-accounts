import AdminDatabaseClient from "@/database/AdminDatabaseClient";
import { FarcasterAccountSchema } from "@/types/farcaster-account.types";
import { verifyRequest, getClaims } from "@/util/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: NextRequest) {
    const data = await request.json();
    const parsedAccount = FarcasterAccountSchema.parse(data);
    const isAuthorized = await verifyRequest(request, parsedAccount.user);
    if (!isAuthorized)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = AdminDatabaseClient();
    const result = await db.addAccount(parsedAccount);
    return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
    const claims = await getClaims(request);
    if (!claims) return NextResponse.json([]);

    const db = AdminDatabaseClient();
    const result = await db.getAccounts(claims.userId);
    return NextResponse.json(result);
}
