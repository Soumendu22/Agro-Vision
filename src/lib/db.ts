import mongoose from "mongoose";

declare global {
  var mongoose: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  } | null;
}

// Initialize global mongoose cache
global.mongoose = global.mongoose || { conn: null, promise: null };

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

async function dbConnect() {
  try {
    if (global.mongoose?.conn) {
      return global.mongoose.conn;
    }

    if (!global.mongoose?.promise) {
      const opts = {
        bufferCommands: false,
      };

      global.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
    }

    global.mongoose.conn = await global.mongoose.promise;
    return global.mongoose.conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default dbConnect;
