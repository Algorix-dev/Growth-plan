import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        status: "online",
        timestamp: new Date().toISOString(),
        env_database_url: process.env.DATABASE_URL ? "Present (Hidden)" : "MISSING",
        env_direct_url: process.env.DIRECT_URL ? "Present (Hidden)" : "MISSING"
    });
}
