import mongoose, { Schema, Document } from "mongoose";
import bcryptjs from "bcryptjs";

export type UserRole = "Admin" | "Agent" | "Client";

export interface IUser extends Document {
  email: string;
  password: string;
  fullName: string;
  role: UserRole;
  companyName?: string;
  whatsappNumber?: string;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["Admin", "Agent", "Client"],
      default: "Client",
    },
    companyName: {
      type: String,
    },
    whatsappNumber: {
      type: String,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcryptjs.genSalt(10);
    this.password = await bcryptjs.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcryptjs.compare(password, this.password);
};

export const User = mongoose.model<IUser>("User", userSchema);
