import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const categoryId = params.id;

    try {
        const [result] = await pool.execute(
            `DELETE FROM categories WHERE id = ?`,
            [categoryId]
        );

        return NextResponse.json({ message: "Category deleted successfully." });
    } catch (error) {
        console.error("Error deleting category:", error);
        return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
    }
}
