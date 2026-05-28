import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";

// Import routes
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import listingRoutes from "./routes/listings.js";
import agentRoutes from "./routes/agent.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
// Dynamic CORS to allow localhost and local network IPs
const corsOptions = {
  origin: function (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) {
      return callback(null, true);
    }

    // Allow localhost and local IPs
    const isLocalhost = origin.includes("localhost");
    const isLocal127 = origin.includes("127.0.0.1");
    const isPrivateIP = /^https?:\/\/(192\.168\.|10\.|172\.)/.test(origin);
    const isVercelApp = origin.includes(".vercel.app");
    const isCustomDomain = origin.includes("ndertoks.app");
    const isFrontendURL = process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL;

    if (isLocalhost || isLocal127 || isPrivateIP || isVercelApp || isCustomDomain || isFrontendURL) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"), false);
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));
// Increase payload limit to 10MB for image uploads (base64 encoded)
app.use(express.json({ limit: "10mb" }));

// MongoDB connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/listings", listingRoutes);
app.use("/api/agent", agentRoutes);

// Health check
app.get("/health", (req: Request, res: Response) => {
  res.json({ message: "Server is running" });
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error("Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
