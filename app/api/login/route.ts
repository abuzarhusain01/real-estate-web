import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db"; // make sure this points to your DB config

export async function POST(req: NextRequest) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    try {
        const [rows]: any = await pool.query("SELECT * FROM agent WHERE email = ? LIMIT 1", [email]);

        const user = rows[0];

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // For production, hash and compare passwords
        if (user.password !== password) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        // Return success
        return NextResponse.json({ message: "Login successful", user }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}
