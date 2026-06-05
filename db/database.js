import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('receipts.db');

export const initDB = () => {
    db.execSync(
        'CREATE TABLE IF NOT EXISTS receipts (' +
        'id TEXT PRIMARY KEY, ' +
        'store_name TEXT NOT NULL, ' +
        'expiration_date TEXT NOT NULL, ' +
        'qr_value TEXT NOT NULL, ' +
        'barcode_type TEXT NOT NULL DEFAULT \'qr\', ' +
        'receipt_value FLOAT NOT NULL, ' +
        'created_at TEXT NOT NULL' +
        ')'
    );
};

export const getAllReceipts = () => {
    return db.getAllSync('SELECT * FROM receipts ORDER BY created_at');
};

export const addReceipt = ({ id, store_name, expiration_date, qr_value, barcode_type = 'qr', receipt_value }) => {
    db.runSync(
        'INSERT INTO receipts (id, store_name, expiration_date, qr_value, barcode_type, receipt_value, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, store_name, expiration_date, qr_value, barcode_type, receipt_value, new Date().toISOString()]
    );
};

export const deleteReceipt = (id) => {
    db.runSync('DELETE FROM receipts WHERE id=?', [id]);
};
