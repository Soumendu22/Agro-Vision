import { Connection, Mongoose } from 'mongoose';

declare global {
  let mongoose: {
    conn: Connection | null;
    promise: Promise<Mongoose> | null;
  };
} 