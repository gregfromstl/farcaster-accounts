import AdminDatabaseClient from "@/database/AdminDatabaseClient";
import { getClaims } from "@/util/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const claims = await getClaims(request);
    if (!claims)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const searchParams = request.nextUrl.searchParams;
    const fid = searchParams.get("fid");

    if (!fid)
        return NextResponse.json({ error: "Missing fid" }, { status: 400 });

    const db = AdminDatabaseClient();
    const account = await db.getAccount(parseInt(fid));
    if (account.user !== claims.userId)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    return NextResponse.json(account);
}
