import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../..", "/.env") });

// Use a specific database name
const DB_NAME = process.env.DB_NAME || "layout-builder-db";

// Fix: Don't append the database name twice
const MONGODB_URI = process.env.MONGODB_URI || `mongodb://localhost:27017`;

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI, { dbName: DB_NAME });
    console.log(`MongoDB connected successfully to database: ${DB_NAME}`);
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Gracefully close connection when application terminates
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed due to app termination");
  process.exit(0);
});
