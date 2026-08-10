import { DayData, ScheduleBlock } from "./data";

/**
 * Lets Emmanuel rebuild his weekly schedule from inside the app for a new
 * semester, without touching the hardcoded scheduleData in lib/data.ts.
 * Each day is stored as a whole unit — once you edit anything on a day,
 * that entire day's data is saved to localStorage and takes over from the
 * default. This matches how a semester changeover actually works: whole
 * days change at once (different lecture times, different courses), not
 * single time-slots in isolation.
 *
 * Call resetDay(day) to drop one day back to default, or
 * resetAllScheduleOverrides() to wipe the whole week back to default.
 */

const OVERRIDES_KEY = "emmanuel_schedule_overrides";

function safeParse<T>(raw: string | null, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function emitChange() {
    window.dispatchEvent(new CustomEvent("schedule:custom-changed"));
}

export function getScheduleOverrides(): Record<string, DayData> {
    if (typeof window === "undefined") return {};
    return safeParse(localStorage.getItem(OVERRIDES_KEY), {});
}

export function setDayOverride(day: string, dayData: DayData) {
    const all = getScheduleOverrides();
    all[day] = dayData;
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
    emitChange();
}

export function resetDay(day: string) {
    const all = getScheduleOverrides();
    delete all[day];
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
    emitChange();
}

export function resetAllScheduleOverrides() {
    localStorage.removeItem(OVERRIDES_KEY);
    emitChange();
}

export function hasAnyScheduleOverride(): boolean {
    return Object.keys(getScheduleOverrides()).length > 0;
}

export function isDayOverridden(day: string): boolean {
    return Object.prototype.hasOwnProperty.call(getScheduleOverrides(), day);
}

/** Returns the override for a day if one exists, otherwise the base day. */
export function applyScheduleOverride(day: string, baseDay: DayData): DayData {
    const overrides = getScheduleOverrides();
    return overrides[day] || baseDay;
}

export function emptyBlock(): ScheduleBlock {
    return { time: "", cat: "study", emoji: "📌", title: "", dur: "30m" };
}
