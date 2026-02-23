import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    // For Emmanuel's specific request, we simplify:
    // If user doesn't exist, create him. If he does, return him.
    // In a production app, we'd use Supabase Auth properly.

    let user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        user = await prisma.user.create({
            data: {
                email,
                name: "Emmanuel",
                xp: 0,
                level: 1
            }
        });
    }

    return NextResponse.json({ success: true, user });
}
