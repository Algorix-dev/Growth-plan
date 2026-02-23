// XP & Level System for EP·OS Gamification Layer
// Each level requires 500 XP. Titles progress with level.

export const XP_TABLE = {
    habit_all_complete: 100,   // All habits for the day checked off
    habit_single: 10,          // Individual habit checked
    pomodoro_complete: 50,     // A focus timer hits 0
    trade_logged: 20,          // Any trade is logged
    trade_win: 30,             // Won trade specifically
    journal_note: 15,          // A journal entry saved
    weekly_review: 80,         // Weekly review completed
};

export const LEVEL_TITLES: Record<number, string> = {
    1: "Raw",
    3: "Recruit",
    5: "Apprentice",
    8: "Builder",
    12: "Iron",
    18: "Steel",
    25: "Gold",
    35: "Platinum",
    50: "Diamond",
    75: "Obsidian",
    100: "Legend",
};

export function getLevelTitle(level: number): string {
    const thresholds = Object.keys(LEVEL_TITLES)
        .map(Number)
        .sort((a, b) => b - a); // descending
    for (const t of thresholds) {
        if (level >= t) return LEVEL_TITLES[t];
    }
    return "Raw";
}

export function xpForNextLevel(level: number): number {
    return level * 500;
}

export function calculateLevel(totalXp: number): { level: number; xpInLevel: number; xpNeeded: number } {
    let level = 1;
    let remaining = totalXp;

    while (remaining >= xpForNextLevel(level)) {
        remaining -= xpForNextLevel(level);
        level++;
    }

    return {
        level,
        xpInLevel: remaining,
        xpNeeded: xpForNextLevel(level),
    };
}
