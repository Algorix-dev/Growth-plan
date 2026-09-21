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

/** Parses a duration string like "120m", "90m", "6h" into total minutes. */
export function durationToMinutes(dur: string): number {
    const hourMatch = dur.match(/(\d+)\s*h/i);
    const minMatch = dur.match(/(\d+)\s*m/i);
    let total = 0;
    if (hourMatch) total += parseInt(hourMatch[1], 10) * 60;
    if (minMatch) total += parseInt(minMatch[1], 10);
    return total;
}

/** Formats minutes-since-midnight back into compact 12hr form: "11AM", "1:30PM". */
export function minutesToCompactTime(mins: number): string {
    const wrapped = ((mins % 1440) + 1440) % 1440; // handle any overflow safely
    const h = Math.floor(wrapped / 60);
    const m = wrapped % 60;
    const meridian = h >= 12 ? "PM" : "AM";
    let hour12 = h % 12;
    if (hour12 === 0) hour12 = 12;
    return m === 0 ? `${hour12}${meridian}` : `${hour12}:${m.toString().padStart(2, "0")}${meridian}`;
}

/**
 * Reads whichever blocks are tagged cat: "lecture" and derives the day's
 * course line and lecture-count tag from them — so the header always
 * reflects the actual schedule instead of separately typed text that can
 * drift out of sync with it.
 */
export function deriveLectureSummary(blocks: ScheduleBlock[]): { courses: string; tag: string } {
    const lectures = blocks.filter((b) => b.cat === "lecture");

    if (lectures.length === 0) {
        return { courses: "No lectures", tag: "Free Day" };
    }

    const courses = lectures
        .map((b) => {
            const start = timeToMinutes(b.time);
            const end = start + durationToMinutes(b.dur);
            // "CUACOS311 — Interaction Design" -> "CUACOS311"
            const code = b.title.split(/[—-]/)[0].trim();
            return `${code} (${minutesToCompactTime(start)}–${minutesToCompactTime(end)})`;
        })
        .join(" · ");

    const count = lectures.length;
    const intensity = count === 1 ? "Focused Day" : count === 2 ? "Busy Day" : "Heaviest Day";
    const tag = `${count} Lecture${count === 1 ? "" : "s"} · ${intensity}`;

    return { courses, tag };
}