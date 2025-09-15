import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// GET: Get category by ID
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const categoryId = params.id;

    if (!categoryId) {
        return NextResponse.json({ error: "Category ID is required" }, { status: 400 });
    }

    try {
        const [rows]: any = await pool.query("SELECT * FROM categories WHERE id = ?", [categoryId]);

        if (rows.length === 0) {
            return NextResponse.json({ error: "Category not found" }, { status: 404 });
        }

        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        console.error("Error fetching category:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PUT: Update category by ID
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const categoryId = params.id;

    try {
        const body = await req.json();
        const { title, description } = body;

        if (!title || !description) {
            return NextResponse.json({ error: "Title and description are required" }, { status: 400 });
        }

        // ❗ Check for duplicate title in other records
        const [existing] = await pool.query(
            "SELECT id FROM categories WHERE title = ? AND id != ? LIMIT 1",
            [title, categoryId]
        );

        if ((existing as any[]).length > 0) {
            return NextResponse.json({ error: "Category with this name already exists." }, { status: 409 });
        }

        const [result]: any = await pool.query(
            "UPDATE categories SET title = ?, description = ? WHERE id = ?",
            [title, description, categoryId]
        );

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Category not found or not updated" }, { status: 404 });
        }

        return NextResponse.json({ message: "Category updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating category:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
