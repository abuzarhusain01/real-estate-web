// app/api/review/route.ts
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";

export async function POST(req: NextRequest) {
    try {
        const { rating, message, user_id } = await req.json();

        if (!rating || !message) {
            return NextResponse.json({ error: "Rating and message are required" }, { status: 400 });
        }

        // Insert without created_at since your table doesn't have it
        await db.query(
            "INSERT INTO review (rating, comment, user_id) VALUES (?, ?, ?)",
            [rating, message, user_id || null]
        );

        return NextResponse.json({ message: "Review submitted successfully" });
    } catch (error) {
        console.error("Review API Error (POST):", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// app/api/review/route.ts (GET handler)
export async function GET() {
    try {
        const [reviews] = await db.query(`SELECT * FROM review`);
        return NextResponse.json({ reviews });
    } catch (error) {
        console.error("Review API Error (GET):", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });

    }
}