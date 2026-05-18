import { Router, Response } from "express";
import { User } from "../models/User.js";
import { Listing } from "../models/Listing.js";
import { AuthRequest, verifyToken, checkRole } from "../middleware/auth.js";

const router = Router();

// Get all users (paginated)
router.get(
  "/users",
  verifyToken,
  checkRole("Admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const skip = (page - 1) * limit;

      const users = await User.find()
        .select("-password")
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: -1 });

      const total = await User.countDocuments();

      return res.json({
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } catch (error) {
      console.error("Get users error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Approve user
router.patch(
  "/users/:id/approve",
  verifyToken,
  checkRole("Admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.params.id,
        { isApproved: true },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        message: "User approved successfully",
        user,
      });
    } catch (error) {
      console.error("Approve user error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Change user role
router.patch(
  "/users/:id/role",
  verifyToken,
  checkRole("Admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const { role } = req.body;

      if (!["Admin", "Agent", "Client"].includes(role)) {
        return res.status(400).json({ error: "Invalid role" });
      }

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { role },
        { new: true }
      ).select("-password");

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.json({
        message: "User role updated successfully",
        user,
      });
    } catch (error) {
      console.error("Change role error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete user
router.delete(
  "/users/:id",
  verifyToken,
  checkRole("Admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete user's listings
      await Listing.deleteMany({ userId: req.params.id });

      return res.json({
        message: "User and their listings deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Get admin statistics
router.get(
  "/stats",
  verifyToken,
  checkRole("Admin"),
  async (req: AuthRequest, res: Response) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalAgents = await User.countDocuments({ role: "Agent" });
      const approvedAgents = await User.countDocuments({
        role: "Agent",
        isApproved: true,
      });
      const pendingApprovals = await User.countDocuments({
        role: "Agent",
        isApproved: false,
      });
      const totalListings = await Listing.countDocuments({ status: "active" });
      const listingsByType = await Listing.aggregate([
        { $match: { status: "active" } },
        { $group: { _id: "$type", count: { $sum: 1 } } },
      ]);

      const usersByRole = await User.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
      ]);

      return res.json({
        totalUsers,
        totalAgents,
        approvedAgents,
        pendingApprovals,
        totalListings,
        listingsByType,
        usersByRole,
      });
    } catch (error) {
      console.error("Get stats error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default router;
