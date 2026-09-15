// TIP: This file is pure content, ported from emmanuel_master_plan_v3.html.
// It doesn't touch any existing habit/course/schedule data or logic — it's a
// brand new dataset for the brand new /roadmap page. Colors reuse the same
// tailwind tokens (gold/blue/teal/orange/green/purple) already used elsewhere
// in the app, so it looks native instead of imported.

export type RoadmapColor =
    | "gold"
    | "blue"
    | "teal"
    | "orange"
    | "green"
    | "purple";

export interface RoadmapItem {
    text: string;
    sub?: string;
    color?: RoadmapColor; // overrides the section's default color for this one item
}

export interface RoadmapSection {
    title: string;
    color: RoadmapColor;
    items: RoadmapItem[];
}

export interface RoadmapMonth {
    title: string;
    sub: string;
    dotColor: RoadmapColor;
    sections: RoadmapSection[];
}

export interface RoadmapPhase {
    id: string;
    label: string;
    intro: { title: string; body: string };
    months: RoadmapMonth[];
}

export const ROADMAP_PHASES: RoadmapPhase[] = [
    {
        id: "holi",
        label: "Holiday (May–Aug)",
        intro: {
            title: "The most important period of your life so far",
            body: "You have full days, no obligations except church and basketball. This window will not come back. What you build here compounds into every semester that follows.",
        },
        months: [
            {
                title: "Month 1 — Foundation",
                sub: "May 2026 · Start everything right",
                dotColor: "gold",
                sections: [
                    {
                        title: "Coding",
                        color: "blue",
                        items: [
                            { text: "Start CS50 Week 0 — complete Lecture 0 and 1 this week. Do every problem set.", sub: "Scratch, C basics, computational thinking. Don't skip problem sets — they are the course." },
                            { text: "Begin Angela Yu course Section 1 in week 2 alongside CS50", sub: "HTML and CSS first. Build every project before watching her build it." },
                            { text: "Write Bank Account OOP class in Python from scratch by end of month", sub: "No looking at hostel system code. No Claude. Just you and the editor." },
                        ],
                    },
                    {
                        title: "Brand",
                        color: "orange",
                        items: [
                            { text: "Animate logo in CapCut — materializing effect, glitch, smoke overlay, bass hit", sub: "45–60 minutes focused. This is the visual identity of Mystic." },
                            { text: "Post first video: \"They said Mystic wasn't real... until this happened\"", sub: "BR ranked gameplay. Cinematic mystery narration via ElevenLabs. Under 2 minutes for TikTok." },
                            { text: "Hit 4 total posts by end of month (2 TikTok + 2 YouTube)" },
                        ],
                    },
                    {
                        title: "Trading",
                        color: "teal",
                        items: [
                            { text: "Daily chart analysis on XAUUSD — identify market structure, one OB, one FVG", sub: "Journal every observation in Notion. Even if you don't trade — analyze and write." },
                            { text: "Complete 10 paper trade observations by end of month" },
                        ],
                    },
                    {
                        title: "Reading",
                        color: "gold",
                        items: [
                            { text: "Finish Emotional Intelligence by Daniel Goleman", sub: "1 chapter per day. Write one personal application sentence per chapter." },
                            { text: "Read The Art of Communicating alongside EQ", sub: "Short book. Pair together this month." },
                        ],
                    },
                    {
                        title: "Body",
                        color: "green",
                        items: [
                            { text: "Month 1 calisthenics program — see Training tab for full details" },
                            { text: "Basketball: full drill routine every session. Focus on handles and defensive clock positions." },
                        ],
                    },
                    {
                        title: "Apps to set up this month",
                        color: "purple",
                        items: [
                            { text: "Download: Google Clock, Notion, Manna, YouVersion, TradingView, Forest, Habitica, Google Calendar, Moon+ Reader, Investing.com, Cronometer" },
                        ],
                    },
                ],
            },
            {
                title: "Month 2 — Momentum",
                sub: "June 2026 · Things start clicking",
                dotColor: "blue",
                sections: [
                    {
                        title: "Coding",
                        color: "blue",
                        items: [
                            { text: "CS50 Weeks 3–6 — Arrays, Algorithms, Memory, Data Structures", sub: "These are the hard weeks. Struggle is normal. Don't skip problem sets." },
                            { text: "Angela Yu — JavaScript deeply. DOM, events, ES6 syntax", sub: "Build the Todo app and quiz app projects independently before watching solutions." },
                            { text: "Start building the Trading Journal web app (HTML + CSS + JS)", sub: "Design it on paper first. No frameworks. Your first real independent project." },
                        ],
                    },
                    {
                        title: "Brand",
                        color: "orange",
                        items: [
                            { text: "8 total posts across platforms by end of month", sub: "Study analytics — what's getting views, what's not. Adjust content accordingly." },
                            { text: "Try the \"Every kill the story gets darker\" concept video" },
                        ],
                    },
                    {
                        title: "Trading",
                        color: "teal",
                        items: [
                            { text: "Complete 20 paper trade observations total. Start identifying your clearest setup." },
                            { text: "Add EURUSD to your analysis alongside XAUUSD" },
                        ],
                    },
                    {
                        title: "Reading",
                        color: "gold",
                        items: [
                            { text: "Read Sapiens by Yuval Noah Harari — 15 pages per day", sub: "This is your general knowledge and world understanding book. Take your time." },
                        ],
                    },
                    {
                        title: "Hardware",
                        color: "teal",
                        items: [
                            { text: "Purchase Arduino Uno starter kit from Computer Village, Ikeja (15,000–25,000 NGN)" },
                            { text: "Complete first 2 Arduino projects: Blink LED + Read temperature sensor", sub: "Paul McWhorter's Arduino series on YouTube. Do in evening flex block." },
                        ],
                    },
                    {
                        title: "Body",
                        color: "green",
                        items: [
                            { text: "Month 2 calisthenics — harder variations, more volume. Target 15 pull-ups." },
                            { text: "Basketball: add pull-up jumper drill and step-back sessions. Focus on shooting off dribble." },
                        ],
                    },
                ],
            },
            {
                title: "Month 3 — Proof of Work",
                sub: "July 2026 · Results start showing",
                dotColor: "teal",
                sections: [
                    {
                        title: "Coding",
                        color: "blue",
                        items: [
                            { text: "Complete CS50 — finish all remaining weeks and final project", sub: "CS50 certificate earned. This is a real credential. Add to LinkedIn and portfolio." },
                            { text: "Angela Yu — Node.js and Express begin. Backend development starts." },
                            { text: "Trading Journal app fully functional and deployed on Netlify or Vercel", sub: "Frontend complete, stores trades, calculates win rate. Your first live project of the holiday." },
                        ],
                    },
                    {
                        title: "Brand",
                        color: "orange",
                        items: [
                            { text: "Mystic hits 100 followers. One video breaks 1,000 views." },
                            { text: "Introduce drk Glitch (brother) in a Nexus Void collab video", sub: "Guest appearances drive engagement. Plan this as a story arc." },
                        ],
                    },
                    {
                        title: "Trading",
                        color: "teal",
                        items: [
                            { text: "30 paper trade observations completed and journaled" },
                            { text: "Identify your single most consistent ICT setup. Document it fully." },
                        ],
                    },
                    {
                        title: "Reading",
                        color: "gold",
                        items: [
                            { text: "Crucial Conversations + Simply Said this month", sub: "Month 3 is about applying communication in real life. Notice the change in how you respond." },
                        ],
                    },
                    {
                        title: "Hardware",
                        color: "teal",
                        items: [
                            { text: "Arduino Project 3: Control servo motor. Project 4: Build line-follower robot.", sub: "The line follower is your first autonomous system. Take your time with it." },
                        ],
                    },
                    {
                        title: "Internship",
                        color: "gold",
                        items: [
                            { text: "Internship letter received and company confirmed by end of this month", sub: "Portfolio ready: Trading Journal app + Bank Account OOP project + CS50 certificate" },
                        ],
                    },
                    {
                        title: "Body",
                        color: "green",
                        items: [
                            { text: "Month 3 peak calisthenics — target 20 pull-ups. Push-ups past 50." },
                            { text: "People around you notice the physical change. You notice the aura shift first." },
                        ],
                    },
                ],
            },
            {
                title: "Month 4 — Internship + Scale",
                sub: "Aug 2026 · Real world begins",
                dotColor: "green",
                sections: [
                    {
                        title: "Internship",
                        color: "gold",
                        items: [
                            { text: "Show up as the most prepared person in the room", sub: "You have CS50 done, Angela Yu 60% done, two live projects, hardware knowledge started. That's exceptional for a 200L student." },
                            { text: "Ask questions constantly. Write down everything you learn. Build relationships." },
                            { text: "Apply composure and EQ in every professional interaction", sub: "Observe before speaking. Let results show. Be the reliable quiet one who delivers." },
                        ],
                    },
                    {
                        title: "Coding during internship",
                        color: "blue",
                        items: [
                            { text: "Continue Angela Yu — 1 section per day minimum in evenings" },
                            { text: "Apply real skills at work. Volunteer for technical tasks even if slightly beyond you." },
                        ],
                    },
                    {
                        title: "Brand",
                        color: "orange",
                        items: [
                            { text: "Maintain minimum 1 video per week during internship period", sub: "Batch record on weekends. Edit during commute. Consistency over quality right now." },
                        ],
                    },
                    {
                        title: "Trading",
                        color: "teal",
                        items: [
                            { text: "First real trade executed with actual capital after 30+ paper observations", sub: "Minimum risk. Maximum discipline. Journal everything." },
                        ],
                    },
                    {
                        title: "Reading",
                        color: "gold",
                        items: [
                            { text: "The Personal MBA — financial and business intelligence" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "sem3",
        label: "Semester 3",
        intro: {
            title: "Semester 3 — Sept/Oct 2026",
            body: "You return to school as a noticeably different person physically, mentally, and technically. The holiday compounded. Now school becomes the practice ground, not the main event.",
        },
        months: [
            {
                title: "Semester 3 Overview",
                sub: "Sept 2026 – Feb 2027 (approx)",
                dotColor: "purple",
                sections: [
                    {
                        title: "Academic",
                        color: "gold",
                        items: [
                            { text: "Read ahead of every lecture — arrive knowing the material", sub: "First class target. Your 6–8am block before lectures is study time, not sleep time." },
                            { text: "OOP course — you've been writing Python classes all holiday. This is revision, not new learning." },
                            { text: "Form study groups strategically — teach others what you know. Teaching is the deepest learning." },
                        ],
                    },
                    {
                        title: "Coding — Personal",
                        color: "blue",
                        items: [
                            { text: "Complete Angela Yu course — React section" },
                            { text: "Begin Data Structures and Algorithms self-study — implement from scratch in Python", sub: "Linked lists, stacks, queues, binary search, sorting algorithms. One per week." },
                            { text: "Build a full stack web application with database — deploy live", sub: "Your second major portfolio project. Node.js + Express + MongoDB or PostgreSQL." },
                        ],
                    },
                    {
                        title: "Hardware",
                        color: "teal",
                        items: [
                            { text: "Move to Raspberry Pi — set up Linux, run Python scripts, GPIO control" },
                            { text: "Build a simple IoT project — sensor data sent to a web dashboard you built" },
                        ],
                    },
                    {
                        title: "Brand + Trading",
                        color: "orange",
                        items: [
                            { text: "Mystic minimum 3 videos per week during semester", color: "orange" },
                            { text: "Chart analysis 5 days per week without exception. Trading journal updated daily.", color: "teal" },
                        ],
                    },
                    {
                        title: "Reading",
                        color: "gold",
                        items: [
                            { text: "Dress Like a Man + The Appearance of Power — the glow up completes externally" },
                            { text: "Begin Poor Charlie's Almanack — your foundation is now ready to absorb it" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "holi2",
        label: "Holiday 2",
        intro: {
            title: "Holiday 2 — ~March/April 2027",
            body: "Second major free window. By now you have CS50, Angela Yu complete, 2 live projects, hardware foundation, 6 months of trading journal, Mystic with real audience. This holiday goes deeper.",
        },
        months: [
            {
                title: "Holiday 2 Focus Areas",
                sub: "~3 months · Go deep not wide",
                dotColor: "blue",
                sections: [
                    {
                        title: "Coding",
                        color: "blue",
                        items: [
                            { text: "DSA mastery — trees, graphs, hash maps, dynamic programming", sub: "LeetCode easy → medium problems. 2 problems per day minimum." },
                            { text: "Systems programming — how operating systems work, memory management, processes" },
                            { text: "Build third major project — full stack with authentication, real database, deployed" },
                            { text: "Start freelancing on Hubstaff Talent — land first paid project" },
                        ],
                    },
                    {
                        title: "Hardware",
                        color: "teal",
                        items: [
                            { text: "Begin ROS (Robot Operating System) basics" },
                            { text: "OpenCV with Python — computer vision basics. Object detection project." },
                            { text: "Build autonomous robot project combining sensor + motor + Raspberry Pi + Python" },
                        ],
                    },
                    {
                        title: "Trading",
                        color: "teal",
                        items: [
                            { text: "Real trading with consistent capital. Journal every trade. Review weekly." },
                        ],
                    },
                    {
                        title: "Brand",
                        color: "orange",
                        items: [
                            { text: "Mystic at 500+ followers. First monetization attempt (affiliate, merch, tournament prizes)" },
                        ],
                    },
                    {
                        title: "Mathematics",
                        color: "purple",
                        items: [
                            { text: "Linear algebra self-study — Khan Academy. Essential for ML and robotics ahead." },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "sem4",
        label: "Semester 4",
        intro: {
            title: "Semester 4 — ~July/Aug 2027",
            body: "Final full semester. Academic performance matters most here for graduation result. But your external stack is now formidable — projects, hardware skills, brand, trading record.",
        },
        months: [
            {
                title: "Semester 4 Focus",
                sub: "~Aug 2027 – Feb 2028 · Final academic push",
                dotColor: "green",
                sections: [
                    {
                        title: "Academic — Maximum Focus",
                        color: "gold",
                        items: [
                            { text: "First class is the target. Study ahead, revise in class, practice past questions" },
                            { text: "Any final year project starts here — position it around your systems engineering interest", sub: "Hardware + software integrated project. This becomes your strongest portfolio piece." },
                        ],
                    },
                    {
                        title: "Technical",
                        color: "blue",
                        items: [
                            { text: "Machine learning basics — Andrew Ng's course. Linear regression, classification, clustering." },
                            { text: "TensorFlow Lite — run ML models on Raspberry Pi. Edge AI begins." },
                            { text: "Freelancing consistent — second and third paid projects. Build client track record." },
                        ],
                    },
                    {
                        title: "Brand + Trading",
                        color: "orange",
                        items: [
                            { text: "Mystic 1,000+ followers. Consistent posting. Revenue from content if monetized.", color: "orange" },
                            { text: "Trading — consistent profitable record. Monthly review of all trades.", color: "teal" },
                        ],
                    },
                ],
            },
        ],
    },
    {
        id: "final",
        label: "Final Stretch",
        intro: {
            title: "Final Stretch — ~Feb/Mar/Apr 2028",
            body: "Exams, graduation, the next chapter. You look back at this plan and you see it. Every morning, every deep work block, every \"chai\" feeling redirected — it was all this moment.",
        },
        months: [
            {
                title: "Graduation Profile — April 2028",
                sub: "Who you will be",
                dotColor: "gold",
                sections: [
                    {
                        title: "Technical",
                        color: "blue",
                        items: [
                            { text: "Full stack web developer — Python, JavaScript, React, Node, databases" },
                            { text: "Embedded systems engineer — Arduino, Raspberry Pi, sensors, motors, ROS basics" },
                            { text: "ML foundations — trained and deployed a model on edge hardware" },
                            { text: "Portfolio: 5+ live projects including hardware-software integrations" },
                            { text: "Freelance track record with real clients and real income" },
                        ],
                    },
                    {
                        title: "Personal",
                        color: "gold",
                        items: [
                            { text: "First class or second class upper degree" },
                            { text: "20 pull-ups+, visible physique, basketball significantly improved" },
                            { text: "9 books read, articulate, composed, emotionally intelligent" },
                            { text: "Mystic brand with real audience and Nexus Void universe established" },
                            { text: "Trading — profitable, disciplined, consistent journal of 500+ observations" },
                            { text: "Spiritually anchored. Prayer and Proverbs never stopped. The foundation held.", color: "purple" },
                        ],
                    },
                    {
                        title: "The feeling when you read this in April 2028",
                        color: "gold",
                        items: [
                            { text: "You will remember the night you said \"chai\" and decided to change. This was the turning point. You saw it coming and you did the work anyway." },
                        ],
                    },
                ],
            },
        ],
    },
];

// ── CODING ROADMAP (separate tab in the v3 HTML — kept as its own dataset
// so it can render as a simpler, resource-list style page rather than
// re-using the month-by-month accordion above) ──────────────────────────

export interface CodePhaseItem {
    title: string;
    desc: string;
    tag: string;
    color: RoadmapColor;
}

export interface CodePhase {
    heading: string;
    items: CodePhaseItem[];
}

export const CODING_PHASES: CodePhase[] = [
    {
        heading: "Phase 1 — Foundation (Holiday, May–Aug 2026)",
        items: [
            { title: "CS50 by Harvard — complete with all problem sets", desc: "The single highest return investment of your holiday. Covers C, Python, algorithms, data structures, SQL, web basics. Changes how you think not just what you know. cs50.harvard.edu — free. Do every problem set no matter how hard.", tag: "Priority 1", color: "blue" },
            { title: "Angela Yu — 100 Days of Web Development (Udemy)", desc: "Your existing course. Run alongside CS50 from week 2. Build every project before watching her solution. HTML → CSS → JavaScript → Node → React. The rule: pause before her coding section, attempt it yourself, then compare.", tag: "Priority 2", color: "blue" },
            { title: "Python OOP — rebuild from scratch without assistance", desc: "Bank Account class → Student Management System → Inventory System. Each project harder. Each built independently. This is where the uselessness feeling dies permanently.", tag: "Python", color: "teal" },
            { title: "Trading Journal App — first independent full stack project", desc: "HTML + CSS + JavaScript. Log trades, display in table, calculate win rate, delete entries. Design on paper first. No frameworks. Built and deployed live by end of month 3.", tag: "Project 1", color: "green" },
            { title: "Arduino — first hardware contact", desc: "Starter kit from Computer Village Ikeja. Blink LED → Read sensors → Control motors → Line follower robot. Paul McWhorter Arduino series on YouTube. Evening flex block. Your first physical system that responds to code.", tag: "Hardware", color: "orange" },
        ],
    },
    {
        heading: "Phase 2 — Depth (Semester 3 + Holiday 2, Sept 2026 – June 2027)",
        items: [
            { title: "Data Structures & Algorithms — implement from scratch", desc: "Linked lists, stacks, queues, binary trees, hash maps, sorting algorithms, graph traversal. Implement each in Python without help first. LeetCode easy problems daily. This is what separates engineers from coders.", tag: "DSA", color: "blue" },
            { title: "Full Stack Application — with database and authentication", desc: "Node.js + Express + MongoDB or PostgreSQL. User login, real data persistence, deployed live. This is your second major portfolio project and your first real backend application.", tag: "Project 2", color: "green" },
            { title: "Raspberry Pi + Linux + Python hardware control", desc: "Full Linux computer the size of a card. Runs Python. Connects to internet. Has hardware pins. Bridge between software world and hardware world. IoT project: sensor data to web dashboard you built.", tag: "Hardware", color: "orange" },
            { title: "Systems Programming — how computers actually work", desc: "Memory management, processes, operating systems, networking. MIT OpenCourseWare. CS50 gives you the taste — go deeper here. Essential for embedded systems engineering.", tag: "Systems", color: "purple" },
            { title: "Freelancing begins — Hubstaff Talent + LinkedIn", desc: "First paid project by end of Holiday 2. Small scope, deliver excellently, get the review. Portfolio of 3 live projects by this point makes this realistic.", tag: "Income", color: "gold" },
        ],
    },
    {
        heading: "Phase 3 — Integration (Semester 4 + Final, Aug 2027 – Apr 2028)",
        items: [
            { title: "Computer Vision — OpenCV with Python", desc: "Object detection, image recognition, real-time tracking. What makes autonomous systems actually autonomous. Run on Raspberry Pi. Project: camera that identifies objects and logs them to your web dashboard.", tag: "Vision", color: "teal" },
            { title: "Machine Learning — Andrew Ng course (free on Coursera)", desc: "Linear regression, classification, neural networks basics. The mathematics from your university courses (differential equations, probability, linear algebra) start making real sense here.", tag: "ML/AI", color: "purple" },
            { title: "ROS — Robot Operating System basics", desc: "Industry standard for robotics. Every serious robotics company uses it. Runs on Linux. Python and C++. Learning it puts you in the same technical conversation as professional robotics engineers.", tag: "Robotics", color: "orange" },
            { title: "Final Year Project — hardware + software integrated", desc: "Design it around systems engineering. IoT monitoring system, autonomous navigation robot, smart agriculture system, or prosthetic controller. This becomes your strongest portfolio piece and your graduation statement.", tag: "Capstone", color: "green" },
        ],
    },
];

export const CODING_RESOURCES_STACK =
    "CS50 (cs50.harvard.edu) → javascript.info → Angela Yu Udemy → Paul McWhorter Arduino (YouTube) → Andrew Ng ML (Coursera) → MIT OpenCourseWare (systems) → LeetCode (DSA practice) → ROS official docs. All free or already purchased.";

export const CODING_RULE =
    "Before asking Claude or searching Stack Overflow for any problem — attempt it yourself for 20 minutes minimum. This struggle is where real skill lives. Skipping it means you're producing output, not building ability.";
