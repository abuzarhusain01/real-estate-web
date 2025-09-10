import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

// ✅ DELETE - Delete a bank loan
export async function DELETE(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;  // 🔥 await params
        await pool.execute("DELETE FROM bank WHERE idbank=?", [id]);

        return NextResponse.json({ message: "Loan deleted successfully" });
    } catch (error: any) {
        console.error("Bank DELETE error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
