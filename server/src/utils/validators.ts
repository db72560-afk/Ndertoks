import { z } from "zod";

// Auth validators
export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(2),
  companyName: z.string().optional(),
  whatsappNumber: z.string().optional(),
  role: z.enum(["Admin", "Agent", "Client"]).default("Client"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

// Listing validators
export const parcelSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(2),
  price: z.number().min(0),
  area: z.number().min(0),
  parcelType: z.enum(["Industriale", "Rezidenciale", "Komerciale"]),
});

export const contractorSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(2),
  price: z.number().min(0),
  specialty: z.string().min(2),
  rating: z.number().min(0).max(5).optional(),
  projects: z.number().min(0).optional(),
});

export const materialSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(2),
  price: z.number().min(0),
  category: z.string().min(2),
  supplier: z.string().min(2),
  unit: z.string().min(1),
});

export const architectSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(2),
  price: z.number().min(0),
  specialty: z.string().min(2),
  rating: z.number().min(0).max(5).optional(),
  projects: z.number().min(0).optional(),
});

export const surveyorSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(2),
  price: z.number().min(0),
  specialty: z.string().min(2),
  rating: z.number().min(0).max(5).optional(),
  projects: z.number().min(0).optional(),
});

export const logisticsSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(2),
  price: z.number().min(0),
  specialty: z.string().min(2),
  rating: z.number().min(0).max(5).optional(),
  projects: z.number().min(0).optional(),
});

export const createListingSchema = z.object({
  type: z.enum(["Parcel", "Contractor", "Material", "Architect", "Surveyor", "Logistics"]),
  title: z.string().min(3),
  description: z.string().optional(),
  image: z.string().optional(),
  location: z.string().min(2),
  price: z.number().min(0),
  // Parcel fields
  area: z.number().min(0).optional(),
  parcelType: z
    .enum(["Industriale", "Rezidenciale", "Komerciale"])
    .optional(),
  // Contractor fields
  specialty: z.string().optional(),
  rating: z.number().min(0).max(5).optional(),
  projects: z.number().min(0).optional(),
  // Material fields
  category: z.string().optional(),
  supplier: z.string().optional(),
  unit: z.string().optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type CreateListingInput = z.infer<typeof createListingSchema>;
