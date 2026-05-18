import mongoose, { Schema, Document } from "mongoose";

export type ListingType = "Parcel" | "Contractor" | "Material" | "Architect" | "Surveyor" | "Logistics";
export type ListingStatus = "active" | "inactive" | "deleted";

export interface IListing extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  image?: string;
  location: string;
  price: number;
  type: ListingType;
  status: ListingStatus;
  views: number;
  inquiries: number;
  createdAt: Date;
  updatedAt: Date;
  // Parcel specific fields
  area?: number;
  parcelType?: "Industriale" | "Rezidenciale" | "Komerciale";
  // Contractor specific fields
  specialty?: string;
  rating?: number;
  projects?: number;
  // Material specific fields
  category?: string;
  supplier?: string;
  unit?: string;
}

const listingSchema = new Schema<IListing>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    image: {
      type: String,
    },
    location: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["Parcel", "Contractor", "Material", "Architect", "Surveyor", "Logistics"],
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    views: {
      type: Number,
      default: 0,
    },
    inquiries: {
      type: Number,
      default: 0,
    },
    // Parcel specific
    area: {
      type: Number,
    },
    parcelType: {
      type: String,
      enum: ["Industriale", "Rezidenciale", "Komerciale"],
    },
    // Contractor specific
    specialty: {
      type: String,
    },
    rating: {
      type: Number,
    },
    projects: {
      type: Number,
    },
    // Material specific
    category: {
      type: String,
    },
    supplier: {
      type: String,
    },
    unit: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
listingSchema.index({ userId: 1 });
listingSchema.index({ type: 1 });
listingSchema.index({ createdAt: -1 });
listingSchema.index({ status: 1 });

export const Listing = mongoose.model<IListing>("Listing", listingSchema);
