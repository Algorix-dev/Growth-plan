"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    Plus,
    GraduationCap,
    LayoutGrid,
    Filter
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";

interface Topic {
    id: string;
    title: string;
    completed: boolean;
}

interface Score {
    label: string;
    value: number;
}

interface Course {
    id: string;
    code: string;
    name: string;
    color: string;
    category: string;
    topics: Topic[];
    scores: Score[];
}

const initialCourses: Course[] = [
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

import { useEffect } from "react";

export default function CoursesPage() {
    const [courses, setCourses] = useState<Course[]>(initialCourses);
    const [expanded, setExpanded] = useState<string | null>("1");

    useEffect(() => {
        const saved = localStorage.getItem("emmanuel_courses");
        if (saved) setCourses(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("emmanuel_courses", JSON.stringify(courses));
    }, [courses]);

    const toggleTopic = (courseId: string, topicId: string) => {
        setCourses(prev => prev.map(c => {
            if (c.id !== courseId) return c;
            return {
                ...c,
                topics: c.topics.map(t => t.id === topicId ? { ...t, completed: !t.completed } : t)
            }
        }));
    };

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bebas tracking-wider">Academic Command</h1>
                        <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-blue/10 border border-blue/20 text-blue font-mono text-[9px] uppercase tracking-widest rounded-sm">
                            Target: 5.0 GPA
                        </span>
                        <span className="px-3 py-1 bg-bg-surface border border-border text-text-muted font-mono text-[9px] uppercase tracking-widest rounded-sm">
                            9 Active Courses
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2 bg-bg-surface border border-border rounded-lg text-text-muted hover:text-text transition-all">
                        <Filter className="w-4 h-4" />
                    </button>
                    <button className="p-2 bg-bg-surface border border-border rounded-lg text-text-muted hover:text-text transition-all">
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                </div>
            </header>

            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {courses.map((course) => {
                    const completedCount = course.topics.filter(t => t.completed).length;
                    const totalTopics = course.topics.length;
                    const progress = Math.round((completedCount / totalTopics) * 100);
                    const isExpanded = expanded === course.id;

                    return (
                        <motion.div
                            key={course.id}
                            layout
                            className={cn(
                                "bg-bg-surface border border-border rounded-xl transition-all overflow-hidden relative",
                                isExpanded ? "ring-1 ring-gold/30 shadow-[0_0_30px_rgba(201,150,46,0.1)]" : "hover:border-border-2"
                            )}
                        >
                            <div
                                className="absolute top-0 left-0 w-1 h-full"
                                style={{ backgroundColor: course.color }}
                            />

                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <p className="font-mono text-[10px] uppercase tracking-widest text-text-dim mb-1">{course.code} · {course.category}</p>
                                        <h3 className="text-xl font-bebas leading-none">{course.name}</h3>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bebas text-2xl text-gold">{progress}%</p>
                                        <p className="font-mono text-[9px] uppercase text-text-dim">{completedCount}/{totalTopics} UNITs</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <Progress value={progress} className="h-1 bg-bg-muted" />

                                    <div className="grid grid-cols-2 gap-2">
                                        {course.scores.map((score, sidx) => (
                                            <div key={sidx} className="bg-bg-base border border-border-2 p-2 rounded flex items-center justify-between">
                                                <span className="font-mono text-[9px] uppercase text-text-dim truncate">{score.label}</span>
                                                <span className={cn("font-bebas text-lg", score.value >= 70 ? "text-green" : "text-gold")}>{score.value}</span>
                                            </div>
                                        ))}
                                        <button className="border border-dashed border-border-2 p-2 rounded flex items-center justify-center text-text-dim hover:text-gold hover:border-gold transition-all text-[10px] font-mono uppercase gap-2">
                                            <Plus className="w-3 h-3" /> Score
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t border-border">
                                <button
                                    onClick={() => setExpanded(isExpanded ? null : course.id)}
                                    className="w-full p-4 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-text-muted hover:text-text transition-colors"
                                >
                                    <span>Syllabus Breakdown</span>
                                    <ChevronDown className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-180")} />
                                </button>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: "auto" }}
                                            exit={{ height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 space-y-3">
                                                {course.topics.map((topic) => (
                                                    <div
                                                        key={topic.id}
                                                        className={cn(
                                                            "flex items-center justify-between p-3 rounded-lg border transition-all cursor-pointer",
                                                            topic.completed ? "bg-green/5 border-green/20" : "bg-bg-base border-border-2 hover:border-border"
                                                        )}
                                                        onClick={() => toggleTopic(course.id, topic.id)}
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                checked={topic.completed}
                                                                onCheckedChange={() => toggleTopic(course.id, topic.id)}
                                                                className="border-border-2 data-[state=checked]:bg-green data-[state=checked]:border-green"
                                                            />
                                                            <span className={cn("font-mono text-[11px] uppercase tracking-tight", topic.completed ? "text-text line-through opacity-50" : "text-text")}>
                                                                {topic.title}
                                                            </span>
                                                        </div>
                                                        {topic.completed && <CheckCircle2 className="w-3 h-3 text-green" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                    <GraduationCap className="text-gold w-8 h-8" />
                    <div>
                        <h4 className="font-bebas text-xl">GPA Target</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bebas text-green">5.00</span>
                            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Current Semester</span>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                    <BookOpen className="text-blue w-8 h-8" />
                    <div>
                        <h4 className="font-bebas text-xl">Unit Completion</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bebas text-blue">
                                {courses.reduce((acc, c) => acc + c.topics.filter(t => t.completed).length, 0)} / {courses.reduce((acc, c) => acc + c.topics.length, 0)}
                            </span>
                            <span className="font-mono text-[10px] text-text-dim uppercase tracking-widest">Mastery Level</span>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-surface border border-border p-6 rounded-xl flex items-center gap-4">
                    <Plus className="text-text-muted w-8 h-8" />
                    <div>
                        <h4 className="font-bebas text-xl">Next Milestone</h4>
                        <p className="font-serif italic text-sm text-text-muted">Algorithm Exam · Mar 12</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
