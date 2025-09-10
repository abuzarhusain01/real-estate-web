import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2"; // Added RowDataPacket import

export async function GET() {
    try {
        const [rows]: any = await pool.query(`
      SELECT 
        idbank AS id, 
        bank_name, 
        interest, 
        loan_amount, 
        year_tenure, 
        rewards, 
        loan_disbursed
      FROM bank
      LIMIT 50
    `);

        // console.log("DB rows:", rows); // ✅ should now log your data
        return NextResponse.json({ bank: rows }); // return correctly
    } catch (err) {
        console.error("GET /api/bank error:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}



// POST - Add new bank
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("📩 Incoming Body:", body);

        const {
            bank_name,
            interest,
            loan_amount,
            year_tenure,
            rewards,
            loan_disbursed,
        } = body;

        // Set default status if not provided
        const status = body.status || 'new';

        // Validate required fields
        if (!bank_name || !interest || !loan_amount || !year_tenure || !rewards || !loan_disbursed) {
            console.log("❌ Missing required fields:", {
                bank_name, interest, loan_amount, year_tenure, rewards,
                loan_disbursed
            });
            return NextResponse.json({
                error: "Required fields: bank_name, interest, loan_amount, year_tenure",
                missing: {
                    bank_name: !bank_name,
                    interest: !interest,
                    loan_amount: !loan_amount,
                    year_tenure: !year_tenure,
                    rewards: !rewards,
                    loan_disbursed: !loan_disbursed
                }
            }, { status: 400 });
        }

        // 🔍 Check for existing bank with same name
        const [existing] = await pool.query<RowDataPacket[]>(
            `SELECT idbank FROM bank WHERE bank_name = ? LIMIT 1`,
            [bank_name]
        );


        // Insert new bank (add more fields if your table supports them)
        const [result] = await pool.execute(
            `INSERT INTO bank (bank_name, interest, loan_amount, year_tenure, rewards, loan_disbursed)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [bank_name, interest, loan_amount, year_tenure, rewards, loan_disbursed]

        ) as [ResultSetHeader, any];

        console.log("✅ bank created successfully with ID:", result.insertId);

        return NextResponse.json({
            message: "banks record added successfully!",
            salesId: result.insertId,
        }, { status: 201 });

    } catch (error: any) {
        console.error("❌ POST Error:", error);
        return NextResponse.json({
            error: error.message || "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        }, { status: 500 });
    }
}