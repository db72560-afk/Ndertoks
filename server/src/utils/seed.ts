import mongoose from "mongoose";
import { User } from "../models/User.js";
import { Listing } from "../models/Listing.js";
import "dotenv/config";

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Listing.deleteMany({});
    console.log("Cleared existing data");

    // Create sample users
    const adminUser = await User.create({
      email: "admin@kosovobuild.com",
      password: "Admin123", // Will be hashed by pre-hook
      fullName: "Admin User",
      role: "Admin",
      isApproved: true,
    });

    const agent1 = await User.create({
      email: "agent1@kosovobuild.com",
      password: "Agent123",
      fullName: "Gëzim Hoxha",
      role: "Agent",
      companyName: "GH Construction",
      whatsappNumber: "+383401234567",
      isApproved: true,
    });

    const agent2 = await User.create({
      email: "agent2@kosovobuild.com",
      password: "Agent123",
      fullName: "Arben Xhafa",
      role: "Agent",
      companyName: "Xhafa Group",
      whatsappNumber: "+383402345678",
      isApproved: true,
    });

    const client1 = await User.create({
      email: "client1@kosovobuild.com",
      password: "Client123",
      fullName: "Drita Krasniqi",
      role: "Client",
      isApproved: false,
    });

    console.log("Created users");

    // Create sample listings - Parcels
    const parcels = [
      {
        userId: agent1._id,
        title: "Industrial Plot - Prishtina",
        description: "Prime industrial location near highway",
        location: "Prishtina",
        price: 250000,
        type: "Parcel",
        area: 5000,
        parcelType: "Industriale",
        status: "active",
        image:
          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500",
      },
      {
        userId: agent1._id,
        title: "Residential Plot - Prizren",
        description: "Beautiful residential area with all utilities",
        location: "Prizren",
        price: 180000,
        type: "Parcel",
        area: 800,
        parcelType: "Rezidenciale",
        status: "active",
        image:
          "https://images.unsplash.com/photo-1500382017468-f049863256f0?w=500",
      },
      {
        userId: agent2._id,
        title: "Commercial Plot - Ferizaj",
        description: "High foot traffic location",
        location: "Ferizaj",
        price: 320000,
        type: "Parcel",
        area: 2500,
        parcelType: "Komerciale",
        status: "active",
        image:
          "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=500",
      },
    ];

    // Create sample listings - Contractors
    const contractors = [
      {
        userId: agent1._id,
        title: "General Construction Services",
        description: "Professional construction team with 20+ years experience",
        location: "Prishtina",
        price: 150,
        type: "Contractor",
        specialty: "Ndërtim",
        rating: 4.8,
        projects: 45,
        status: "active",
        image:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500",
      },
      {
        userId: agent2._id,
        title: "Electrical Installation Experts",
        description: "Expert electrical work for residential and commercial",
        location: "Pristina",
        price: 80,
        type: "Contractor",
        specialty: "Instalime",
        rating: 4.7,
        projects: 78,
        status: "active",
        image:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500",
      },
      {
        userId: agent1._id,
        title: "Metal Work & Steel Services",
        description: "Custom metalwork and structural steel solutions",
        location: "Prizren",
        price: 120,
        type: "Contractor",
        specialty: "Punime metalike",
        rating: 4.6,
        projects: 32,
        status: "active",
        image:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500",
      },
    ];

    // Create sample listings - Materials
    const materials = [
      {
        userId: agent2._id,
        title: "Portland Cement Grade A",
        description: "High quality cement from trusted suppliers",
        location: "Prishtina",
        price: 7.5,
        type: "Material",
        category: "Çimento",
        supplier: "Lafarge Kosovo",
        unit: "kg",
        status: "active",
        image:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500",
      },
      {
        userId: agent1._id,
        title: "Red Brick Standard",
        description: "Durable red bricks for all construction needs",
        location: "Ferizaj",
        price: 0.5,
        type: "Material",
        category: "Tulla",
        supplier: "Brick Factory Ltd",
        unit: "piece",
        status: "active",
        image:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500",
      },
      {
        userId: agent2._id,
        title: "Steel Reinforcement Bars",
        description: "Premium quality rebar for structural work",
        location: "Prishtina",
        price: 1.2,
        type: "Material",
        category: "Hekur",
        supplier: "ArcelorMittal",
        unit: "kg",
        status: "active",
        image:
          "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=500",
      },
    ];

    await Listing.insertMany([...parcels, ...contractors, ...materials]);
    console.log("Created listings");

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDatabase();
