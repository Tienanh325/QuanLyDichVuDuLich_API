const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '123456',
    database: process.env.DB_NAME || 'travel',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000,
    ssl: false,
    namedPlaceholders: true,
});

const connectDB = async () => {
    try {
        const [rows] = await pool.query('SELECT 1 AS ok');
        if (rows?.[0]?.ok === 1) {
            console.log(`✅ MySQL connected: ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}/${process.env.DB_NAME || 'travel'}`);
        }
    } catch (err) {
        console.error('❌ MySQL connection failed');
        console.error(`   code: ${err.code || 'UNKNOWN'}`);
        console.error(`   message: ${err.message}`);
        throw err;
    }
};

module.exports = { pool, connectDB };
