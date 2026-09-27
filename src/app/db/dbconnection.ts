import mongoose from 'mongoose';

// const MONGODB_URI ='mongodb://monika:Monika%401234@72.60.101.86:27017/samabayasmartbazardatabase?authSource=admin'
// const MONGODB_URI = "mongodb://monika:Monika%401234@172.17.0.1:27017/samabayasmartbazardatabase?authSource=admin"


// const MONGODB_URI = 'mongodb://localhost:27017/samabayasmartbazardatabase'

// const database_url = process.env.NEXT_PUBLIC_MONGODB_URL as string
const database_url = "mongodb+srv://Vercel-Admin-samabayasmartbazardb:ITH2h2p6mDDjh7Wj@samabayasmartbazardb.tawbyvb.mongodb.net/?retryWrites=true" as string


interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

const globalWithMongoose = globalThis as unknown as { mongoose?: MongooseCache };

if (!globalWithMongoose.mongoose) {
  globalWithMongoose.mongoose = { conn: null, promise: null };
}

let cached = globalWithMongoose.mongoose;

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    const opts = { bufferCommands: false };

    cached.promise = mongoose.connect(database_url, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}
