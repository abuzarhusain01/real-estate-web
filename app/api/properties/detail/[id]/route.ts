import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    try {
        const [rows]: any[] = await pool.query(`SELECT * FROM properties WHERE id = ? LIMIT 1`, [id]);

        if (!rows.length) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        const property = rows[0];

        property.images = property.images ? JSON.parse(property.images) : [];

        return NextResponse.json(property);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
    }
}
