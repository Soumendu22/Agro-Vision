import mongoose from "mongoose";

// Declare a separate interface for the cached mongoose instance
interface MongooseConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Declare the global namespace to avoid conflicts
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseConnection | undefined;
}

// Initialize the mongoose cache
const globalMongoose = global.mongooseCache || {
  conn: null,
  promise: null,
};

global.mongooseCache = globalMongoose;

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

async function dbConnect() {
  try {
    if (globalMongoose.conn) {
      return globalMongoose.conn;
    }

    if (!globalMongoose.promise) {
      const opts = {
        bufferCommands: false,
      };

      globalMongoose.promise = mongoose.connect(MONGODB_URI, opts);
    }

    const conn = await globalMongoose.promise;
    globalMongoose.conn = conn;
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export default dbConnect;
