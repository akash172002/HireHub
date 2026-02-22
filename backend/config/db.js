import mongoose from "mongoose";

const connectDb = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("[DB] MONGO_URI is missing in .env – data will NOT be saved.");
    throw new Error("MONGO_URI is not set in .env");
  }
  try {
    await mongoose.connect(uri);
    const dbName = mongoose.connection.db?.databaseName || "unknown";
    console.log("[DB] Connected to MongoDB – database:", dbName, "| host:", mongoose.connection.host, "| writes will be saved here.");
  } catch (err) {
    console.error("[DB] Connection failed – data will NOT be saved:", err.message);
    throw err;
  }
};

export default connectDb;
