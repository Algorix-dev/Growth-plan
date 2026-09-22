export interface Goal {
    id: string;
    icon: string;
    title: string;
    color: string;
    tagline: string;
    phases: {
        id: string;
        t: string;
        d: string;
        o: number;
        done: boolean;
    }[];
}

export interface Topic {
    id: string;
    title: string;
    completed: boolean;
}

export interface Score {
    label: string;
    value: number;
}

export interface Course {
    id: string;
    code: string;
    name: string;
    color: string;
    category: string;
    units: number;
    topics: Topic[];
    scores: Score[];
}

export interface Habit {
    label: string;
    category: string;
    color: string;
}

export const initialGoals: Goal[] = [
    {
        id: "g1", icon: '🎓', title: 'FIRST-CLASS GRADES', color: 'blue',
        tagline: 'Lectures are revision. You already know it when you walk in.',
        phases: [
            { id: "p1", t: 'Self-study every course before lectures', d: 'Use YouTube, slides, textbooks. Know 70% before entering.', o: 1, done: false },
            { id: "p2", t: 'Cornell note system + 24hr review', d: 'Rewrite in Cornell format — cue column, notes, summary.', o: 2, done: false },
            { id: "p3", t: 'Anki spaced repetition — daily', d: '15 cards every 3AM session. Build a deck for each course.', o: 3, done: false },
            { id: "p4", t: 'Past questions — every course', d: 'Collect papers, do them timed. Map the question patterns.', o: 4, done: false },
            { id: "p5", t: 'Teach-back method', d: 'Explain it aloud. If you can\'t explain it simply, you don\'t know it.', o: 5, done: false },
        ]
    },
    {
        id: "g2", icon: '💻', title: 'PROGRAMMING MASTERY', color: 'purple',
        tagline: 'Not just writing code. Engineering systems that actually work.',
        phases: [
            { id: "p6", t: 'OOP mastery — 3 complete projects', d: 'Bank, Student Manager, CLI Inventory tool. Pure OOP.', o: 1, done: false },
            { id: "p7", t: 'Data structures & algorithms', d: 'Arrays to HashMaps. One structure per week. LeetCode Easy.', o: 2, done: false },
            { id: "p8", t: 'LeetCode daily streak', d: '3:30AM: one problem every day. Learn the pattern.', o: 3, done: false },
            { id: "p9", t: 'One real project per month', d: 'Solve a real problem. Push to GitHub with clean README.', o: 4, done: false },
            { id: "p10", t: 'System design thinking', d: 'Architect before coding. Draw classes and relationships.', o: 5, done: false },
        ]
    },
    {
        id: "g3", icon: '📈', title: 'TRADING & FINANCIAL INDEPENDENCE', color: 'red',
        tagline: 'Logic over emotion. Structured execution. Wealth through discipline.',
        phases: [
            { id: "p11", t: 'Market structure identification', d: 'Mark HH/HL/LH/LL on 3 pairs daily for 30 days.', o: 1, done: false },
            { id: "p12", t: 'BOS identification mastery', d: 'Identify real Break of Structure vs fakeouts. Log 20 examples.', o: 2, done: false },
            { id: "p13", t: 'Multi-timeframe analysis system', d: 'Weekly → Daily → 4H → 1H. Top-down execution only.', o: 3, done: false },
            { id: "p14", t: 'Risk management — 1% rule', d: 'Max 1-2% risk per trade. R:R minimum 1:2. Journal everything.', o: 4, done: false },
            { id: "p15", t: '90-day demo discipline → live', d: '60%+ win rate × 90 days = permission to go live.', o: 5, done: false },
        ]
    },
    {
        id: "g4", icon: '🏋️', title: 'ATHLETIC & PHYSIQUE EVOLUTION', color: 'green',
        tagline: 'Athletic. Defined. Flexible. Your body reflects your discipline.',
        phases: [
            { id: "p16", t: 'Calisthenics — 3x/week structured', d: 'Push, Pull, Circuit. Track reps every session.', o: 1, done: false },
            { id: "p17", t: 'Daily flexibility — 10 minutes', d: 'Focus on hamstrings/hips/spine. Goal: touch toes in 6 weeks.', o: 2, done: false },
            { id: "p18", t: 'Basketball IQ + defensive discipline', d: 'Film games. Fix one defensive weakness per week.', o: 3, done: false },
            { id: "p19", t: 'Nutrition — fuel the machine', d: 'Protein every meal. 3L water daily. Sleep = growth.', o: 4, done: false },
            { id: "p20", t: '6-month physique target', d: 'Athletic V-taper. Milestones: 30 push-ups, 10 pull-ups.', o: 5, done: false },
        ]
    },
    {
        id: "g5", icon: '🤝', title: 'SOCIAL COMPOSURE & CONFIDENCE', color: 'cyan',
        tagline: 'Quiet capability. The room feels you before you speak.',
        phases: [
            { id: "p21", t: 'The pause — 2s before reacting', d: 'Pause everywhere. Practiced composure in every interaction.', o: 1, done: false },
            { id: "p22", t: 'Speaking to girls — confident/natural', d: 'Genuine curiosity. Eye contact. Respond slowly.', o: 2, done: false },
            { id: "p23", t: 'Boundary setting — calm and firm', d: 'Calmly state boundaries without explanation. Hold them.', o: 3, done: false },
            { id: "p24", t: 'Presence — speak less, mean more', d: 'Cut word count by half. Comfort in silence = respect.', o: 4, done: false },
            { id: "p25", t: 'Manipulation detection', d: 'Study guilt tripping, DARVO. Never use them. Influence ethically.', o: 5, done: false },
        ]
    },
    {
        id: "g6", icon: '✨', title: 'SPIRITUAL ALIGNMENT', color: 'gold',
        tagline: 'Not ritual. Anchor. Discipline flows from here.',
        phases: [
            { id: "p26", t: 'Manna app — 3AM daily', d: 'First action of the day. sets the tone. No exceptions.', o: 1, done: false },
            { id: "p27", t: 'Specific prayer — name your goals', d: 'Specific faith attracts specific results. Name the mission.', o: 2, done: false },
            { id: "p28", t: 'Consistency over intensity', d: 'Daily show-up beats sporadic intensity. One Verse. One Minute.', o: 3, done: false },
            { id: "p29", t: 'Weekly alignment audit — Sunday', d: 'Are my actions matching my values? Honest assessment.', o: 4, done: false },
        ]
    },
];

export const initialCourses: Course[] = [
    {
        id: "1", code: 'CSC301', name: 'Data Structures', color: '#8e68c4', category: 'tech', units: 3,
        topics: [
            { id: "t1", title: "Arrays & Linked Lists", completed: false },
            { id: "t2", title: "Stacks & Queues", completed: false },
            { id: "t3", title: "Trees & Heaps", completed: false },
            { id: "t4", title: "Sorting Algorithms (Merge/Quick Sort)", completed: false },
            { id: "t5", title: "Time & Space Complexity", completed: false },
            { id: "t6", title: "Graph Basics", completed: false },
        ],
        scores: []
    },
    {
        id: "2", code: 'CSC309', name: 'Artificial Intelligence', color: '#a06aff', category: 'tech', units: 2,
        topics: [
            { id: "t7", title: "Search Algorithms (BFS/DFS/A*)", completed: false },
            { id: "t8", title: "Knowledge Representation", completed: false },
            { id: "t9", title: "Game Playing (Minimax)", completed: false },
            { id: "t10", title: "Intro to Machine Learning", completed: false },
            { id: "t11", title: "Expert Systems", completed: false },
        ],
        scores: []
    },
    {
        id: "3", code: 'CYB201', name: 'Introduction to Cybersecurity and Strategy', color: '#c45a8e', category: 'tech', units: 2,
        topics: [
            { id: "t12", title: "CIA Triad", completed: false },
            { id: "t13", title: "Common Attack Types", completed: false },
            { id: "t14", title: "Risk Management", completed: false },
            { id: "t15", title: "Security Frameworks", completed: false },
            { id: "t16", title: "Cryptography Basics", completed: false },
        ],
        scores: []
    },
    {
        id: "4", code: 'ICT305', name: 'Data Communication System and Network', color: '#38bfb0', category: 'tech', units: 3,
        topics: [
            { id: "t17", title: "OSI Model", completed: false },
            { id: "t18", title: "Error Detection (Hamming/CRC)", completed: false },
            { id: "t19", title: "MAC & CSMA/CD vs CSMA/CA", completed: false },
            { id: "t20", title: "Client-Server vs Peer-to-Peer", completed: false },
            { id: "t21", title: "Bit Rate & Baud Rate", completed: false },
        ],
        scores: []
    },
    {
        id: "5", code: 'CUACOS311', name: 'Interaction Design', color: '#d47a2a', category: 'design', units: 3,
        topics: [
            { id: "t22", title: "User-Centered Design Process", completed: false },
            { id: "t23", title: "Usability Heuristics", completed: false },
            { id: "t24", title: "Prototyping", completed: false },
            { id: "t25", title: "Evaluation Methods", completed: false },
            { id: "t26", title: "Wireframing", completed: false },
        ],
        scores: []
    },
    {
        id: "6", code: 'CUACSC311', name: 'Programming Language Syntax', color: '#4a8fd4', category: 'tech', units: 2,
        topics: [
            { id: "t27", title: "BNF / EBNF Grammar", completed: false },
            { id: "t28", title: "Parsing", completed: false },
            { id: "t29", title: "Syntax vs Semantics", completed: false },
            { id: "t30", title: "Context-Free Grammars", completed: false },
        ],
        scores: []
    },
    {
        id: "7", code: 'CUACSC313', name: 'Theory of Computation', color: '#d4a843', category: 'tech', units: 2,
        topics: [
            { id: "t31", title: "DFA & NFA", completed: false },
            { id: "t32", title: "Regular Languages", completed: false },
            { id: "t33", title: "Context-Free Grammars & PDA", completed: false },
            { id: "t34", title: "Turing Machines", completed: false },
            { id: "t35", title: "Decidability", completed: false },
        ],
        scores: []
    },
    {
        id: "8", code: 'CUACSC315', name: 'Functional Programming with ML', color: '#3abf6a', category: 'tech', units: 3,
        topics: [
            { id: "t36", title: "Pure Functions & Immutability", completed: false },
            { id: "t37", title: "Recursion", completed: false },
            { id: "t38", title: "Higher-Order Functions", completed: false },
            { id: "t39", title: "Pattern Matching", completed: false },
        ],
        scores: []
    },
];

export const initialHabits: Habit[] = [
    { label: '3AM Wake-up', category: 'Foundation', color: 'border-gold text-gold' },
    { label: 'Manna Devotion', category: 'Spiritual', color: 'border-gold text-gold' },
    { label: 'Morning Prayer', category: 'Spiritual', color: 'border-gold text-gold' },
    { label: 'Academic Self-Study (2+ hrs)', category: 'Grades', color: 'border-blue text-blue' },
    { label: 'LeetCode / Coding Session', category: 'Programming', color: 'border-purple text-purple' },
    { label: 'Calisthenics Training', category: 'Physical', color: 'border-green text-green' },
    { label: 'Flexibility / Stretching', category: 'Physical', color: 'border-green text-green' },
    { label: 'Trading Chart Study', category: 'Trading', color: 'border-red text-red' },
    { label: 'Trade Journal Updated', category: 'Trading', color: 'border-red text-red' },
    { label: 'Grooming & Style Check', category: 'Identity', color: 'border-pink text-pink' },
    { label: 'Posture Check (hourly)', category: 'Identity', color: 'border-pink text-pink' },
    { label: 'Daily Review Written', category: 'Discipline', color: 'border-gold-light text-gold-light' },
    { label: '9PM Sleep — no exceptions', category: 'Foundation', color: 'border-gold text-gold' },
];

export const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export interface ScheduleBlock {
    time: string;
    cat: string;
    emoji: string;
    title: string;
    dur: string;
}

export interface DayData {
    courses: string;
    tag: string;
    blocks: ScheduleBlock[];
}

export interface CommuteInfo {
    busDeparts: string;    // e.g. "8:00–8:40"
    campusArrival: string; // e.g. "~8:40AM"
    note: string;          // e.g. "No exceptions. Arrive before the crowd."
}

export const defaultCommute: CommuteInfo = {
    busDeparts: "8:00–8:40",
    campusArrival: "~8:40AM",
    note: "No exceptions. Arrive before the crowd.",
};

export const scheduleData: Record<string, DayData> = {
    MON: {
        courses: "CUACOS311 (11AM–1PM) · ICT305 (2PM–5PM)",
        tag: "2 Lectures · Busy Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna devotion + focused prayer", dur: "30m" },
            { time: "3:30AM", cat: "study", emoji: "📖", title: "CUACOS311 self-study — Interaction Design principles", dur: "60m" },
            { time: "4:30AM", cat: "study", emoji: "📖", title: "ICT305 self-study — networking fundamentals", dur: "45m" },
            { time: "5:15AM", cat: "code", emoji: "💻", title: "LeetCode / project work", dur: "45m" },
            { time: "6:00AM", cat: "body", emoji: "🤸", title: "Calisthenics — Push + Core circuit", dur: "40m" },
            { time: "6:40AM", cat: "style", emoji: "🪞", title: "Shower · Grooming · Fit selection", dur: "35m" },
            { time: "8:00AM", cat: "transit", emoji: "🚌", title: "Bus to campus · Audio revision", dur: "40m" },
            { time: "8:40AM", cat: "break", emoji: "☕", title: "Breakfast on campus · Social time", dur: "60m" },
            { time: "9:40AM", cat: "study", emoji: "📖", title: "On-campus prep — review CUACOS311/ICT305 notes", dur: "80m" },
            { time: "11:00AM", cat: "lecture", emoji: "🏫", title: "CUACOS311 — Interaction Design", dur: "120m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Lunch + rest", dur: "60m" },
            { time: "2:00PM", cat: "lecture", emoji: "🏫", title: "ICT305 — Data Communication System and Network", dur: "180m" },
            { time: "5:00PM", cat: "transit", emoji: "🚌", title: "Return bus · Reflection", dur: "30m" },
            { time: "5:30PM", cat: "trade", emoji: "📈", title: "Market analysis · Chart structure", dur: "45m" },
            { time: "6:15PM", cat: "body", emoji: "🏀", title: "Basketball / football", dur: "50m" },
            { time: "7:05PM", cat: "review", emoji: "📝", title: "Daily academic review", dur: "40m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep. Exactly 6 hours.", dur: "6h" },
        ]
    },
    TUE: {
        courses: "CUACSC311 (11AM–1PM) · CSC309 (2PM–4PM)",
        tag: "2 Lectures · Lighter Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + prayer", dur: "25m" },
            { time: "3:25AM", cat: "study", emoji: "📖", title: "CUACSC311 self-study — grammar / BNF notation", dur: "55m" },
            { time: "4:20AM", cat: "study", emoji: "📖", title: "CSC309 self-study — search algorithms", dur: "55m" },
            { time: "5:15AM", cat: "study", emoji: "📖", title: "Past questions review — CUACSC311 & CSC309", dur: "30m" },
            { time: "11:00AM", cat: "lecture", emoji: "🏫", title: "CUACSC311 — Programming Language Syntax", dur: "120m" },
            { time: "2:00PM", cat: "lecture", emoji: "🏫", title: "CSC309 — Artificial Intelligence", dur: "120m" },
            { time: "4:00PM", cat: "transit", emoji: "🚌", title: "Return bus · Reflection", dur: "30m" },
            { time: "4:30PM", cat: "trade", emoji: "📈", title: "Market analysis · Chart structure", dur: "45m" },
            { time: "5:15PM", cat: "body", emoji: "🏀", title: "Basketball / football", dur: "50m" },
            { time: "6:05PM", cat: "review", emoji: "📝", title: "Daily academic review", dur: "40m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep. Recover fully.", dur: "6h" },
        ]
    },
    WED: {
        courses: "CSC301 (9AM–11AM) · CYB201 (11AM–1PM)",
        tag: "2 Lectures · Back-to-Back Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + Prayer Force", dur: "30m" },
            { time: "3:30AM", cat: "study", emoji: "📖", title: "CSC301 deep study — Data Structures", dur: "90m" },
            { time: "5:00AM", cat: "study", emoji: "📖", title: "CYB201 self-study — CIA triad & threat basics", dur: "60m" },
            { time: "6:00AM", cat: "body", emoji: "🧘", title: "Flexibility & Mobility Session", dur: "30m" },
            { time: "9:00AM", cat: "lecture", emoji: "🏫", title: "CSC301 — Data Structures", dur: "120m" },
            { time: "11:00AM", cat: "lecture", emoji: "🏫", title: "CYB201 — Introduction to Cybersecurity and Strategy", dur: "120m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Lunch", dur: "45m" },
            { time: "1:45PM", cat: "study", emoji: "📖", title: "Library session — CSC301/CYB201 revision", dur: "120m" },
            { time: "4:00PM", cat: "trade", emoji: "📈", title: "Market session — BOS identification", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep. Rest is discipline.", dur: "6h" },
        ]
    },
    THU: {
        courses: "No lectures",
        tag: "Free Day · Catch-Up & Deep Work",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + Prayer", dur: "30m" },
            { time: "3:30AM", cat: "code", emoji: "💻", title: "Deep Work — Project Building", dur: "90m" },
            { time: "5:00AM", cat: "code", emoji: "💻", title: "LeetCode Daily Challenge", dur: "45m" },
            { time: "9:00AM", cat: "study", emoji: "📖", title: "Week syllabus catch-up — all courses", dur: "120m" },
            { time: "11:00AM", cat: "code", emoji: "💻", title: "Deep Work — Project Building", dur: "120m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Lunch", dur: "45m" },
            { time: "2:00PM", cat: "trade", emoji: "📈", title: "Market session — study & review", dur: "60m" },
            { time: "4:30PM", cat: "body", emoji: "🏀", title: "Basketball Training", dur: "90m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep.", dur: "6h" },
        ]
    },
    FRI: {
        courses: "CUACSC313 (9AM–11AM) · CUACSC315 (11AM–1PM)",
        tag: "2 Lectures · End Strong",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + Prayer", dur: "30m" },
            { time: "3:30AM", cat: "study", emoji: "📖", title: "CUACSC313 self-study — DFA/NFA practice", dur: "60m" },
            { time: "4:30AM", cat: "study", emoji: "📖", title: "CUACSC315 self-study — functional programming basics", dur: "60m" },
            { time: "5:30AM", cat: "body", emoji: "🤸", title: "Calisthenics — Pull session", dur: "45m" },
            { time: "9:00AM", cat: "lecture", emoji: "🏫", title: "CUACSC313 — Theory of Computation", dur: "120m" },
            { time: "11:00AM", cat: "lecture", emoji: "🏫", title: "CUACSC315 — Functional Programming with ML", dur: "120m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Lunch", dur: "30m" },
            { time: "1:30PM", cat: "review", emoji: "📝", title: "Weekly review initiation", dur: "60m" },
            { time: "4:30PM", cat: "trade", emoji: "📈", title: "End of week market review", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep.", dur: "6h" },
        ]
    },
    SAT: {
        courses: "No lectures",
        tag: "Full Autonomy · Max Output",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Prophetic Prayer + Manna", dur: "60m" },
            { time: "4:00AM", cat: "code", emoji: "💻", title: "Deep Work — Project Building", dur: "180m" },
            { time: "7:00AM", cat: "body", emoji: "🤸", title: "Intensive Calisthenics", dur: "60m" },
            { time: "8:00AM", cat: "break", emoji: "🍳", title: "Balanced Breakfast + Rest", dur: "60m" },
            { time: "9:00AM", cat: "study", emoji: "📖", title: "Week syllabus catch-up", dur: "120m" },
            { time: "11:00AM", cat: "trade", emoji: "📊", title: "Fundamental Analysis Study", dur: "120m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Lunch", dur: "6h" },
            { time: "5:00PM", cat: "style", emoji: "✂️", title: "Grooming / Maintenance", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep.", dur: "6h" },
        ]
    },
    SUN: {
        courses: "No lectures",
        tag: "Spiritual + Planning Day",
        blocks: [
            { time: "3:00AM", cat: "spirit", emoji: "🙏", title: "Manna + Prayer Force", dur: "60m" },
            { time: "8:00AM", cat: "spirit", emoji: "⛪", title: "Church / Service", dur: "180m" },
            { time: "1:00PM", cat: "break", emoji: "🍽️", title: "Family / Rest / Recharge", dur: "120m" },
            { time: "3:00PM", cat: "review", emoji: "📝", title: "Weekly OS Audit", dur: "60m" },
            { time: "4:00PM", cat: "review", emoji: "📅", title: "Mon/Tue Detailed Planning", dur: "60m" },
            { time: "9:00PM", cat: "sleep", emoji: "💤", title: "Sleep. Ready for battle.", dur: "6h" },
        ]
    },
};