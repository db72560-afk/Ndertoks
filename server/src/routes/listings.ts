import { Router, Response } from "express";
import { Listing } from "../models/Listing.js";
import { AuthRequest, verifyToken, checkRole, checkApproved } from "../middleware/auth.js";
import { createListingSchema } from "../utils/validators.js";
import { ZodError } from "zod";

const router = Router();

// Get all listings (public) with filters and pagination
router.get("/", async (req, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;
    const type = req.query.type as string;
    const search = req.query.search as string;

    const filter: any = { status: "active" };

    if (type && ["Parcel", "Contractor", "Material", "Architect", "Surveyor", "Logistics"].includes(type)) {
      filter.type = type;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const listings = await Listing.find(filter)
      .populate("userId", "fullName companyName whatsappNumber")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Listing.countDocuments(filter);

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
    console.error("Get listings error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Get single listing by ID (public)
router.get("/:id", async (req, res: Response) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "userId",
      "fullName companyName whatsappNumber email"
    );

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    // Increment views
    listing.views += 1;
    await listing.save();

    return res.json(listing);
  } catch (error) {
    console.error("Get listing error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// Create listing (Agent only, must be approved)
router.post(
  "/",
  verifyToken,
  checkRole("Agent"),
  checkApproved,
  async (req: AuthRequest, res: Response) => {
    try {
      const data = createListingSchema.parse(req.body);

      const listing = new Listing({
        ...data,
        userId: req.user?.id,
      });

      await listing.save();

      return res.status(201).json({
        message: "Listing created successfully",
        listing,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Create listing error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Update listing (Agent can only update own)
router.patch(
  "/:id",
  verifyToken,
  checkRole("Agent"),
  async (req: AuthRequest, res: Response) => {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      if (listing.userId.toString() !== req.user?.id) {
        return res
          .status(403)
          .json({ error: "You can only edit your own listings" });
      }

      // Validate the data being updated
      const data = createListingSchema.parse({
        ...listing.toObject(),
        ...req.body,
      });

      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        data,
        { new: true }
      );

      return res.json({
        message: "Listing updated successfully",
        listing: updatedListing,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ error: error.errors });
      }
      console.error("Update listing error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Delete listing (Agent can only delete own)
router.delete(
  "/:id",
  verifyToken,
  checkRole("Agent"),
  async (req: AuthRequest, res: Response) => {
    try {
      const listing = await Listing.findById(req.params.id);

      if (!listing) {
        return res.status(404).json({ error: "Listing not found" });
      }

      if (listing.userId.toString() !== req.user?.id) {
        return res
          .status(403)
          .json({ error: "You can only delete your own listings" });
      }

      await Listing.findByIdAndDelete(req.params.id);

      return res.json({
        message: "Listing deleted successfully",
      });
    } catch (error) {
      console.error("Delete listing error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// Record inquiry/click (public)
router.patch("/:id/inquiries", async (req, res: Response) => {
  try {
    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      { $inc: { inquiries: 1 } },
      { new: true }
    );

    if (!listing) {
      return res.status(404).json({ error: "Listing not found" });
    }

    return res.json(listing);
  } catch (error) {
    console.error("Update inquiries error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
