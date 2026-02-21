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
        id: "1", code: 'COS202', name: 'Computer Programming II', color: '#8e68c4', category: 'tech',
        topics: [
            { id: "t1", title: "Classes & Objects", completed: false },
            { id: "t2", title: "Encapsulation & Modifiers", completed: false },
            { id: "t3", title: "Inheritance & Polymorphism", completed: false },
            { id: "t4", title: "Exception Handling", completed: false },
            { id: "t101", title: "File I/O & Collections", completed: false },
            { id: "t102", title: "Design Patterns", completed: false },
        ],
        scores: []
    },
    {
        id: "2", code: 'MTH202', name: 'Differential Equations', color: '#a06aff', category: 'math',
        topics: [
            { id: "t5", title: "Order & Degree of ODE", completed: false },
            { id: "t6", title: "Separable Equations", completed: false },
            { id: "t7", title: "Linear 1st-order / Bernoulli", completed: false },
            { id: "t103", title: "Exact & Homogeneous", completed: false },
            { id: "t104", title: "2nd-order Linear ODEs", completed: false },
            { id: "t105", title: "Laplace Transforms", completed: false },
        ],
        scores: []
    },
    {
        id: "3", code: 'CUACOS216', name: 'Introduction to Graphics', color: '#c45a8e', category: 'design',
        topics: [
            { id: "t8", title: "Raster vs Vector", completed: false },
            { id: "t9", title: "Color Models & HSV", completed: false },
            { id: "t106", title: "Transformations & Clipping", completed: false },
            { id: "t107", title: "Lighting & Texture", completed: false },
            { id: "t108", title: "Rendering Pipeline", completed: false },
        ],
        scores: []
    },
    {
        id: "4", code: 'INS204', name: 'Systems Analysis & Design', color: '#38bfb0', category: 'tech',
        topics: [
            { id: "t10", title: "SDLC & Feasibility Study", completed: false },
            { id: "t11", title: "Requirements Elicitation", completed: false },
            { id: "t12", title: "DFD & ERD Mapping", completed: false },
            { id: "t13", title: "UML & System design", completed: false },
        ],
        scores: []
    },
    {
        id: "5", code: 'CUACSC214', name: 'Data Visualisation', color: '#d47a2a', category: 'design',
        topics: [
            { id: "t14", title: "Perceptual Principles", completed: false },
            { id: "t15", title: "Tufte's Rules & Chart Junk", completed: false },
            { id: "t16", title: "Distributions & Time Series", completed: false },
            { id: "t17", title: "Interactive Vis (D3/Plotly)", completed: false },
        ],
        scores: []
    },
    {
        id: "6", code: 'GST212', name: 'Philosophy & Logic', color: '#4a8fd4', category: 'humanities',
        topics: [
            { id: "t18", title: "Branches of Philosophy", completed: false },
            { id: "t19", title: "Epistemology & Metaphysics", completed: false },
            { id: "t20", title: "Logic & Fallacies", completed: false },
            { id: "t21", title: "Existentialism & Ubuntu", completed: false },
        ],
        scores: []
    },
    {
        id: "7", code: 'DEP202', name: 'Digital Entrepreneurship III', color: '#d4a843', category: 'business',
        topics: [
            { id: "t22", title: "Business Model Canvas", completed: false },
            { id: "t23", title: "Value Proposition & Discovery", completed: false },
            { id: "t24", title: "Marketing & Growth Hacking", completed: false },
            { id: "t25", title: "Unit Economics & IP", completed: false },
        ],
        scores: []
    },
    {
        id: "8", code: 'CUACOS212', name: 'Probability Theory', color: '#ff6ad5', category: 'math',
        topics: [
            { id: "t26", title: "Sample Spaces & Axioms", completed: false },
            { id: "t27", title: "Bayes' Theorem & Independent", completed: false },
            { id: "t28", title: "Random Variables & Normal Dist", completed: false },
            { id: "t29", title: "Poisson & Exponential", completed: false },
        ],
        scores: []
    },
    {
        id: "9", code: 'IFT212', name: 'Computer Architecture', color: '#3abf6a', category: 'tech',
        topics: [
            { id: "t30", title: "Number Systems & Boolean", completed: false },
            { id: "t31", title: "Logic Gates & Combinational", completed: false },
            { id: "t32", title: "ISA & CPU Architecture", completed: false },
            { id: "t33", title: "Memory & Pipelining", completed: false },
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
