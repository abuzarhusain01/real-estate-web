// app/api/auth/route.ts
import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

// POST: Login or Signup
export async function POST(req: NextRequest) {
    const { name, email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    if (name) {
        // Signup flow
        const [existingRows]: any = await pool.query("SELECT * FROM customer WHERE email = ?", [email]);

        if (existingRows.length > 0) {
            return NextResponse.json({ message: "User already exists" }, { status: 409 });
        }

        await pool.query("INSERT INTO customer (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
        return NextResponse.json({ message: "Account created successfully" });
    } else {
        // Login flow
        const [rows]: any = await pool.query("SELECT * FROM customer WHERE email = ?", [email]);

        if (rows.length === 0) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const user = rows[0];
        if (user.password !== password) {
            return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
        }

        return NextResponse.json({ message: "Login successful", user });
    }
}

// GET: Fetch user by email
export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email");

    if (!email) {
        return NextResponse.json({ message: "Email query param is required" }, { status: 400 });
    }

    const [rows]: any = await pool.query("SELECT id, name, email FROM customer WHERE email = ?", [email]);

    if (rows.length === 0) {
        return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user: rows[0] });
}
