import AdminDatabaseClient from "@/database/AdminDatabaseClient";
import { FarcasterAccountSchema } from "@/types/farcaster-account.types";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // defaults to auto
export async function POST(request: Request) {
    const data = await request.json();
    const parsedData = FarcasterAccountSchema.parse(data);

    const db = AdminDatabaseClient();
    const result = await db.addAccount(parsedData);
    return NextResponse.json(result);
}