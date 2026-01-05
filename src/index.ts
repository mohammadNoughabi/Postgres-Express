import express from 'express';
import type { Application } from 'express';
import cookieParser from 'cookie-parser';
import { ENV } from './config/envVariables.ts';
import router from './routes/router.ts';
import { connectDb } from './config/db.ts';
import { initDatabase } from './config/initDatabase.ts';
import { errorHandler } from './middlewares/errorHandler.ts';

const app: Application = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', router);
app.use(errorHandler);

async function main() {
  try {
    // Connecting to postgresql database
    await connectDb();

    // Initialize database tables
    await initDatabase();

    // Start server
    const port = ENV.PORT || 3000;
    const environment = ENV.NODE_ENV || 'development';
    app.listen(port, () => {
      console.log(
        `✅ Server is running in ${environment} mode on http://localhost:${port}`,
      );
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

void main();

export default app;
