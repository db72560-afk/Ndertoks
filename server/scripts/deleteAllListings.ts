import mongoose from "mongoose";
import { Listing } from "../src/models/Listing.js";
import dotenv from "dotenv";

dotenv.config();

const deleteAllListings = async () => {
  try {
    const mongoUrl = process.env.MONGODB_URL;
    if (!mongoUrl) {
      throw new Error("MONGODB_URL not found in environment variables");
    }

    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(mongoUrl);
    console.log("✅ Connected to MongoDB");

    console.log("🗑️  Deleting all listings...");
    const result = await Listing.deleteMany({});
    console.log(`✅ Successfully deleted ${result.deletedCount} listings`);

    await mongoose.disconnect();
    console.log("✅ Disconnected from MongoDB");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error deleting listings:", error);
    process.exit(1);
  }
};

deleteAllListings();
