import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";



// GET - Fetch all agents
export async function GET() {
    try {
        const [rows] = await pool.query("SELECT * FROM agent ORDER BY id DESC");
        return NextResponse.json({ agent: rows });
    } catch (error: any) {
        console.error("Agent GET error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { name, phone_number, email, gender, status, roll, password, experience } = await req.json();

        if (!name || !phone_number || !email || !password) {
            return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
        }

        // 🔍 Check for existing agent with same name
        const [existing] = await pool.query(
            `SELECT id FROM agent WHERE name = ? LIMIT 1`,
            [name]
        );

        if ((existing as any[]).length > 0) {
            return NextResponse.json({ error: "Agent with this name already exists." }, { status: 409 });
        }

        await pool.execute(
            `INSERT INTO agent (name, phone_number, email, gender, status, roll, password, experience  ) VALUES (?,  ?, ?, ?, ?,?,?, ?)`,
            [name, phone_number, email, gender, status, roll, password, experience]
        );

        return NextResponse.json({ message: "Agent added successfully" });
    } catch (error: any) {
        console.error("Agent POST error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
