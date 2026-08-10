"use client"

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState<Theme>("dark");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const saved = localStorage.getItem("emmanuel_theme") as Theme;
        if (saved) {
            setTheme(saved);
        } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
            setTheme("light");
        }
    }, []);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        if (theme === "light") {
            root.classList.add("theme-light");
        } else {
            root.classList.remove("theme-light");
        }
        localStorage.setItem("emmanuel_theme", theme);
    }, [theme, mounted]);

    const toggleTheme = () => {
        setTheme(prev => prev === "dark" ? "light" : "dark");
    };

    // Prevent hydration mismatch by initially rendering without the class applied via JS,
    // though the layout will flash if statically generated without an inline script.
    // Given the OS nature, a slight flash is acceptable locally or can be mitigated later.
    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
