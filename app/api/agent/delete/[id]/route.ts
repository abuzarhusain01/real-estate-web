import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const [result] = await pool.query(`DELETE FROM agent WHERE id = ?`, [id]);

        if ((result as any).affectedRows === 0) {
            return NextResponse.json({ error: "Agent not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Agent deleted successfully" });
    } catch (error: any) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
