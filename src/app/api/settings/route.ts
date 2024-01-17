import AdminDatabaseClient from "@/database/AdminDatabaseClient";
import { FarcasterAccountSchema } from "@/types/farcaster-account.types";
import { SettingsSchema } from "@/types/settings.types";
import { verifyRequest, getClaims } from "@/util/auth";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function PUT(request: NextRequest) {
    const data = await request.json();
    const parsedSettings = SettingsSchema.parse(data);
    const isAuthorized = await verifyRequest(request, parsedSettings.user);
    if (!isAuthorized)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = AdminDatabaseClient();
    const result = await db.upsertSettings(parsedSettings);
    return NextResponse.json(result);
}

export async function GET(request: NextRequest) {
    const claims = await getClaims(request);
    if (!claims)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const db = AdminDatabaseClient();
    const result = await db.getSettings(claims.userId);

    return NextResponse.json(result);
}
