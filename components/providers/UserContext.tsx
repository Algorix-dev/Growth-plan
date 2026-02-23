"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
    id: string;
    email: string;
    name: string;
    xp: number;
    level: number;
}

interface UserContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => void;
    refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshUser = async () => {
        const storedId = localStorage.getItem("emmanuel_user_id");
        if (!storedId) {
            setUser(null);
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`/api/user?id=${storedId}`);
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                localStorage.removeItem("emmanuel_user_id");
                setUser(null);
            }
        } catch (e) {
            console.error("Failed to fetch user:", e);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("emmanuel_user_id", data.user.id);
                setUser(data.user);
                return { success: true };
            }
            return { success: false, error: data.error };
        } catch (e) {
            console.error("Login error:", e);
            return { success: false, error: "System failure. Check connection." };
        }
    };

    const logout = () => {
        localStorage.removeItem("emmanuel_user_id");
        setUser(null);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, login, logout, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
