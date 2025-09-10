import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const [rows]: any = await pool.query("SELECT COUNT(*) AS total FROM bank");
        return NextResponse.json({ total: rows[0].total });
    } catch (err) {
        return NextResponse.json({ error: "Failed to get count" }, { status: 500 });
    }
}
