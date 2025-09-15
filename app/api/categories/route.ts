import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";


export async function GET() {
    try {
        const [categories] = await pool.query(
            `SELECT id, title, description FROM categories ORDER BY title ASC LIMIT 50`
        );

        return NextResponse.json({ categories });
    } catch (error) {
        console.error("Error fetching categories:", error);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { title, description } = body;

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required." }, { status: 400 });
        }

        // ❗ Check for duplicate title
        const [existing] = await pool.query(
            `SELECT id FROM categories WHERE title = ? LIMIT 1`,
            [title]
        );

        if ((existing as any[]).length > 0) {
            return NextResponse.json({ error: "Category with this name already exists." }, { status: 409 });
        }

        const [result] = await pool.execute(
            'INSERT INTO categories (title, description) VALUES (?, ?)',
            [title, description]
        ) as [ResultSetHeader, any];

        return NextResponse.json({
            message: "Category added successfully!",
            categoryId: result.insertId
        }, { status: 201 });
    } catch (error) {
        console.error("Error adding category:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
