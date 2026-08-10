import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { XP_TABLE } from "@/lib/xp";

export async function POST(req: NextRequest) {
    const { action, userId } = await req.json();

    if (!userId || !action) {
        return NextResponse.json({ error: "Missing userId or action" }, { status: 400 });
    }

    const xpToAdd = XP_TABLE[action as keyof typeof XP_TABLE];
    if (xpToAdd == null) {
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const user = await prisma.user.update({
        where: { id: userId },
        data: { xp: { increment: xpToAdd } },
        select: { xp: true, level: true, id: true },
    });

    return NextResponse.json({ success: true, xp: user.xp, xpAdded: xpToAdd });
}
