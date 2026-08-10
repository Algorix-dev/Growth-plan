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
    version: "3.0",
    athlete: "Emmanuel",
    focus: "Calisthenics Strength — Push / Pull / Legs Split + Pull-Up Progression",
    duration: "3 Months",
    baseline: "Pull-ups: ~10 max · Push-ups: 20-40 max · Dips: bodyweight only",
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
            { id: "wu-lsw", name: "Dynamic Leg Swings", sets: 1, reps: "12 each way", how: "Forward/backward and side-to-side swings. Increasing range gradually.", tip: "Essential before any explosive work." },
            { id: "wu-dh", name: "Dead Hang", sets: 1, duration_seconds: 30, how: "Hang from a bar or ledge, shoulders active.", tip: "Primes the grip and shoulders before pull work." }
        ]
    },
    cool_down: {
        id: "cd-01",
        name: "Extended Flexibility Flush",
        exercises: [
            { id: "cd-chp", name: "Child's Pose", duration: "60 seconds", how: "Knees wide, toes touching. Sit back on heels, reach arms forward on floor.", tip: "Calms the nervous system." },
            { id: "cd-pgn", name: "Pigeon Pose", duration: "60 seconds each side", how: "One leg bent in front, other straight behind. Fold over front leg.", tip: "Opens the hips — crucial for kicks and agility." },
            { id: "cd-cbr", name: "Cobra Stretch", duration: "45 seconds", how: "Lie on belly, press chest up. Keep hips on floor.", tip: "Stretches abs and spine." },
            { id: "cd-dsh", name: "Deep Squat Hold", duration: "60 seconds", how: "Full depth squat, elbows inside knees, chest up.", tip: "Builds permanent mobility." }
        ]
    }
};

// ============================================================
// MONTH 1 — Build base, fix form, make training a daily habit.
// Perfect reps over max reps.
// ============================================================
export const MONTH_1: WorkoutMonth = {
    month: 1,
    push_rounds: 3,
    core_rounds: 3,
    days: [
        {
            day: "Monday",
            theme: "Push",
            color: "#c94646",
            estimated_duration: "35-40 minutes",
            blocks: [
                {
                    id: "m1-mon-push",
                    name: "Push Strength Block",
                    type: "push",
                    rounds: 1,
                    note: "Rest 60-90 seconds between sets. Add 2 reps when the last set feels easy.",
                    exercises: [
                        { id: "m1-mon-p1", name: "Pike Push-ups", sets: 4, reps: 8, rest_after: "90 seconds", how: "Hips high, head toward floor.", tip: "Shoulder strength foundation." },
                        { id: "m1-mon-p2", name: "Push-ups", sets: 4, reps: 15, rest_after: "90 seconds", how: "Full chest to floor. 2 seconds down, explode up. Lock out at top.", tip: "Your bread-and-butter rep." },
                        { id: "m1-mon-p3", name: "Diamond Push-ups", sets: 3, reps: 10, rest_after: "90 seconds", how: "Hands form a diamond under chest.", tip: "Isolates triceps." },
                        { id: "m1-mon-p4", name: "Dips", sets: 3, reps: 8, rest_after: "90 seconds", how: "Lean forward for chest, upright for triceps. Full range always.", tip: "Full range, every rep." }
                    ]
                }
            ]
        },
        {
            day: "Tuesday",
            theme: "Pull",
            color: "#4676c9",
            estimated_duration: "35-40 minutes",
            blocks: [
                {
                    id: "m1-tue-pull",
                    name: "Pull Strength Block",
                    type: "pull",
                    rounds: 1,
                    note: "Pull-ups are the priority. Even on bad days — do 5 sets of pull-ups.",
                    exercises: [
                        { id: "m1-tue-p1", name: "Pull-ups", sets: 5, reps: 5, rest_after: "90 seconds", how: "Dead hang start. Chin over bar. No kipping.", tip: "This is your key lift." },
                        { id: "m1-tue-p2", name: "Chin-ups", sets: 3, reps: 6, rest_after: "90 seconds", how: "Underhand grip.", tip: "Easier than pull-ups — good for volume and biceps." },
                        { id: "m1-tue-p3", name: "Inverted Rows", sets: 3, reps: 12, rest_after: "60 seconds", how: "Use a table or low bar. Body straight, pull chest to bar.", tip: "Builds the back muscles pull-ups depend on." },
                        { id: "m1-tue-p4", name: "Dead Hang", sets: 3, duration_seconds: 30, rest_after: "60 seconds", how: "Just hang.", tip: "Grip strength and shoulder decompression. Essential." }
                    ]
                }
            ]
        },
        {
            day: "Wednesday",
            theme: "Legs + Core",
            color: "#46c976",
            estimated_duration: "35-40 minutes",
            blocks: [
                {
                    id: "m1-wed-legs",
                    name: "Legs + Core Block",
                    type: "legs",
                    rounds: 1,
                    note: "No jog today. Dynamic warm-up only before this session.",
                    exercises: [
                        { id: "m1-wed-l1", name: "Squats", sets: 4, reps: 20, rest_after: "60 seconds", how: "Chest up, knees track toes, as deep as possible.", tip: "Full depth is non-negotiable." },
                        { id: "m1-wed-l2", name: "Bulgarian Split Squats", sets: 3, reps: 10, reps_note: "10 each leg", rest_after: "60 seconds", how: "Rear foot elevated. Go slow.", tip: "Destroys quads — great for basketball explosiveness." },
                        { id: "m1-wed-l3", name: "Calf Raises", sets: 4, reps: 20, rest_after: "45 seconds", how: "Single leg if possible. Full range.", tip: "Builds court quickness." },
                        { id: "m1-wed-l4", name: "Plank", sets: 3, duration_seconds: 45, rest_after: "45 seconds", how: "Straight line head to heel. Squeeze everything. Breathe." },
                        { id: "m1-wed-l5", name: "Hollow Body Hold", sets: 3, duration_seconds: 30, rest_after: "45 seconds", how: "Lower back pressed to floor, arms and legs extended low.", tip: "Core foundation." }
                    ]
                }
            ]
        },
        {
            day: "Thursday",
            theme: "Push (lighter)",
            color: "#c94646",
            estimated_duration: "25-30 minutes",
            blocks: [
                {
                    id: "m1-thu-push",
                    name: "Push (Lighter)",
                    type: "push",
                    rounds: 1,
                    note: "Lighter day — don't go to failure. Save energy for Friday's pull session.",
                    exercises: [
                        { id: "m1-thu-p1", name: "Wide Push-ups", sets: 4, reps: 12, rest_after: "75 seconds", how: "Hands wider than shoulder width.", tip: "Outer chest focus." },
                        { id: "m1-thu-p2", name: "Pike Push-ups", sets: 3, reps: 8, rest_after: "75 seconds", how: "Maintain quality. Fewer sets than Monday." },
                        { id: "m1-thu-p3", name: "Tricep Push-ups", sets: 3, reps: 10, rest_after: "75 seconds", how: "Elbows tight to body. Slow and controlled." }
                    ]
                }
            ]
        },
        {
            day: "Friday",
            theme: "Pull (heavier)",
            color: "#4676c9",
            estimated_duration: "35-40 minutes",
            blocks: [
                {
                    id: "m1-fri-pull",
                    name: "Pull (Heavier)",
                    type: "pull",
                    rounds: 1,
                    note: "Negative pull-ups every Friday without exception — this single exercise gets you to 20 pull-ups faster than anything else.",
                    exercises: [
                        { id: "m1-fri-p1", name: "Pull-ups — Volume sets", sets: 7, reps: "3-5", rest_after: "60 seconds", how: "As many sets of 3-5 reps as you can with good form.", tip: "This is your volume day." },
                        { id: "m1-fri-p2", name: "Negative Pull-ups", sets: 3, reps: 5, rest_after: "90 seconds", how: "Jump to top, lower yourself as slowly as possible (5-8 seconds).", tip: "The fastest way to 20 pull-ups." },
                        { id: "m1-fri-p3", name: "Chin-ups", sets: 3, reps: 8, rest_after: "60 seconds", how: "Finish with the easier variation for volume." }
                    ]
                }
            ]
        },
        {
            day: "Saturday",
            theme: "Full Body",
            color: "#c9962e",
            estimated_duration: "30-35 minutes",
            blocks: [
                {
                    id: "m1-sat-full",
                    name: "Full Body Block",
                    type: "full",
                    rounds: 1,
                    exercises: [
                        { id: "m1-sat-f1", name: "Pull-ups", sets: 3, reps: 6, rest_after: "60 seconds", how: "Controlled reps. Not max effort today." },
                        { id: "m1-sat-f2", name: "Push-ups", sets: 3, reps: 15, rest_after: "60 seconds", how: "Moderate pace. Good form throughout." },
                        { id: "m1-sat-f3", name: "Dips", sets: 3, reps: 8, rest_after: "60 seconds", how: "Full range. Slow and controlled." },
                        { id: "m1-sat-f4", name: "Squats", sets: 3, reps: 15, rest_after: "45 seconds", how: "Bodyweight. Light. Get the blood moving." },
                        { id: "m1-sat-f5", name: "Plank", sets: 2, duration_seconds: 60, rest_after: "45 seconds", how: "Hold. Breathe. Don't rush." }
                    ]
                }
            ]
        },
        {
            day: "Sunday",
            theme: "Rest",
            color: "#5a5a78",
            estimated_duration: "Recovery",
            blocks: [
                {
                    id: "m1-sun-rest",
                    name: "Rest Day",
                    type: "recovery",
                    rounds: 1,
                    note: "Growth happens during recovery, not during training. Protect this day.",
                    exercises: [
                        { id: "m1-sun-r1", name: "Light Stretching", duration_seconds: 600, how: "Full rest. Light stretching only — nothing strenuous." }
                    ]
                }
            ]
        }
    ]
};

// ============================================================
// MONTH 2 — Increase volume and intensity. Harder variations.
// Target 15 pull-ups and 50+ push-ups.
// ============================================================
export const MONTH_2: WorkoutMonth = {
    month: 2,
    push_rounds: 4,
    core_rounds: 3,
    days: [
        {
            day: "Monday",
            theme: "Push (advanced)",
            color: "#c94646",
            estimated_duration: "40-45 minutes",
            blocks: [
                {
                    id: "m2-mon-push",
                    name: "Push (Advanced)",
                    type: "push",
                    rounds: 1,
                    exercises: [
                        { id: "m2-mon-p1", name: "Elevated Pike Push-ups", sets: 4, reps: 8, rest_after: "90 seconds", how: "Feet on a chair. Much harder.", tip: "Builds toward handstand push-up." },
                        { id: "m2-mon-p2", name: "Push-ups", sets: 4, reps: 20, rest_after: "90 seconds", how: "Now targeting 20+ reps per set.", tip: "Add 2-3 from Month 1." },
                        { id: "m2-mon-p3", name: "Archer Push-ups", sets: 3, reps: 6, reps_note: "6 each side", rest_after: "90 seconds", how: "Shift weight to one arm as you descend.", tip: "Building toward one-arm." },
                        { id: "m2-mon-p4", name: "Dips with pause", sets: 4, reps: 10, rest_after: "90 seconds", how: "Add a 2-second pause at the bottom for extra tension." }
                    ]
                }
            ]
        },
        {
            day: "Tuesday",
            theme: "Pull (advanced)",
            color: "#4676c9",
            estimated_duration: "40-45 minutes",
            blocks: [
                {
                    id: "m2-tue-pull",
                    name: "Pull (Advanced)",
                    type: "pull",
                    rounds: 1,
                    note: "If you can do 10 pull-ups in one set — start weighted pull-ups with a backpack of books.",
                    exercises: [
                        { id: "m2-tue-p1", name: "Pull-ups", sets: 5, reps: 7, rest_after: "90 seconds", how: "Target 7-8 reps per set. Still strict form. No kipping." },
                        { id: "m2-tue-p2", name: "L-sit Pull-ups", sets: 3, reps: 4, rest_after: "90 seconds", how: "Legs straight out while pulling.", tip: "Brutal core + pull combo." },
                        { id: "m2-tue-p3", name: "Negative Pull-ups", sets: 4, reps: 4, rest_after: "90 seconds", how: "8-10 second descent now. Slower = stronger.", tip: "Every Friday, non-negotiable." },
                        { id: "m2-tue-p4", name: "Feet-elevated Inverted Rows", sets: 4, reps: 12, rest_after: "60 seconds", how: "Feet on a chair, body straight.", tip: "Significantly harder than the floor version." }
                    ]
                }
            ]
        },
        {
            day: "Wednesday",
            theme: "Legs + Core (harder)",
            color: "#46c976",
            estimated_duration: "40-45 minutes",
            blocks: [
                {
                    id: "m2-wed-legs",
                    name: "Legs + Core (Harder)",
                    type: "legs",
                    rounds: 1,
                    exercises: [
                        { id: "m2-wed-l1", name: "Jump Squats", sets: 4, reps: 15, rest_after: "75 seconds", how: "Explosive. Land soft.", tip: "Direct basketball athleticism training." },
                        { id: "m2-wed-l2", name: "Pistol Squat Progression", sets: 3, reps: 6, reps_note: "6 each leg", rest_after: "75 seconds", how: "Assisted single-leg squats. Hold a pole for balance.", tip: "Work toward a full pistol." },
                        { id: "m2-wed-l3", name: "Single-leg Calf Raises", sets: 4, reps: 20, reps_note: "20 each leg", rest_after: "45 seconds", how: "Full range. All the way up and down.", tip: "Builds vertical and court quickness." },
                        { id: "m2-wed-l4", name: "Hollow Body Rocks", sets: 3, reps: 20, rest_after: "45 seconds", how: "Rock forward and back maintaining hollow position.", tip: "Core on fire." }
                    ]
                }
            ]
        },
        {
            day: "Thursday",
            theme: "Push (lighter, advanced)",
            color: "#c94646",
            estimated_duration: "30 minutes",
            blocks: [
                {
                    id: "m2-thu-push",
                    name: "Push (Lighter, Advanced)",
                    type: "push",
                    rounds: 1,
                    note: "Thu/Fri/Sat repeat the push/pull/legs rotation — add 1-2 reps to each set every week. Progressive overload is the engine.",
                    exercises: [
                        { id: "m2-thu-p1", name: "Wide Push-ups", sets: 4, reps: 14, rest_after: "75 seconds", how: "Hands wider than shoulder width." },
                        { id: "m2-thu-p2", name: "Elevated Pike Push-ups", sets: 3, reps: 8, rest_after: "75 seconds", how: "Feet on a chair. Maintain quality." },
                        { id: "m2-thu-p3", name: "Tricep Push-ups", sets: 3, reps: 12, rest_after: "75 seconds", how: "Elbows tight to body." }
                    ]
                }
            ]
        },
        {
            day: "Friday",
            theme: "Pull (heavier, advanced)",
            color: "#4676c9",
            estimated_duration: "40-45 minutes",
            blocks: [
                {
                    id: "m2-fri-pull",
                    name: "Pull (Heavier, Advanced)",
                    type: "pull",
                    rounds: 1,
                    note: "Negative pull-ups every Friday, non-negotiable.",
                    exercises: [
                        { id: "m2-fri-p1", name: "Pull-ups — Volume sets", sets: 8, reps: "4-6", rest_after: "60 seconds", how: "As many sets of 4-6 reps as you can with good form." },
                        { id: "m2-fri-p2", name: "Negative Pull-ups", sets: 4, reps: 4, rest_after: "90 seconds", how: "8-10 second descent." },
                        { id: "m2-fri-p3", name: "Chin-ups", sets: 3, reps: 10, rest_after: "60 seconds", how: "Finish with the easier variation for volume." }
                    ]
                }
            ]
        },
        {
            day: "Saturday",
            theme: "Full Body (advanced)",
            color: "#c9962e",
            estimated_duration: "35-40 minutes",
            blocks: [
                {
                    id: "m2-sat-full",
                    name: "Full Body (Advanced)",
                    type: "full",
                    rounds: 1,
                    exercises: [
                        { id: "m2-sat-f1", name: "Pull-ups", sets: 4, reps: 8, rest_after: "60 seconds", how: "Controlled reps at a solid pace." },
                        { id: "m2-sat-f2", name: "Push-ups", sets: 3, reps: 20, rest_after: "60 seconds", how: "Moderate pace. Good form throughout." },
                        { id: "m2-sat-f3", name: "Dips", sets: 3, reps: 12, rest_after: "60 seconds", how: "Full range. Slow and controlled." },
                        { id: "m2-sat-f4", name: "Jump Squats", sets: 3, reps: 12, rest_after: "60 seconds", how: "Explosive, soft landings." },
                        { id: "m2-sat-f5", name: "Plank", sets: 2, duration_seconds: 75, rest_after: "45 seconds", how: "Hold. Breathe." }
                    ]
                }
            ]
        },
        {
            day: "Sunday",
            theme: "Rest",
            color: "#5a5a78",
            estimated_duration: "Recovery",
            blocks: [
                {
                    id: "m2-sun-rest",
                    name: "Rest Day",
                    type: "recovery",
                    rounds: 1,
                    note: "Growth happens during recovery, not during training.",
                    exercises: [
                        { id: "m2-sun-r1", name: "Light Stretching", duration_seconds: 600, how: "Full rest. Light stretching only." }
                    ]
                }
            ]
        }
    ]
};

// ============================================================
// MONTH 3 — Peak strength. 20 pull-ups in one set. Push-ups
// past 50. Skill work — L-sit, handstand holds, muscle-up prep.
// ============================================================
export const MONTH_3: WorkoutMonth = {
    month: 3,
    push_rounds: 4,
    core_rounds: 3,
    days: [
        {
            day: "Monday",
            theme: "Max Push",
            color: "#c94646",
            estimated_duration: "45-50 minutes",
            blocks: [
                {
                    id: "m3-mon-push",
                    name: "Max Push",
                    type: "push",
                    rounds: 1,
                    exercises: [
                        { id: "m3-mon-p1", name: "Wall Handstand Push-up", sets: 4, reps: 5, rest_after: "120 seconds", how: "Head to floor, press up against wall.", tip: "Peak push skill in calisthenics." },
                        { id: "m3-mon-p2", name: "Push-ups — Max rep", sets: 3, reps: "max", rest_after: "120 seconds", how: "Go for 40-50+.", tip: "Pace yourself — don't blow out in set 1." },
                        { id: "m3-mon-p3", name: "Archer Push-ups", sets: 4, reps: 8, reps_note: "8 each side", rest_after: "90 seconds", how: "More weight on one arm each rep.", tip: "Close to one-arm territory." },
                        { id: "m3-mon-p4", name: "Weighted Dips", sets: 4, reps: 8, rest_after: "90 seconds", how: "Backpack with books, 3-5kg to start.", tip: "Add load gradually." }
                    ]
                }
            ]
        },
        {
            day: "Tuesday",
            theme: "Max Pull",
            color: "#4676c9",
            estimated_duration: "45-50 minutes",
            blocks: [
                {
                    id: "m3-tue-pull",
                    name: "Max Pull",
                    type: "pull",
                    rounds: 1,
                    note: "Track your max pull-up rep count every Tuesday. By end of Month 3 — 18-22 reps.",
                    exercises: [
                        { id: "m3-tue-p1", name: "Pull-ups — Max test", sets: 1, reps: "max", rest_after: "180 seconds", how: "First set: absolute max. Rest 3 minutes.", tip: "Then 3 sets at 60% of that max." },
                        { id: "m3-tue-p2", name: "Weighted Pull-ups", sets: 4, reps: 5, rest_after: "90 seconds", how: "Backpack on, 5kg.", tip: "Build toward 10+ weighted reps." },
                        { id: "m3-tue-p3", name: "L-sit Pull-ups", sets: 3, reps: 5, rest_after: "90 seconds", how: "Legs out, full pull.", tip: "Absolute strength + core." },
                        { id: "m3-tue-p4", name: "Negative Pull-ups", sets: 3, reps: 5, rest_after: "90 seconds", how: "10-second descent.", tip: "Still non-negotiable every Friday." }
                    ]
                }
            ]
        },
        {
            day: "Wednesday",
            theme: "Skills Day",
            color: "#c9962e",
            estimated_duration: "40 minutes",
            blocks: [
                {
                    id: "m3-wed-skills",
                    name: "Skills Day",
                    type: "skill",
                    rounds: 1,
                    exercises: [
                        { id: "m3-wed-s1", name: "L-sit Hold", sets: 5, duration_seconds: "max hold", rest_after: "60 seconds", how: "On parallel bars or floor. 5-10 seconds to start.", tip: "Build up weekly." },
                        { id: "m3-wed-s2", name: "Wall Handstand", sets: 5, duration_seconds: "20-60", rest_after: "60 seconds", how: "Kick up to wall. Hold.", tip: "Build to 60 seconds — shoulder and wrist conditioning." },
                        { id: "m3-wed-s3", name: "Jump Muscle-up", sets: 1, reps: 5, rest_after: "120 seconds", how: "Jump, pull, and push over the bar.", tip: "5 attempts, working toward strict muscle-up." }
                    ]
                }
            ]
        },
        {
            day: "Thursday",
            theme: "Push (peak volume)",
            color: "#c94646",
            estimated_duration: "35-40 minutes",
            blocks: [
                {
                    id: "m3-thu-push",
                    name: "Push (Peak Volume)",
                    type: "push",
                    rounds: 1,
                    note: "Repeat the push/pull/legs rotation from Mon/Tue/Wed at slightly reduced volume — this is a recovery-flavoured repeat, not a new max.",
                    exercises: [
                        { id: "m3-thu-p1", name: "Push-ups", sets: 4, reps: "max", rest_after: "90 seconds", how: "Steady pace, full range every rep." },
                        { id: "m3-thu-p2", name: "Pike Push-ups", sets: 3, reps: 10, rest_after: "90 seconds", how: "Feet on the floor today — quality over intensity." },
                        { id: "m3-thu-p3", name: "Dips", sets: 3, reps: 12, rest_after: "90 seconds", how: "Full range, controlled tempo." }
                    ]
                }
            ]
        },
        {
            day: "Friday",
            theme: "Pull (peak volume)",
            color: "#4676c9",
            estimated_duration: "40-45 minutes",
            blocks: [
                {
                    id: "m3-fri-pull",
                    name: "Pull (Peak Volume)",
                    type: "pull",
                    rounds: 1,
                    note: "Negative pull-ups every Friday without exception — this single exercise gets you to 20 pull-ups faster than anything else.",
                    exercises: [
                        { id: "m3-fri-p1", name: "Pull-ups — Volume sets", sets: 8, reps: "5-6", rest_after: "60 seconds", how: "As many sets of 5-6 reps as you can with good form." },
                        { id: "m3-fri-p2", name: "Negative Pull-ups", sets: 3, reps: 5, rest_after: "90 seconds", how: "10-second descent." },
                        { id: "m3-fri-p3", name: "Chin-ups", sets: 3, reps: 10, rest_after: "60 seconds", how: "Finish with the easier variation for volume." }
                    ]
                }
            ]
        },
        {
            day: "Saturday",
            theme: "Full Body Peak",
            color: "#c9962e",
            estimated_duration: "40-45 minutes",
            blocks: [
                {
                    id: "m3-sat-full",
                    name: "Full Body Peak",
                    type: "full",
                    rounds: 1,
                    exercises: [
                        { id: "m3-sat-f1", name: "Pull-ups", sets: 4, reps: 10, rest_after: "60 seconds", how: "Controlled, near your new max." },
                        { id: "m3-sat-f2", name: "Push-ups", sets: 3, reps: 25, rest_after: "60 seconds", how: "Steady pace, full range." },
                        { id: "m3-sat-f3", name: "Weighted Dips", sets: 3, reps: 10, rest_after: "60 seconds", how: "Light load, controlled tempo." },
                        { id: "m3-sat-f4", name: "Jump Squats", sets: 3, reps: 15, rest_after: "60 seconds", how: "Max height, soft landings." },
                        { id: "m3-sat-f5", name: "L-sit Hold", sets: 3, duration_seconds: "max hold", rest_after: "60 seconds", how: "Test where your hold has gotten to." }
                    ]
                }
            ]
        },
        {
            day: "Sunday",
            theme: "Rest",
            color: "#5a5a78",
            estimated_duration: "Recovery",
            blocks: [
                {
                    id: "m3-sun-rest",
                    name: "Rest Day",
                    type: "recovery",
                    rounds: 1,
                    note: "Growth happens during recovery, not during training.",
                    exercises: [
                        { id: "m3-sun-r1", name: "Light Stretching", duration_seconds: 600, how: "Full rest. Light stretching only." }
                    ]
                }
            ]
        }
    ]
};

export const MILESTONES = [
    { month: 1, end: { pullups: "13-15 reps", pushups: "35-50 reps", dips: "15-20 reps" } },
    { month: 2, end: { pullups: "15-18 reps", pushups: "50+ reps", dips: "weighted, 5kg" } },
    { month: 3, end: { pullups: "18-22 reps 🎯", pushups: "55-70 reps 🎯", dips: "weighted 5-10kg 🎯" } }
];

// General training tips, straight from the plan — surface these
// anywhere in the UI you want a rotating reminder.
export const TRAINING_TIPS = [
    { title: "Warm up every session", body: "5 minutes minimum. Arm circles, shoulder rolls, cat-cow, dead hang 30 seconds. Cold muscles tear. Never skip." },
    { title: "The 2-rep rule", body: "When the last set of any exercise feels easy — add 2 reps next session. Not 5. Not 10. 2. This prevents plateaus without burning out." },
    { title: "Negative pull-ups every Friday", body: "Lower in 5-10 seconds. This single exercise gets you to 20 pull-ups faster than anything else. Non-negotiable." },
    { title: "No jog on leg day", body: "Jog on push and pull days only. On leg day — dynamic warm-up only. Jogging before squats drains your legs before the session that needs them most." },
    { title: "Sleep is the program", body: "You grow during sleep. 7-8 hours minimum. Sleeping 5 hours and training hard is counterproductive — the gains don't stick without recovery." },
    { title: "Eat enough protein", body: "Eggs, beans, fish, chicken. Protein at every meal. Without it, training tears muscle down but can't rebuild it." },
    { title: "Basketball counts", body: "Court sessions are conditioning. On heavy basketball days, reduce calisthenics volume by 30%. Respect your body's limits." }
];
