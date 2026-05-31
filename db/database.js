import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('receipts.db');

export const initDB = () => {
    db.execSync(`
        CREATE TABLE IF NOT EXISTS receipts (
        id TEXT PRIMARY KEY,
        store_name TEXT NOT NULL,
        date TEXT NOT NULL,
        qr_value TEXT NOT NULL,
        note TEXT
        );   
    `);
}