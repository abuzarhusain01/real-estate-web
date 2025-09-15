import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = params;

    try {
        const [result] = await pool.execute(
            `DELETE FROM properties WHERE id = ?`,
            [id]
        );
        return NextResponse.json({ message: "Properties record deleted." });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete properties record." }, { status: 500 });
    }
}
