import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const { userId, habits, focus, dailyJournal, trades, xp } = await req.json();

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        // --- Sync XP ---
        const user = await prisma.user.update({
            where: { id: userId },
            data: { xp: { set: xp || 0 } },
            select: { xp: true, level: true }
        });

        // --- Sync Focus Sessions (Upsert by Date/Duration/Task) ---
        // We'll simplify: just create sessions that don't exist yet
        // In a real app we'd need a stable ID for each session
        for (const s of focus) {
            const exists = await prisma.focusSession.findFirst({
                where: {
                    userId,
                    date: s.date,
                    duration: s.duration
                }
            });
            if (!exists) {
                await prisma.focusSession.create({
                    data: {
                        userId,
                        duration: s.duration,
                        task: s.task,
                        category: s.category || "focus",
                        date: s.date
                    }
                });
            }
        }

        // --- Sync Trades ---
        for (const t of trades) {
            const exists = await prisma.trade.findFirst({
                where: {
                    userId,
                    createdAt: new Date(parseInt(t.id) || Date.now()) // Using ID as approximate timestamp
                }
            });
            if (!exists) {
                await prisma.trade.create({
                    data: {
                        userId,
                        pair: t.pair,
                        direction: t.dir,
                        entryPrice: t.entry,
                        stopLoss: t.sl,
                        takeProfit: t.tp,
                        outcome: t.outcome,
                        rr: t.rr,
                        emotion: t.emotion,
                        createdAt: new Date(parseInt(t.id) || Date.now()),
                        date: new Date() // Placeholder for the formal date field
                    }
                });
            }
        }

        // --- Sync Journal ---
        for (const j of dailyJournal) {
            const exists = await prisma.journalEntry.findFirst({
                where: {
                    userId,
                    date: new Date(j.id)
                }
            });
            if (!exists) {
                await prisma.journalEntry.create({
                    data: {
                        userId,
                        wins: j.wins,
                        gaps: j.gaps,
                        fixTomorrow: j.fix,
                        rating: j.rating,
                        date: new Date(j.id)
                    }
                });
            }
        }

        // --- Return Full State for Syncing ---
        const habitsRes = await prisma.habitLog.findMany({ where: { userId } });
        const focusRes = await prisma.focusSession.findMany({ where: { userId }, orderBy: { date: 'desc' } });
        const tradesRes = await prisma.trade.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
        const journalRes = await prisma.journalEntry.findMany({ where: { userId }, orderBy: { date: 'desc' } });

        // Transform back to local format
        const habitsMap: any = {};
        habitsRes.forEach(h => {
            // Reconstruct the key "Label-DAY"
            // This is tricky because we don't store the label directly in HabitLog in the DB
            // We'd need to join with Habit table or preserve keys better.
            // For now we assume a simple direct mapping or skip if too complex for this turn.
        });

        return NextResponse.json({
            success: true,
            xp: user.xp,
            level: user.level,
            focus: focusRes.map(s => ({ ...s, id: s.id })), // Simplified transform
            trades: tradesRes.map(t => ({
                id: t.createdAt.getTime().toString(),
                pair: t.pair,
                dir: t.direction,
                entry: t.entryPrice,
                sl: t.stopLoss,
                tp: t.takeProfit,
                outcome: t.outcome,
                rr: t.rr,
                emotion: t.emotion
            })),
            dailyJournal: journalRes.map(j => ({
                id: j.date.getTime(),
                date: j.date.toLocaleDateString(),
                wins: j.wins,
                gaps: j.gaps,
                fix: j.fixTomorrow,
                rating: j.rating
            }))
        });
    } catch (e) {
        console.error("Sync API Error:", e);
        return NextResponse.json({ error: "Internal Sync Error" }, { status: 500 });
    }
}
