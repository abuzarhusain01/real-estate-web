import { NextRequest, NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(
    req: NextRequest,
    { params }: { params: { id: string | number } }
) {
    try {
        const [rows]: any = await pool.query(
            `SELECT * FROM agent WHERE id = ?`,
            [params.id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ error: "Agent not found." }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error fetching agent:", error);
        return NextResponse.json({ error: "Failed to fetch agent." }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string | number } }
) {
    try {
        const body = await req.json();
        console.log("Update result:", body);

        const { name, phone_number, email, gender, status, roll, password, experience } = body;

        // ✅ Required fields (password not required here)
        if (!name || !phone_number || !email || !gender || !status || !roll) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // 🔍 Prevent duplicate agent name
        const [existing] = await pool.query(
            `SELECT id FROM agent WHERE name = ? AND id != ? LIMIT 1`,
            [name, params.id]
        );
        if ((existing as any[]).length > 0) {
            return NextResponse.json({ error: "Agent with this name already exists." }, { status: 409 });
        }


        // ✅ Conditional query (only update password if provided)
        let query: string;
        let values: any[];

        if (password && password.trim() !== "") {
            query = `
                UPDATE agent 
                SET name = ?, phone_number = ?, email = ?, gender = ?, status = ?, roll = ?, password = ?, experience = ?
                WHERE id = ?
            `;
            values = [name, phone_number, email, gender, status, roll, password, experience, params.id];
        } else {
            query = `
                UPDATE agent 
                SET name = ?, phone_number = ?, email = ?, gender = ?, status = ?, roll = ?, experience = ?
                WHERE id = ?
            `;
            values = [name, phone_number, email, gender, status, roll, experience, params.id];
        }

        const [result]: any = await pool.query(query, values);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Agent not found." }, { status: 404 });
        }

        return NextResponse.json({ message: "Agent updated successfully." });
    } catch (error) {
        console.error("Error updating agent:", error);
        return NextResponse.json({ error: "Failed to update agent." }, { status: 500 });
    }
}
