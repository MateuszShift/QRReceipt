import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('receipts.db');

export const initDB = () => {
    db.execSync(`DROP TABLE IF EXISTS receipts`);
    db.execSync(`
        CREATE TABLE IF NOT EXISTS receipts (
        id TEXT PRIMARY KEY,
        store_name TEXT NOT NULL,
        expiration_date TEXT NOT NULL,
        qr_value TEXT NOT NULL,
        note TEXT,
        created_at TEXT NOT NULL
        );   
    `);
};

export const getAllReceipts = () => {
    return db.getAllSync('SELECT * FROM receipts ORDER BY created_at');
}

export const addReceipt = ({ id, store_name, expiration_date, qr_value, note }) => {
  db.runSync(
    'INSERT INTO receipts (id, store_name, expiration_date, qr_value, note, created_at) VALUES (?, ?, ?, ?, ?, ?)',
    [id, store_name, expiration_date, qr_value, note ?? '', new Date().toISOString()]
  );
};