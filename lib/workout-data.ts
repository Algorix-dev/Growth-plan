export interface WorkoutExercise {
    id: string;
    name: string;
    sets?: number;
    reps?: string | number;
    reps_note?: string;
    duration?: string;
    duration_seconds?: number | string;
    rest_after?: string;
    how: string;
    tip?: string;
    form_cues?: string[];
    category?: string;
    difficulty?: string;
}

export interface WorkoutBlock {
    id: string;
    name: string;
    type: string;
    rounds: number;
    round_duration?: string;
    rest_between?: string;
    exercise_duration_seconds?: number;
    rest_between_exercises?: string;
    rest_between_rounds?: string;
    exercises: WorkoutExercise[];
    note?: string;
}

export interface WorkoutDay {
    day: string;
    theme: string;
    color: string;
    estimated_duration: string;
    blocks: WorkoutBlock[];
}

export interface WorkoutMonth {
    month: number;
    days: WorkoutDay[];
    push_rounds?: number;
    core_rounds?: number;
    modifications?: Record<string, unknown>;
}

export const WORKOUT_PLAN_METADATA = {
    version: "2.0",
    athlete: "Emmanuel Peter",
    focus: "Functional Physique + Explosive Power",
    duration: "3 Months",
    rules: {
        rounds_adaptive: true,
        energy_levels: {
            low: "Normal rounds (as specified)",
            medium: "+1 round for strength blocks",
            high: "+2 rounds for strength blocks OR +1 for circuit"
        }
    }
};

export const UNIVERSAL_COMPONENTS = {
    warm_up: {
        id: "wu-01",
        name: "Joint Mobility + Core Activation",
        exercises: [
            { id: "wu-jnt", name: "Neck, Shoulder, Hip, Knee, Ankle Circles", sets: 1, reps: "10-15 each", how: "Slow controlled rotation of every joint.", tip: "Never skip mobility. Joints are the hinges — keep them oiled." },
            { id: "wu-ccw", name: "Cat-Cow Stretch", sets: 1, reps: "10 reps", how: "On all fours. Inhale, arch back (look up). Exhale, round back (look down).", tip: "Wakes up the spine." },
            { id: "wu-bdg", name: "Bird-Dog", sets: 1, reps: "10 each side", how: "Opposite arm and leg extension. Hold for 2 seconds. Squeeze core.", tip: "Fundamental for lower back health." },
            { id: "wu-lsw", name: "Dynamic Leg Swings", sets: 1, reps: "12 each way", how: "Forward/backward and side-to-side swings. Increasing range gradually.", tip: "Essential before any explosive work." }
        ]
    },
    cool_down: {
        id: "cd-01",
        name: "Extended Flexibility Flush",
        exercises: [
            { id: "cd-chp", name: "Child’s Pose", duration: "60 seconds", how: "Knees wide, toes touching. Sit back on heels, reach arms forward on floor.", tip: "Calms the nervous system." },
            { id: "cd-pgn", name: "Pigeon Pose", duration: "60 seconds each side", how: "One leg bent in front, other straight behind. Fold over front leg.", tip: "Opens the hips — crucial for kicks and agility." },
            { id: "cd-cbr", name: "Cobra Stretch", duration: "45 seconds", how: "Lie on belly, press chest up. Keep hips on floor.", tip: "Stretches abs and spine." },
            { id: "cd-dsh", name: "Deep Squat Hold", duration: "60 seconds", how: "Full depth squat, elbows inside knees, chest up.", tip: "Builds permanent mobility." }
        ]
    }
};

export const MONTH_1: WorkoutMonth = {
    month: 1,
    push_rounds: 3,
    core_rounds: 3,
    days: [
        {
            day: "Monday",
            theme: "Push + Core Block",
            color: "#c94646",
            estimated_duration: "45-50 minutes",
            blocks: [
                {
                    id: "m1-mon-push",
                    name: "Push Strength Block",
                    type: "push",
                    rounds: 3,
                    exercises: [
                        { id: "m1-mon-p1", name: "Standard Push-Ups", sets: 3, reps: "AMRAP (-2 from failure)", rest_after: "90 seconds", how: "Hands shoulder-width. Body straight. Chest to 1 inch from floor.", form_cues: ["Elbows at 45 degrees", "Core tight", "Full range"] },
                        { id: "m1-mon-p2", name: "Pike Push-Ups", sets: 3, reps: 8, rest_after: "90 seconds", how: "V-shape position. Lower head toward floor between hands.", form_cues: ["Shoulder focus", "Control the descent"] },
                        { id: "m1-mon-p3", name: "Diamond / Wide Push-Ups", sets: 3, reps: 10, rest_after: "90 seconds", how: "Alternate styles each week. Diamond: index/thumbs touch. Wide: hands 1.5x shoulder width.", form_cues: ["Diamond targets triceps", "Wide targets outer chest"] }
                    ]
                },
                {
                    id: "m1-mon-core",
                    name: "Core Stability Block",
                    type: "core",
                    rounds: 2,
                    exercises: [
                        { id: "m1-mon-c1", name: "Plank Hold", duration_seconds: 30, rest_after: "45 seconds", how: "Elbows under shoulders. Squeeze everything.", form_cues: ["No sagging hips", "Squeeze glutes"] },
                        { id: "m1-mon-c2", name: "Hollow Body Hold", duration_seconds: 20, rest_after: "45 seconds", how: "Lower back pressed into floor. Legs and shoulders 6 inches off floor.", form_cues: ["Pressed lower back is non-negotiable"] }
                    ]
                }
            ]
        },
        {
            day: "Tuesday",
            theme: "Movement + Striking Mastery",
            color: "#c9962e",
            estimated_duration: "40 minutes",
            blocks: [
                {
                    id: "m1-tue-shadow",
                    name: "Shadowboxing Flow",
                    type: "skill",
                    rounds: 4,
                    round_duration: "3 minutes",
                    rest_between: "60 seconds",
                    note: "Focus on different elements each round.",
                    exercises: [
                        { id: "m1-tue-s1", name: "R1: Movement Only", duration_seconds: 180, how: "Stance and footwork only. No punches. Circle, step, pivot.", tip: "Master the feet, the hands follow." },
                        { id: "m1-tue-s2", name: "R2: Establishing Jab", duration_seconds: 180, how: "Jab only. Focus on snap and immediate return to guard.", tip: "The jab is your rangefinder." },
                        { id: "m1-tue-s3", name: "R3: 1-2 Combination", duration_seconds: 180, how: "Jab-Cross combinations. Perfect hip rotation on the cross.", tip: "Power comes from the ground." },
                        { id: "m1-tue-s4", name: "R4: Full Flow", duration_seconds: 180, how: "Everything combined. Footwork + Jab + 1-2 + Teep.", tip: "Stay relaxed. Tension makes you slow." }
                    ]
                }
            ]
        },
        {
            day: "Wednesday",
            theme: "Pull + Grip Development",
            color: "#4676c9",
            estimated_duration: "35-40 minutes",
            blocks: [
                {
                    id: "m1-wed-pull",
                    name: "Pull Strength Block",
                    type: "pull",
                    rounds: 3,
                    exercises: [
                        { id: "m1-wed-p1", name: "Australian Rows (Table Rows)", sets: 3, reps: 10, rest_after: "90 seconds", how: "Under a sturdy table. Pull chest to table edge. Body straight.", tip: "Primary back builder before the pull-up." },
                        { id: "m1-wed-p2", name: "Scapular Retractions", sets: 3, reps: 12, rest_after: "60 seconds", how: "Hanging from a bar or ledge. Pull shoulder blades down and back without bending elbows.", tip: "The foundational movement of the pull-up." },
                        { id: "m1-wed-p3", name: "Dead Hang", duration_seconds: 30, sets: 3, rest_after: "90 seconds", how: "Just hang from a bar. Grip strength and spinal decompression.", tip: "A 60-second hang is your Month 3 goal." }
                    ]
                }
            ]
        },
        {
            day: "Thursday",
            theme: "Legs + Explosive Block",
            color: "#46c976",
            estimated_duration: "45 minutes",
            blocks: [
                {
                    id: "m1-thu-legs",
                    name: "Legs + Explosive Block",
                    type: "legs",
                    rounds: 1,
                    exercises: [
                        { id: "m1-thu-l1", name: "Bodyweight Squats", sets: 3, reps: 15, rest_after: "60 seconds", how: "Full depth. Drive through heels to stand.", tip: "Full depth is non-negotiable." },
                        { id: "m1-thu-l2", name: "Jump Squats", sets: 3, reps: 8, rest_after: "75 seconds", how: "Explode upward at maximum effort. Land softly.", tip: "MAXIMUM height every rep." },
                        { id: "m1-thu-l3", name: "Reverse Lunges", sets: 3, reps: 10, reps_note: "10 each leg", rest_after: "60 seconds", how: "Step backward and lower knee. Alternate legs.", tip: "More knee-friendly than forward lunges." },
                        { id: "m1-thu-l4", name: "Single Leg Calf Raises", sets: 3, reps: 20, rest_after: "45 seconds", how: "Rise onto ball of foot as high as possible. Lower slowly.", tip: "Improves footwork stability." },
                        { id: "m1-thu-l5", name: "Broad Jumps", sets: 3, reps: 5, rest_after: "90 seconds", how: "Jump as far as possible. Walk back to start.", tip: "Quality speed work — rest fully between sets." }
                    ]
                }
            ]
        },
        {
            day: "Friday",
            theme: "Full Body Circuit + Sport",
            color: "#d47a2a",
            estimated_duration: "Circuit: 30m | Sport: 30-60m",
            blocks: [
                {
                    id: "m1-fri-circuit",
                    name: "Full Body Circuit",
                    type: "circuit",
                    rounds: 4,
                    exercise_duration_seconds: 30,
                    rest_between_exercises: "15 seconds",
                    rest_between_rounds: "90 seconds",
                    exercises: [
                        { id: "m1-fri-c1", name: "Push-Ups", duration_seconds: 30, how: "As many clean reps as possible. Plank when form breaks." },
                        { id: "m1-fri-c2", name: "Bodyweight Squats", duration_seconds: 30, how: "Continuous squats at controlled pace." },
                        { id: "m1-fri-c3", name: "Australian Rows", duration_seconds: 30, how: "Continuous rows for full duration." },
                        { id: "m1-fri-c4", name: "Plank Hold", duration_seconds: 30, how: "Static plank. Squeeze everything." },
                        { id: "m1-fri-c5", name: "Jump Squats", duration_seconds: 30, how: "Continuous jump squats. Max height each time." }
                    ]
                }
            ]
        },
        {
            day: "Saturday",
            theme: "Skill Work + Extended Flex",
            color: "#c9962e",
            estimated_duration: "60-75 minutes",
            blocks: [
                {
                    id: "m1-sat-skill",
                    name: "Skill Work Block",
                    type: "skill",
                    rounds: 1,
                    exercises: [
                        { id: "m1-sat-s1", name: "Handstand Wall Hold", sets: 5, duration_seconds: "10-15s", rest_after: "60 seconds", how: "Kick up against wall. Hold. Come down controlled.", tip: "Every week you feel slightly more comfortable inverted." },
                        { id: "m1-sat-s2", name: "L-Sit Attempt", sets: 5, duration_seconds: "5-10s", rest_after: "60 seconds", how: "Try to lift body off floor with straight legs.", tip: "The pressing and tension build even if legs stay down." }
                    ]
                },
                {
                    id: "m1-sat-flex",
                    name: "Extended Flexibility Block",
                    type: "flexibility",
                    rounds: 1,
                    exercises: [
                        { id: "m1-sat-f1", name: "Deep Morning Sequence", duration_seconds: "Extended", how: "Full morning sequence with 45s holds.", tip: "Work the tightest areas today." },
                        { id: "m1-sat-f2", name: "Pancake Stretch", duration_seconds: 60, how: "Sit wide, fold forward. Reach from hips.", tip: "Opens inner thighs for wide kicks." }
                    ]
                },
                {
                    id: "m1-sat-ma",
                    name: "Martial Arts Drilling",
                    type: "skill",
                    rounds: 1,
                    exercises: [
                        { id: "m1-sat-ma1", name: "Jab-Cross Drill (200 Reps)", reps: 200, how: "Slow and precise. Focus on hip rotation.", tip: "Builds pattern into muscle memory." }
                    ]
                }
            ]
        },
        {
            day: "Sunday",
            theme: "Rest + Active Recovery",
            color: "#5a5a78",
            estimated_duration: "30 minutes",
            blocks: [
                {
                    id: "m1-sun-recovery",
                    name: "Recovery & Mobility",
                    type: "recovery",
                    rounds: 1,
                    exercises: [
                        { id: "m1-sun-r1", name: "Morning Flexibility", duration_seconds: 600, how: "Full 10-minute sequence." },
                        { id: "m1-sun-r2", name: "Light Walk", duration_seconds: 1200, how: "Comfortable pace outside." },
                        { id: "m1-sun-r3", name: "Full Body Mobility Flow", duration_seconds: 900, how: "Slow joint circles. Neck to ankles." }
                    ]
                }
            ]
        }
    ]
};

export const MONTH_2: WorkoutMonth = {
    ...MONTH_1,
    month: 2,
    push_rounds: 4,
    core_rounds: 3,
    modifications: {
        plank_duration_seconds: 45,
        hollow_body_duration_seconds: 30,
        dead_hang_target_seconds: 45
    },
    days: MONTH_1.days.map(day => {
        const newDay = { ...day };
        if (day.day === "Monday") {
            newDay.blocks = day.blocks.map(block => {
                if (block.type === "push") {
                    return {
                        ...block,
                        rounds: 4,
                        exercises: block.exercises.map(ex => {
                            if (ex.id === "m1-mon-p3b") {
                                return {
                                    id: "m2-new-01",
                                    name: "Archer Push-Ups",
                                    category: "push",
                                    difficulty: "intermediate",
                                    sets: 3,
                                    reps: "5 each side",
                                    how: "Lower toward one hand while keeping other arm straight.",
                                    tip: "Builds extreme unilateral strength."
                                };
                            }
                            return ex;
                        })
                    };
                }
                return block;
            });
        }
        if (day.day === "Wednesday") {
            newDay.blocks = day.blocks.map(block => {
                if (block.type === "pull") {
                    return {
                        ...block,
                        exercises: [
                            ...block.exercises,
                            {
                                id: "m2-new-02",
                                name: "Negative Pull-Ups",
                                category: "pull",
                                difficulty: "intermediate",
                                sets: 5,
                                reps: 3,
                                how: "Lower yourself as slowly as possible (5s).",
                                tip: "Fast-track to your first pull-up."
                            }
                        ]
                    };
                }
                return block;
            });
        }
        return newDay;
    })
};

export const MONTH_3: WorkoutMonth = {
    ...MONTH_2,
    month: 3,
    push_rounds: 4,
    core_rounds: 3,
    modifications: {
        plank_duration_seconds: 60,
        hollow_body_duration_seconds: 45,
        dead_hang_target_seconds: 60
    },
    days: MONTH_2.days.map(day => {
        const newDay = { ...day };
        if (day.day === "Monday") {
            newDay.blocks = day.blocks.map(block => {
                if (block.type === "push") {
                    return {
                        ...block,
                        exercises: block.exercises.map(ex => {
                            if (ex.id === "m1-mon-p1") {
                                return {
                                    ...ex,
                                    id: "m3-new-01",
                                    name: "Clap Push-Ups",
                                    difficulty: "advanced",
                                    reps: 5,
                                    how: "Explode up and clap hands in mid-air.",
                                    tip: "Developing extreme upper body power."
                                };
                            }
                            return ex;
                        })
                    };
                }
                return block;
            });
        }
        return newDay;
    })
};

export const MILESTONES = [
    { month: 1, end: { pushups: 15, hang: 30, plank: 45, flexibility: "Fingertips to floor" } },
    { month: 2, end: { pushups: 20, hang: 45, plank: 55, flexibility: "Flat palms approaching floor" } },
    { month: 3, end: { pushups: 25, hang: 60, plank: 60, flexibility: "Flat palms on floor" } }
];
