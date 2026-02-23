import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const { userId, duration, category, task } = await req.json();

    if (!userId || !duration || !category) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const session = await prisma.focusSession.create({
        data: {
            userId,
            duration: Number(duration),
            category,
            task: task || null,
        },
    });

    return NextResponse.json({ success: true, session });
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    // Get focus sessions grouped by week (last 8 weeks)
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const sessions = await prisma.focusSession.findMany({
        where: { userId, date: { gte: eightWeeksAgo } },
        orderBy: { date: "asc" },
    });

    return NextResponse.json({ sessions });
}
