import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2"; // Added RowDataPacket import

// GET - Fetch all sales
export async function GET() {
    try {
        const [sales] = await pool.query(`
            SELECT id, name, phone_number, email, status, message, created_at
            FROM sales
            ORDER BY name ASC
            LIMIT 50
        `);
        return NextResponse.json({ sales });
    } catch (error: any) {
        console.error("❌ GET Error:", error);
        return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
    }
}

// POST - Add new sale
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        console.log("📩 Incoming Body:", body);

        const {
            name,
            phone_number,
            email,
            message,
            property_id,
            property_name,
            customer_id,
            date
        } = body;

        // Set default status if not provided
        const status = body.status || 'new';

        // Validate required fields
        if (!name || !phone_number || !email || !message) {
            console.log("❌ Missing required fields:", { name, phone_number, email, message });
            return NextResponse.json({
                error: "Required fields: name, phone_number, email, message",
                missing: {
                    name: !name,
                    phone_number: !phone_number,
                    email: !email,
                    message: !message
                }
            }, { status: 400 });
        }

        // 🔍 Check for existing sale with same name
        const [existing] = await pool.query<RowDataPacket[]>(
            `SELECT id FROM sales WHERE name = ? LIMIT 1`,
            [name]
        );

        // if ((existing as RowDataPacket[]).length > 0) {
        //     console.log("❌ Duplicate name found:", name);
        //     return NextResponse.json({
        //         error: "Sales entry with this name already exists."
        //     }, { status: 409 });
        // }

        // Insert new sale (add more fields if your table supports them)
        const [result] = await pool.execute(
            `INSERT INTO sales (name, phone_number, email, status, message)
             VALUES (?, ?, ?, ?, ?)`,
            [name, phone_number, email, status, message]
        ) as [ResultSetHeader, any];

        console.log("✅ Sale created successfully with ID:", result.insertId);

        return NextResponse.json({
            message: "Sales record added successfully!",
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