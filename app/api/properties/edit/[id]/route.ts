import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ResultSetHeader, RowDataPacket } from "mysql2";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const [rows] = await pool.query<RowDataPacket[]>(
            `SELECT * FROM properties WHERE id = ? LIMIT 1`,
            [id]
        );

        if (!rows.length) {
            return NextResponse.json({ error: "Properties not found" }, { status: 404 });
        }

        const property = rows[0];

        if (property.hasOwnProperty('images') && property.images) {
            try {
                property.images = JSON.parse(property.images);
            } catch (e) {
                property.images = [];
            }
        } else {
            property.images = [];
        }

        property.is_hotspot = property.is_hotspot === 1;
        property.is_featured = property.is_featured === 1;

        return NextResponse.json(property);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch property" }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    try {
        const body = await req.json();
        const {
            name, image, description, price, owner_name, location, owner_contact, status,
            is_featured, is_hotspot, images, bedrooms, bathrooms, balconies, furnishing,
            carpet_area, floor, flooring, lifts, project, transaction_type, facing,
            address, overlooking, landmarks, booking_amount, price_breakup, flat,
            shopping_centers, educational_institute, nearby_localities, home_loans, emi,
        } = body;

        if (!name || !description) {
            return NextResponse.json({ error: "Name and description are required." }, { status: 400 });
        }

        const [existing] = await pool.query(
            `SELECT id FROM properties WHERE name = ? AND id != ? LIMIT 1`,
            [name, id]
        );

        if ((existing as any[]).length > 0) {
            return NextResponse.json({ error: "Property with this name already exists." }, { status: 409 });
        }

        const imagesJson = images && images.length > 0 ? JSON.stringify(images) : null;

        let updateQuery = `UPDATE properties 
             SET name = ?, image = ?, description = ?, price = ?, owner_name = ?, location = ?, 
             owner_contact = ?, status = ?, is_featured = ?, is_hotspot = ?,
             bedrooms = ?, bathrooms = ?, balconies = ?, furnishing = ?, carpet_area = ?, 
             floor = ?, flooring = ?, lifts = ?, project = ?, transaction_type = ?, 
             facing = ?, address = ?, overlooking = ?, landmarks = ?, booking_amount = ?, 
             price_breakup = ?, flat = ?, shopping_centers = ?, educational_institute = ?, 
             nearby_localities = ?, home_loans = ?, emi = ?`;

        let values = [
            name, image, description, price, owner_name, location, owner_contact, status,
            is_featured ? 1 : 0, is_hotspot ? 1 : 0,
            bedrooms, bathrooms, balconies, furnishing, carpet_area, floor, flooring,
            lifts, project, transaction_type, facing, address, overlooking, landmarks,
            booking_amount, price_breakup, flat, shopping_centers, educational_institute,
            nearby_localities, home_loans, emi,
        ];

        try {
            await pool.query(`SELECT images FROM properties LIMIT 1`);
            updateQuery += `, images = ?`;
            values.push(imagesJson);
        } catch (e) {
            // images column doesn't exist
        }

        updateQuery += ` WHERE id = ?`;
        values.push(id);

        const [result] = await pool.execute<ResultSetHeader>(updateQuery, values);

        if (result.affectedRows === 0) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Property updated successfully" });
    } catch (error: any) {
        console.error("❌ PATCH Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
