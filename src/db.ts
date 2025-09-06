import mongoose from 'mongoose';
import { config } from './config';

export const connectDb = async () => {
  await mongoose.connect(config.mongoUri, { autoIndex: true });
  console.log('MongoDB connected');
};
