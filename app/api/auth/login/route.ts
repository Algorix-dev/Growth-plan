import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

const AUTHORIZED_EMAIL = "emmytech2008@gmail.com";

function hashPassword(password: string) {
    return createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json({ error: "Email and password required" }, { status: 400 });
        }

        if (email.toLowerCase() !== AUTHORIZED_EMAIL.toLowerCase()) {
            return NextResponse.json({ error: "Access denied. Unauthorized identity." }, { status: 403 });
        }

        const user = await prisma.user.findUnique({
            where: { email: AUTHORIZED_EMAIL }
        });

        if (!user) {
            return NextResponse.json({ error: "Identity not found. Ensure seeding is complete." }, { status: 404 });
        }

        const hashedInput = hashPassword(password);
        // Cast to handle potential schema sync lag in dev environments
        const dbPassword = (user as unknown as { password?: string }).password;

        if (dbPassword !== hashedInput) {
            return NextResponse.json({ error: "Verification failed. Incorrect key." }, { status: 401 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("Login API Error:", error);
        return NextResponse.json({
            error: `Internal Authentication Error: ${errorMessage}`,
            details: errorMessage
        }, { status: 500 });
    }
}
