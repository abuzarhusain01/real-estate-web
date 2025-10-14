import pool from "@/lib/db";
import { NextResponse } from "next/server";
import { ResultSetHeader } from "mysql2";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const is_featured = searchParams.get("is_featured");
        const is_hotspot = searchParams.get("is_hotspot");
        const is_favourites = searchParams.get("is_favourites");
        const location = searchParams.get("location");
        const excludeIdParam = searchParams.get("exclude_id");
        const excludeId = excludeIdParam ? parseInt(excludeIdParam) : null;
        const all = searchParams.get("all"); // Added for filter options

        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "6");
        const offset = (page - 1) * limit;

        const conditions = [];
        if (is_featured) conditions.push("is_featured = 1");
        if (is_hotspot) conditions.push("is_hotspot = 1");
        if (is_favourites) conditions.push("is_favourites = 1");
        if (location) conditions.push(`location = ${pool.escape(location)}`);
        if (excludeId) conditions.push(`id != ${pool.escape(excludeId)}`);

        const where = conditions.length ? `WHERE ${conditions.join(" AND ")}` : "";

        // Count total
        const [countResult]: any = await pool.query(
            `SELECT COUNT(*) as total FROM properties ${where}`
        );
        const total = countResult[0].total;

        let query = `
            SELECT id, image, name, description, price, owner_name, location, owner_contact, status,
            bedrooms, bathrooms, balconies, furnishing, carpet_area, floor, flooring, lifts, project, transaction_type,
            facing, address, overlooking, landmarks, booking_amount, price_breakup, flat, shopping_centers,
            educational_institute, nearby_localities, home_loans, is_favourites, emi, is_featured, is_hotspot, created_at, comparison
        `;

        // Try to include images if column exists
        try {
            await pool.query(`SELECT images FROM properties LIMIT 1`);
            query += `, images`;
        } catch {
            console.warn("Images column not found, skipping...");
        }

        query += ` FROM properties ${where} ORDER BY name ASC`;

        // Only add LIMIT and OFFSET if not fetching all
        const queryParams = [];
        if (all !== "true") {
            query += " LIMIT ? OFFSET ?";
            queryParams.push(limit, offset);
        }

        const [rawProperties]: any = await pool.query(query, queryParams);

        const properties = rawProperties.map((property: any) => ({
            ...property,
            images: property.images ?? [],
            is_featured: property.is_featured === 1,
            is_hotspot: property.is_hotspot === 1,
            is_favourites: property.is_favourites === 1,
        }));

        return NextResponse.json({
            properties,
            total,
            page: all === "true" ? 1 : page,
            limit: all === "true" ? properties.length : limit
        });
    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ error: "Failed to fetch properties" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        console.log("body", body)
        const {
            name, image, description, price, owner_name, location, owner_contact, status,
            is_featured, is_hotspot, images,
            bedrooms, bathrooms, balconies, furnishing, carpet_area, floor, flooring, lifts, project,
            transaction_type, facing, address, overlooking, landmarks, booking_amount, price_breakup,
            flat, shopping_centers, educational_institute, nearby_localities, home_loans, emi
        } = body;

        if (!name || !description) {
            return NextResponse.json({ error: "Name and description are required." }, { status: 400 });
        }

        const [existing] = await pool.query(
            `SELECT id FROM properties WHERE name = ? LIMIT 1`,
            [name]
        );
        if ((existing as any[]).length > 0) {
            return NextResponse.json({ error: "Property with this name already exists." }, { status: 409 });
        }

        const imagesJson = images && images.length > 0 ? JSON.stringify(images) : null;

        let insertQuery = `INSERT INTO properties (
            name, image, description, price, owner_name, location, owner_contact, status,
            is_featured, is_hotspot, bedrooms, bathrooms, balconies, furnishing, carpet_area, floor, flooring,
            lifts, project, transaction_type, facing, address, overlooking, landmarks, booking_amount,
            price_breakup, flat, shopping_centers, educational_institute, nearby_localities, home_loans, emi
        `;

        const values = [
            name, image, description, price, owner_name, location, owner_contact, status,
            is_featured ? 1 : 0, is_hotspot ? 1 : 0,
            bedrooms, bathrooms, balconies, furnishing, carpet_area, floor, flooring, lifts, project,
            transaction_type, facing, address, overlooking, landmarks, booking_amount,
            price_breakup, flat, shopping_centers, educational_institute, nearby_localities, home_loans, emi
        ];

        let placeholders = `VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        try {
            await pool.query(`SELECT images FROM properties LIMIT 1`);
            insertQuery += `, images)`;
            placeholders = placeholders.replace(")", ", ?)");
            values.push(imagesJson);
        } catch {
            insertQuery += `)`;
        }

        insertQuery += ` ${placeholders}`;

        console.log('insertQuery', insertQuery);
        console.log('values', values)

        const [result] = await pool.execute(insertQuery, values) as [ResultSetHeader, any];

        return NextResponse.json({
            message: "Property added successfully!",
            propertyId: result.insertId,
        }, { status: 201 });
    } catch (error: any) {
        console.error("❌ POST Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}