// app/api/bank/edit/[id]/route.ts

import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }  // 👈 params async hai
) {
    try {
        const { id } = await context.params;   // 👈 await zaroori hai

        const [rows]: any = await pool.query(
            `SELECT * FROM bank WHERE idbank = ?`,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json(
                { error: "Bank not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(rows[0]);
    } catch (error: any) {
        console.error("Bank GET error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

// PATCH - Update bank entry

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }   // 👈 params async hai
) {
    try {
        const { id } = await context.params;   // 👈 await karna zaroori hai

        if (!id) {
            return NextResponse.json(
                { error: "Missing bank ID" },
                { status: 400 }
            );
        }

        const body = await req.json();
        const { bank_name, interest, loan_amount, year_tenure, rewards, loan_disbursed } = body;

        await pool.execute(
            `UPDATE bank 
         SET bank_name=?, interest=?, loan_amount=?, year_tenure=?, rewards=?, loan_disbursed=?
         WHERE idbank=?`,
            [bank_name, interest, loan_amount, year_tenure, rewards, loan_disbursed, id]
        );

        return NextResponse.json({ message: "Bank updated successfully" });
    } catch (error: any) {
        console.error("Bank PATCH error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}