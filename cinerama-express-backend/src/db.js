import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** Pool de conexiones MySQL */
export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    // SSL requerido por Aiven
    ssl: {
        ca: process.env.DB_CA_CERT
            ? process.env.DB_CA_CERT.replace(/\\n/g, "\n")
            : fs.readFileSync(path.join(__dirname, "..", "ca.pem"), "utf8"),
        rejectUnauthorized: true,
    },

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