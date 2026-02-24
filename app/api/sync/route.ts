import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
    const { userId, focus, dailyJournal, trades, xp, energy, pillarXP, habitLogs } = await req.json();

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

        // --- Sync Habits (Upsert by Date/HabitId) ---
        if (habitLogs && Array.isArray(habitLogs)) {
            for (const h of habitLogs) {
                // Key format is "HabitLabel-YYYY-MM-DD" or just "HabitLabel" if we're syncing the state object
                // Let's assume habitLogs is an array of { id, date, completed, week }
                await prisma.habitLog.upsert({
                    where: {
                        userId_habitId_date: {
                            userId,
                            habitId: h.habitId,
                            date: new Date(h.date)
                        }
                    },
                    update: {
                        completed: h.completed,
                        week: h.week || 1
                    },
                    create: {
                        userId,
                        habitId: h.habitId,
                        date: new Date(h.date),
                        completed: h.completed,
                        week: h.week || 1
                    }
                });
            }
        }

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

        // --- v2 Additions: Energy and Pillar XP ---
        if (energy) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Re-fetch to see if we update or create
            const existingEnergy = await prisma.dailyEnergy.findUnique({
                where: { userId_date: { userId, date: today } }
            });

            if (existingEnergy) {
                await prisma.dailyEnergy.update({
                    where: { id: existingEnergy.id },
                    data: { level: energy }
                });
            } else {
                await prisma.dailyEnergy.create({
                    data: { userId, date: today, level: energy }
                });
            }
        }

        if (pillarXP && Array.isArray(pillarXP)) {
            for (const pxp of pillarXP) {
                await prisma.pillarXP.create({
                    data: {
                        userId,
                        pillar: pxp.pillar,
                        xp: pxp.xp,
                        date: pxp.date ? new Date(pxp.date) : new Date()
                    }
                });
            }
        }

        // --- Return Full State for Syncing ---
        const habitsRes = await prisma.habitLog.findMany({
            where: { userId },
            orderBy: { date: 'desc' }
        });
        const focusRes = await prisma.focusSession.findMany({ where: { userId }, orderBy: { date: 'desc' } });
        const tradesRes = await prisma.trade.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
        const journalRes = await prisma.journalEntry.findMany({ where: { userId }, orderBy: { date: 'desc' } });
        const pillarsRes = await prisma.pillarXP.findMany({ where: { userId }, orderBy: { date: 'desc' }, take: 50 });

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const energyRes = await prisma.dailyEnergy.findUnique({
            where: { userId_date: { userId, date: today } }
        });

        // Transform back to local format (Placeholder if needed later)
        // const habitsMap: Record<string, any> = {};
        // habitsRes.forEach(h => {
        //     // Reconstruct the key "Label-DAY"
        // });

        return NextResponse.json({
            success: true,
            state: {
                xp: user.xp,
                level: user.level,
                energy: energyRes?.level || 'medium',
                pillars: pillarsRes,
                habits: habitsRes.map(h => ({
                    habitId: h.habitId,
                    date: h.date.toISOString().split('T')[0],
                    completed: h.completed,
                    week: h.week
                })),
                focus: focusRes.map(s => ({
                    id: s.id,
                    duration: s.duration,
                    category: s.category,
                    task: s.task,
                    date: s.date
                })),
                trades: (tradesRes as Array<Record<string, unknown>>).map((t) => ({
                    id: String(t.id),
                    pair: String(t.pair),
                    dir: String(t.direction),
                    entry: String(t.entryPrice || ""),
                    sl: String(t.stopLoss || ""),
                    tp: String(t.takeProfit || ""),
                    outcome: String(t.outcome),
                    rr: String(t.rr || ""),
                    emotion: String(t.emotion || ""),
                    strategy: String(t.strategy || ""),
                    risk: Number(t.riskPercent || 0)
                })),
                journal: journalRes.map(j => ({
                    id: j.date.toISOString(),
                    wins: j.wins,
                    gaps: j.gaps,
                    fix: j.fixTomorrow,
                    rating: j.rating
                }))
            }
        });
    } catch (e) {
        console.error("Sync API Error:", e);
        return NextResponse.json({ error: "Internal Sync Error" }, { status: 500 });
    }
}

