import mysql from "mysql2/promise";

declare global {
    var mysqlPool: ReturnType<typeof mysql.createPool> | undefined;
}

const pool =
    globalThis.mysqlPool ||
    mysql.createPool({
        host: process.env.DB_HOST || "127.0.0.1",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASS || "",
        database: process.env.DB_NAME || "PropertyApp",
        waitForConnections: true,
        connectionLimit: 20,
        queueLimit: 0,
    });

if (process.env.NODE_ENV !== "production") globalThis.mysqlPool = pool;

export default pool;


