// import pool from "@/lib/db";
// import { NextRequest, NextResponse } from "next/server";

// // /app/api/debug/route.ts
// export async function GET(req: NextRequest) {
//     try {
//         // 1. Check database structure
//         const [tableStructure] = await pool.query(`DESCRIBE properties`);

//         // 2. Check if images column exists
//         let hasImagesColumn = false;
//         let imagesColumnInfo = null;

//         const columns = tableStructure as any[];
//         for (const column of columns) {
//             if (column.Field === 'images') {
//                 hasImagesColumn = true;
//                 imagesColumnInfo = column;
//                 break;
//             }
//         }

//         // 3. Get sample properties to check data
//         const [properties] = await pool.query(
//             `SELECT id, name, image, ${hasImagesColumn ? 'images,' : ''} created_at FROM properties ORDER BY id DESC LIMIT 3`
//         );

//         // 4. Test JSON parsing if images column exists
//         let parsedImages = [];
//         if (hasImagesColumn && (properties as any[]).length > 0) {
//             const sampleProperty = (properties as any[])[0];
//             if (sampleProperty.images) {
//                 try {
//                     parsedImages = JSON.parse(sampleProperty.images);
//                 } catch (e) {
//                     parsedImages = [`Parse error: ${e}`];
//                 }
//             }
//         }

//         return NextResponse.json({
//             databaseStatus: {
//                 hasImagesColumn,
//                 imagesColumnInfo,
//                 totalColumns: columns.length,
//                 allColumns: columns.map(col => col.Field)
//             },
//             sampleData: {
//                 propertiesCount: (properties as any[]).length,
//                 properties: properties,
//                 parsedImagesExample: parsedImages
//             },
//             recommendations: hasImagesColumn
//                 ? "✅ Images column exists. Check form submission and data parsing."
//                 : "❌ Images column missing. Run: ALTER TABLE properties ADD COLUMN images TEXT;"
//         });
//     } catch (error: any) {
//         console.error("Debug error:", error);
//         return NextResponse.json({
//             error: error.message,
//             stack: error.stack
//         }, { status: 500 });
//     }
// }

// // Test endpoint to manually add images to a property
// export async function POST(req: NextRequest) {
//     try {
//         const { propertyId, testImages } = await req.json();

//         if (!propertyId) {
//             return NextResponse.json({ error: "Property ID required" }, { status: 400 });
//         }

//         const imagesToSave = testImages || [
//             "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=",
//             "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
//         ];

//         const imagesJson = JSON.stringify(imagesToSave);

//         const [result] = await pool.execute(
//             `UPDATE properties SET images = ? WHERE id = ?`,
//             [imagesJson, propertyId]
//         );

//         return NextResponse.json({
//             success: true,
//             message: `Test images added to property ${propertyId}`,
//             imagesCount: imagesToSave.length,
//             result
//         });
//     } catch (error: any) {
//         console.error("Test POST error:", error);
//         return NextResponse.json({
//             error: error.message
//         }, { status: 500 });
//     }
// }