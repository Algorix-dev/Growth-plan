"use client"

import { useState, useEffect } from "react";
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

import { initialCourses, Course } from "@/lib/data";

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

    // Live GPA Estimate: each course progress % mapped to 5.0 scale
    const gpa = courses.length > 0
        ? (courses.reduce((acc, c) => {
            const pct = c.topics.filter(t => t.completed).length / c.topics.length;
            // 0% = 1.0, 100% = 5.0 (5.0 scale)
            return acc + (1 + pct * 4);
        }, 0) / courses.length).toFixed(2)
        : "0.00";

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-bebas tracking-wider">Academic Command</h1>
                        <div className="h-px bg-border flex-1" />
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-3 py-1 bg-blue/10 border border-blue/20 text-blue font-mono text-[9px] uppercase tracking-widest rounded-sm">
                            Target: 5.0 GPA
                        </span>
                        <span className="px-3 py-1 bg-bg-surface border border-border text-text-muted font-mono text-[9px] uppercase tracking-widest rounded-sm">
                            9 Active Courses
                        </span>
                        <span className={`px-3 py-1 border font-mono text-[9px] uppercase tracking-widest rounded-sm ${parseFloat(gpa) >= 4.5 ? 'bg-green/10 border-green/20 text-green' : parseFloat(gpa) >= 3.5 ? 'bg-gold/10 border-gold/20 text-gold' : 'bg-red/10 border-red/20 text-red'}`}>
                            Projected CGPA: {gpa} / 5.0
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
