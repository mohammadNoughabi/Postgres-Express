import { Pool } from 'pg';
import { ENV } from './envVariables.ts';

const pool = new Pool({
  host: ENV.DB_HOST,
  port: ENV.DB_PORT,
  user: ENV.DB_USER,
  password: ENV.DB_PASSWORD,
  database: ENV.DB_DATABASE,
});

const connectDb = async () => {
  await pool
    .connect()
    .then((client) => {
      console.log('🟢 Connected to PostgreSQL');
      client.release();
    })
    .catch((error) => {
      console.error('🔴 PostgreSQL Connection Error:', error);
      process.exit(1);
    });
};

export { pool, connectDb };
