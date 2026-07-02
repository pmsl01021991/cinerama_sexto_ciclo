import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

/** Pool de conexiones MySQL */
export const pool = mysql.createPool({
    host: process.env.DB_HOST ?? "127.0.0.1",
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? "root",
    password: process.env.DB_PASS ?? "1234",
    database: process.env.DB_NAME ?? "cinerama",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    namedPlaceholders: true,
    timezone: "Z",
});

/** Helper simple para consultas */
export async function query(sql, params = []) {
    const [rows] = await pool.execute(sql, params);
    return rows;
}

/** Helper para transacciones (opcional) */
export async function tx(work) {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const res = await work(conn);
        await conn.commit();
        return res;
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        conn.release();
    }
}

/** Test conexión al arrancar */
export async function testConnection() {
    const [r] = await pool.query("SELECT 1 AS ok");
    return r[0]?.ok === 1;
}
