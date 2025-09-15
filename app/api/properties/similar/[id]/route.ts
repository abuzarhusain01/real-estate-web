// File: app/api/properties/similar/[id]/route.ts
// Enhanced version of your existing API

import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    // Get query parameters for pagination and filtering
    const { searchParams } = new URL(request.url);
    const bedrooms = searchParams.get('bedrooms') || '';
    const bathrooms = searchParams.get('bathrooms') || '';
    const balconies = searchParams.get('balconies') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = (page - 1) * limit;

    try {
        // First get the current property to understand what we're matching against
        const [currentProperty]: any = await pool.query(
            "SELECT bedrooms, bathrooms, balconies, location, price FROM properties WHERE id = ? LIMIT 1",
            [id]
        );

        if (!currentProperty.length) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        const current = currentProperty[0];

        // Use provided parameters or fall back to current property values
        const targetBedrooms = bedrooms || current.bedrooms;
        const targetBathrooms = bathrooms || current.bathrooms;
        const targetBalconies = balconies || current.balconies;

        // Calculate price range (±30% of current property)
        const currentPrice = parseFloat(current.price);
        const priceMin = currentPrice * 0.7;
        const priceMax = currentPrice * 1.3;

        // Enhanced query with smart similarity matching
        const [rows]: any = await pool.query(`
            SELECT 
                id, 
                name, 
                image, 
                price, 
                bedrooms, 
                bathrooms, 
                balconies,
                (
                    (CASE WHEN bedrooms = ? THEN 3 ELSE 0 END) +
                    (CASE WHEN bathrooms = ? THEN 2 ELSE 0 END) +
                    (CASE WHEN balconies = ? THEN 1 ELSE 0 END) +
                    (CASE WHEN location = ? THEN 2 ELSE 0 END) +
                    (CASE WHEN price BETWEEN ? AND ? THEN 1 ELSE 0 END)
                ) as similarity_score
            FROM properties 
            WHERE id != ?
            HAVING similarity_score > 0
            ORDER BY similarity_score DESC, ABS(price - ?) ASC
            LIMIT ? OFFSET ?
        `, [
            targetBedrooms,    // bedrooms match
            targetBathrooms,   // bathrooms match  
            targetBalconies,   // balconies match
            current.location,  // location match
            priceMin,         // price range min
            priceMax,         // price range max
            id,               // exclude current property
            currentPrice,     // for price sorting
            limit,            // pagination limit
            offset           // pagination offset
        ]);

        // Remove similarity_score from response (keep it clean like your original)
        const similarProperties = rows.map(({ similarity_score, ...property }: any) => property);

        return NextResponse.json(similarProperties);

    } catch (error) {
        console.error(error);

        // Fallback to your original simple query if enhanced query fails
        try {
            const [rows]: any = await pool.query(
                "SELECT id, name, image, price, bedrooms, bathrooms, balconies FROM properties WHERE id != ? LIMIT ? OFFSET ?",
                [id, limit, offset]
            );
            return NextResponse.json(rows);
        } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
    }
}

// Alternative simpler enhancement (if the above complex query doesn't work)
export async function GET_SIMPLE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    const { searchParams } = new URL(request.url);
    const bedrooms = searchParams.get('bedrooms') || '';
    const bathrooms = searchParams.get('bathrooms') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '6');
    const offset = (page - 1) * limit;

    try {
        // Get current property info
        const [currentProperty]: any = await pool.query(
            "SELECT bedrooms, bathrooms, location, price FROM properties WHERE id = ? LIMIT 1",
            [id]
        );

        if (!currentProperty.length) {
            return NextResponse.json({ error: "Property not found" }, { status: 404 });
        }

        const current = currentProperty[0];
        const targetBedrooms = bedrooms || current.bedrooms;
        const targetBathrooms = bathrooms || current.bathrooms;

        // Simple but effective query
        const [rows]: any = await pool.query(`
            SELECT id, name, image, price, bedrooms, bathrooms, balconies
            FROM properties 
            WHERE id != ? 
            AND (
                bedrooms = ? 
                OR bathrooms = ?
                OR location = ?
            )
            ORDER BY 
                (bedrooms = ?) DESC,
                (bathrooms = ?) DESC,
                (location = ?) DESC,
                ABS(price - ?) ASC
            LIMIT ? OFFSET ?
        `, [
            id,                    // exclude current
            targetBedrooms,        // bedroom match
            targetBathrooms,       // bathroom match  
            current.location,      // location match
            targetBedrooms,        // for ordering
            targetBathrooms,       // for ordering
            current.location,      // for ordering
            parseFloat(current.price), // for price sorting
            limit,                 // pagination
            offset                // pagination
        ]);

        return NextResponse.json(rows);

    } catch (error) {
        console.error(error);

        // Ultimate fallback - your original query
        try {
            const [rows]: any = await pool.query(
                "SELECT id, name, image, price FROM properties WHERE id != ? LIMIT ?",
                [id, limit]
            );
            return NextResponse.json(rows);
        } catch (fallbackError) {
            return NextResponse.json({ error: "Server error" }, { status: 500 });
        }
    }
}