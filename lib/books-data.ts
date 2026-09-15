// TIP: pure content, ported from emmanuel_master_plan_v3.html's Books panel.
// `done` starts false for every book — the /books page persists progress to
// localStorage under "em_books_v1" the same pattern the habits page already
// uses for its own client-side state, so it doesn't need the DB yet.

import { RoadmapColor } from "./roadmap-data";

export interface Book {
    id: number;
    title: string;
    author: string;
    why: string;
    shortLabel: string; // for the compact tracker grid
    monthGroup: string; // section heading it falls under
    color: RoadmapColor;
}

export const BOOKS: Book[] = [
    {
        id: 0,
        title: "Emotional Intelligence",
        author: "Daniel Goleman",
        why: "The laughing, the mirroring, the nervous reactions — all explained and rewired here. 1 chapter per day. Write one personal application sentence after each chapter. Chapters 1, 2, 6 are most critical for you.",
        shortLabel: "EQ",
        monthGroup: "Month 1 — Fix the foundation",
        color: "purple",
    },
    {
        id: 1,
        title: "The Art of Communicating",
        author: "Thich Nhat Hanh",
        why: "Short and powerful. Teaches you to hear what someone actually means before forming your response. Pair with EQ this month. Changes how you listen more than how you speak.",
        shortLabel: "Art Com.",
        monthGroup: "Month 1 — Fix the foundation",
        color: "gold",
    },
    {
        id: 2,
        title: "Sapiens: A Brief History of Humankind",
        author: "Yuval Noah Harari",
        why: "History, economics, psychology, religion, human nature — all in one. After this book you can hold real conversations on almost any topic at any level. This is your jack of all trades foundation. 15 pages per day.",
        shortLabel: "Sapiens",
        monthGroup: "Month 2 — Expand the mind",
        color: "green",
    },
    {
        id: 3,
        title: "Crucial Conversations",
        author: "Patterson, Grenny et al.",
        why: "EQ gave you self-awareness. This teaches what to do with it in real high-stakes conversations. How to respond when someone says something unexpected. How to stay composed when the conversation gets charged.",
        shortLabel: "Crucial",
        monthGroup: "Month 3 — Apply it socially",
        color: "blue",
    },
    {
        id: 4,
        title: "Simply Said",
        author: "Jay Sullivan",
        why: "Pure articulation training. How to say complex things clearly and confidently. Read one passage from this book aloud every morning — that is your articulation drill. This book combined with the read-aloud habit changes how you speak within 30 days.",
        shortLabel: "Simply",
        monthGroup: "Month 3 — Apply it socially",
        color: "gold",
    },
    {
        id: 5,
        title: "The Personal MBA",
        author: "Josh Kaufman",
        why: "Business, finance, marketing, psychology and systems thinking without going to business school. Makes you dangerous in any room where money or strategy is discussed. Directly applicable to trading, freelancing, and Mystic brand decisions.",
        shortLabel: "MBA",
        monthGroup: "Month 4 — Financial intelligence",
        color: "green",
    },
    {
        id: 6,
        title: "Dress Like a Man",
        author: "Antonio Centeno & Geoffrey Cubberley",
        why: "No trends, just principles. Teaches you to dress for your body type, occasion, and budget. You have white sneakers, black slides, purple shoes. This book teaches you how to build outfits that work consistently with what you have and what you add.",
        shortLabel: "Dress",
        monthGroup: "Month 5 — Physical presentation",
        color: "orange",
    },
    {
        id: 7,
        title: "The Appearance of Power",
        author: "Tanner Guzy",
        why: "How clothing communicates dominance and respect before you say a word. The aura shift you're after is partly physical. This book explains the visual language of presence. Aligned directly with the \"not a small guy\" goal.",
        shortLabel: "Appear.",
        monthGroup: "Month 5 — Physical presentation",
        color: "orange",
    },
    {
        id: 8,
        title: "Poor Charlie's Almanack",
        author: "Charlie Munger",
        why: "Mental models across every field — how the smartest people think across disciplines. Save for last. The first 8 books build the foundation this one requires to be fully absorbed. After 8 books of reading you'll understand why this one comes last.",
        shortLabel: "Munger",
        monthGroup: "Month 6+ — The long game",
        color: "purple",
    },
];

export const READ_ALOUD_TIP =
    "Every morning, read one passage from your current book out loud before anything else (after prayer). This single habit builds articulation faster than any course. Your mouth needs to practice forming complex sentences the same way your hands practice handles on the court. Do it daily without exception.";
