// app/api/forget/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db"; // adjust this if needed

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email } = body;

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const [rows]: any = await db.query("SELECT * FROM customer WHERE email = ?", [email]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "No user found with this email" }, { status: 404 });
        }

        // Optional: add email-sending logic here

        return NextResponse.json({ message: "Reset link sent to your email (mock)" });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
