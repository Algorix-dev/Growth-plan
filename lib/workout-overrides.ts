import { WorkoutDay, WorkoutBlock, WorkoutExercise } from "./workout-data";

/**
 * Lets Emmanuel edit his own workout data from inside the app, without
 * touching the hardcoded plan in workout-data.ts. Everything lives in
 * localStorage (same pattern as the existing workout logs / sync bridge),
 * so it works offline and syncs across tabs via the "storage" event.
 *
 * Two kinds of edits:
 *  - Overrides: patch an existing exercise (rename it, change sets/reps,
 *    change the instructions, or hide it entirely).
 *  - Custom exercises: brand new exercises appended to a block.
 *
 * Call resetAllOverrides() to wipe everything and fall back to the
 * default plan from workout-data.ts.
 */

export interface ExerciseOverride {
    name?: string;
    sets?: number;
    reps?: string | number;
    how?: string;
    tip?: string;
    hidden?: boolean;
}

export interface CustomExercise extends WorkoutExercise {
    custom: true;
}

const OVERRIDES_KEY = "emmanuel_workout_overrides";
const CUSTOM_KEY = "emmanuel_workout_custom";

function safeParse<T>(raw: string | null, fallback: T): T {
    if (!raw) return fallback;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return fallback;
    }
}

function emitChange() {
    window.dispatchEvent(new CustomEvent("workout:custom-changed"));
}

export function getOverrides(): Record<string, ExerciseOverride> {
    if (typeof window === "undefined") return {};
    return safeParse(localStorage.getItem(OVERRIDES_KEY), {});
}

export function setOverride(exerciseId: string, patch: ExerciseOverride) {
    const all = getOverrides();
    all[exerciseId] = { ...all[exerciseId], ...patch };
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
    emitChange();
}

export function clearOverride(exerciseId: string) {
    const all = getOverrides();
    delete all[exerciseId];
    localStorage.setItem(OVERRIDES_KEY, JSON.stringify(all));
    emitChange();
}

export function hideExercise(exerciseId: string) {
    setOverride(exerciseId, { hidden: true });
}

export function restoreExercise(exerciseId: string) {
    clearOverride(exerciseId);
}

export function getCustomExercises(): Record<string, CustomExercise[]> {
    if (typeof window === "undefined") return {};
    return safeParse(localStorage.getItem(CUSTOM_KEY), {});
}

export function addCustomExercise(blockId: string, exercise: Omit<WorkoutExercise, "id">) {
    const all = getCustomExercises();
    const id = `custom-${blockId}-${Date.now()}`;
    all[blockId] = [...(all[blockId] || []), { ...exercise, id, custom: true }];
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(all));
    emitChange();
    return id;
}

export function removeCustomExercise(blockId: string, exerciseId: string) {
    const all = getCustomExercises();
    all[blockId] = (all[blockId] || []).filter(e => e.id !== exerciseId);
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(all));
    emitChange();
}

export function resetAllOverrides() {
    localStorage.removeItem(OVERRIDES_KEY);
    localStorage.removeItem(CUSTOM_KEY);
    emitChange();
}

export function hasAnyCustomization(): boolean {
    const overrides = getOverrides();
    const custom = getCustomExercises();
    return Object.keys(overrides).length > 0 || Object.values(custom).some(list => list.length > 0);
}

/** Merge stored overrides + custom exercises onto a base day. */
export function applyCustomizations(day: WorkoutDay): WorkoutDay {
    const overrides = getOverrides();
    const custom = getCustomExercises();

    return {
        ...day,
        blocks: day.blocks.map((block: WorkoutBlock) => {
            const patched: WorkoutExercise[] = block.exercises
                .map((ex: WorkoutExercise) => {
                    const override = overrides[ex.id];
                    if (!override) return ex;
                    if (override.hidden) return null;
                    return { ...ex, ...override };
                })
                .filter((ex): ex is WorkoutExercise => ex !== null);

            const extra = custom[block.id] || [];

            return { ...block, exercises: [...patched, ...extra] };
        })
    };
}
