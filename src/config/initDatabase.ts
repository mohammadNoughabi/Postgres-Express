import { pool } from './db.ts';

export async function initDatabase(): Promise<void> {
  try {
    const createUsersTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY ,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role VARCHAR(20) NOT NULL DEFAULT 'regular'
        );
        `;

    await pool.query(createUsersTableQuery);
    console.log('🟢 Users table is ready');
  } catch (error) {
    console.error('🔴 Database initialization error:', error);
    throw error;
  }
}
