// src/lib/db.ts
import mongoose from "mongoose";

// Load connection string from environment
const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("Missing MONGODB_URI in environment");
}

// Prevent multiple connections in dev / hot-reload
type Cache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

// Reuse cached connection across hot reloads (in dev)
let cached: Cache = (global as any)._mongoose ?? { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    // At this point, `uri` is guaranteed to be a string
    cached.promise = mongoose.connect(uri as string, { dbName: "ig_automation" });
  }

  cached.conn = await cached.promise;
  (global as any)._mongoose = cached;

  return cached.conn;
}
