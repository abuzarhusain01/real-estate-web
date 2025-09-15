// app/api/sales/edit/[id]/route.ts
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// GET - Fetch sales data by ID
export async function GET(
    req: NextRequest,
    context: { params: { id: string } } // don't destructure yet
) {
    const params = await context.params; // await params
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: "Missing sales ID" }, { status: 400 });
    }

    try {
        console.log("Fetching sales for ID:", id);

        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM sales WHERE id = ? LIMIT 1`,
            [id]
        );

        if (!rows.length) {
            return NextResponse.json({ error: "Sales entry not found" }, { status: 404 });
        }

        return NextResponse.json(rows[0]);
    } catch (error) {
        console.error("Error in GET /api/sales/edit/[id]:", error);
        return NextResponse.json({ error: "Failed to fetch sales data" }, { status: 500 });
    }
}

// PATCH - Update sales entry
export async function PATCH(
    req: NextRequest,
    context: { params: { id: string } }
) {
    const params = await context.params;
    const id = params.id;

    if (!id) {
        return NextResponse.json({ error: "Missing sales ID" }, { status: 400 });
    }

    try {
        const { name, phone_number, email, status, message } = await req.json();

        if (!name || !phone_number || !email || !status || !message) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const allowedStatus = ["new", "connected", "contacted", "sold", "rejected", "closed"];
        if (!allowedStatus.includes(status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }

        const [existing] = await pool.query<RowDataPacket[]>(
            `SELECT id FROM sales WHERE name = ? AND id != ? LIMIT 1`,
            [name, id]
        );

        const [result] = await pool.execute<ResultSetHeader>(
            `UPDATE sales 
             SET name = ?, phone_number = ?, email = ?, status = ?, message = ?
             WHERE id = ?`,
            [name, phone_number, email, status, message, id]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Sales entry not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Sales entry updated successfully" });
    } catch (error) {
        console.error("PATCH /api/sales/edit/[id] error:", error);
        return NextResponse.json({ error: "Failed to update sales data" }, { status: 500 });
    }
}
