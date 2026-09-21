import { ScheduleBlock } from "./data";

/**
 * Parses a time string like "3:00AM", "11:30PM", "9:00AM" into minutes
 * since midnight, so blocks can be sorted chronologically instead of
 * alphabetically. "11:00AM" alphabetically comes before "3:00AM" (because
 * "1" < "3"), which is the bug this replaces.
 */
export function timeToMinutes(time: string): number {
    const match = time.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return 0;

    let hour = parseInt(match[1], 10);
    const minute = parseInt(match[2], 10);
    const meridian = match[3].toUpperCase();

    if (meridian === "AM") {
        if (hour === 12) hour = 0; // 12:00AM = midnight = 0
    } else {
        if (hour !== 12) hour += 12; // PM, except 12:00PM stays 12
    }

    return hour * 60 + minute;
}

/**
 * Sorts blocks chronologically: 3:00AM, 4:00AM, ... 3:00PM, ...
 * Use this everywhere blocks are added, edited, or imported.
 */
export function sortBlocksChronologically(blocks: ScheduleBlock[]): ScheduleBlock[] {
    return [...blocks].sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time));
}
