import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch all favourite properties
export async function GET() {
    try {
        const [rows] = await pool.query("SELECT * FROM properties WHERE is_favourites = 1");
        return NextResponse.json(rows, { status: 200 });
    } catch (error) {
        console.error("Error fetching favourite properties:", error);
        return NextResponse.json({ error: "Failed to fetch favourites" }, { status: 500 });
    }
}

// PATCH: Update favourite status
export async function PATCH(request: Request) {
    try {
        const { id, is_favourites } = await request.json();

        if (!id || typeof is_favourites === 'undefined') {
            return NextResponse.json(
                { error: "Both id and is_favourites are required" },
                { status: 400 }
            );
        }

        const [result] = await pool.query(
            `UPDATE properties SET is_favourites = ? WHERE id = ?`,
            [is_favourites ? 1 : 0, id]
        );

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Favorite status updated" });
    } catch (error) {
        console.error("Error updating favorite status:", error);
        return NextResponse.json({ error: "Failed to update favorite status" }, { status: 500 });
    }
}
