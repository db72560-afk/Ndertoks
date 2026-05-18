import { Router, Response } from "express";
import { User } from "../models/User.js";
import { AuthRequest, verifyToken } from "../middleware/auth.js";
import { registerSchema, loginSchema } from "../utils/validators.js";
import jwt from "jsonwebtoken";
import { ZodError } from "zod";

const router = Router();

// Register
router.post("/register", async (req, res: Response) => {
  try {
    const data = registerSchema.parse(req.body);

    // Check if user exists
    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new user - only Admin role bypass approval requirement
    const user = new User({
      ...data,
      isApproved: data.role === "Admin" ? true : false,
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isApproved: user.isApproved,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Register error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res: Response) => {
  try {
    const data = loginSchema.parse(req.body);

    // Find user
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(data.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isApproved: user.isApproved,
        companyName: user.companyName,
        whatsappNumber: user.whatsappNumber,
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error("Login error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get("/me", verifyToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json(user);
  } catch (error) {
    console.error("Get user error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
