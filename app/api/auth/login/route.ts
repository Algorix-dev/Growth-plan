import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { createHash } from "crypto";

const AUTHORIZED_EMAIL = "emmytech2008@gmail.com";

function hashPassword(password: string) {
    return createHash("sha256").update(password).digest("hex");
}

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

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
        return NextResponse.json({ error: "Identity not found in database." }, { status: 404 });
    }

    const hashedInput = hashPassword(password);
    if (user.password !== hashedInput) {
        return NextResponse.json({ error: "Verification failed. Incorrect key." }, { status: 401 });
    }

    return NextResponse.json({ success: true, user });
}
