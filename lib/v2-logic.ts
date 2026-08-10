import { XP_TABLE } from "./xp";

export type DailyIdentity = "Scholar" | "Warrior" | "Strategist" | "Builder" | "Raw";
export type EnergyLevel = "low" | "medium" | "high";

export const PILLAR_MAP = {
    Technical: ["code", "programming", "Algorithms"],
    Math: ["math", "MTH202", "MTH204"],
    Finance: ["trade", "trading", "Finance"],
    Athletics: ["gym", "workout", "Physical", "martial-arts", "Training"],
    Social: ["Social", "grooming", "Identity"],
    Spirit: ["Manna", "devotion", "Spiritual", "Spirit"]
};

/**
 * Calculates the daily identity based on which pillar received the most XP.
 */
export function calculateIdentityState(pillarXp: Record<string, number>): DailyIdentity {
    let topPillar = "";
    let maxXP = 0;

    for (const [pillar, xp] of Object.entries(pillarXp)) {
        if (xp > maxXP) {
            maxXP = xp;
            topPillar = pillar;
        }
    }

    if (maxXP === 0) return "Raw";

    switch (topPillar) {
        case "Technical":
        case "Math":
            return "Scholar";
        case "Athletics":
        case "Spirit":
            return "Warrior";
        case "Finance":
            return "Strategist";
        case "Social":
            return "Builder";
        default:
            return "Builder";
    }
}

/**
 * Applies modifiers based on daily energy levels.
 */
export function applyAdaptiveModifiers(baseValue: number, energy: EnergyLevel): number {
    switch (energy) {
        case "low":
            return Math.floor(baseValue * 0.8);
        case "high":
            return Math.floor(baseValue * 1.2);
        default:
            return baseValue;
    }
}

/**
 * Calculates burnout risk based on consistency and fatigue data.
 * Returns a score (0-100) where >70 is high risk.
 */
export function calculateBurnoutRisk(params: {
    missedAnchors: number;
    lowEnergyDays: number;
    avgFatigue: number; // 1-5
    consecutiveFailures: number;
}): { score: number; indicator: "Green" | "Yellow" | "Red" } {
    let score = 0;

    score += params.missedAnchors * 15;
    score += params.lowEnergyDays * 10;
    score += (params.avgFatigue / 5) * 40;
    score += params.consecutiveFailures * 20;

    const finalScore = Math.min(score, 100);
    let indicator: "Green" | "Yellow" | "Red" = "Green";

    if (finalScore > 75) indicator = "Red";
    else if (finalScore > 40) indicator = "Yellow";

    return { score: finalScore, indicator };
}

/**
 * Weighted XP logic: Scales rewards based on session duration.
 * Reward exponential focus.
 */
export function getWeightedFocusXP(durationMinutes: number): number {
    const base = XP_TABLE.pomodoro_complete; // 50XP for 25mins
    if (durationMinutes >= 90) return Math.floor(base * 4.5); // Reward massive deep work
    if (durationMinutes >= 50) return Math.floor(base * 2.2);
    if (durationMinutes >= 25) return base;
    return Math.floor(base * (durationMinutes / 25));
}
