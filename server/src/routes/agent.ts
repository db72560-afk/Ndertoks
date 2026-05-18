import { Router, Response } from "express";
import mongoose from "mongoose";
import { Listing } from "../models/Listing.js";
import { AuthRequest, verifyToken, checkRole, checkApproved } from "../middleware/auth.js";

const router = Router();

// Get agent's own listings
router.get(
  "/my-listings",
  verifyToken,
  checkRole("Agent"),
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const listings = await Listing.find({ userId: req.user?.id })
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await Listing.countDocuments({ userId: req.user?.id });

      return res.json({
        listings,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get my listings error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get agent statistics
router.get(
  "/stats",
  verifyToken,
  checkRole("Agent"),
  async (req: AuthRequest, res: Response) => {
    try {
      const agentId = req.user?.id;

      // Get listing stats
      const listings = await Listing.find({ userId: agentId });
      const totalListings = listings.length;
      const totalViews = listings.reduce((sum, l) => sum + l.views, 0);
      const totalInquiries = listings.reduce((sum, l) => sum + l.inquiries, 0);

      // Get listings by type
      const listingsByType = await Listing.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(agentId) } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]);

      // Get active vs inactive
      const activeListings = listings.filter((l) => l.status === "active").length;
      const inactiveListings = listings.filter((l) => l.status === "inactive")
        .length;

      return res.json({
        totalListings,
        activeListings,
        inactiveListings,
        totalViews,
        totalInquiries,
        listingsByType,
      });
    } catch (error) {
      console.error("Get agent stats error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
