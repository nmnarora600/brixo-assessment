import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import pinoHttp from 'pino-http';
import dotenv from 'dotenv';
import { connectDb } from './db';
import { redis } from './cache';
import routes from './controllers/ifscController';
import { swagger } from './utils/swagger';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(pinoHttp());

app.get('/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/v1', routes);

swagger(app);

const start = async () => {
  await connectDb();
  await redis.ping();
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
};

start().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
