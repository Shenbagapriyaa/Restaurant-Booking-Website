import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  tableNumber: {
    type: Number,
    required: true,
  },
  label: {
    type: String, // e.g. "Window · 2", "Booth · 4", "Chef's · 6"
    required: true,
  },
  seats: {
    type: Number,
    required: true,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

const restaurantSchema = new mongoose.Schema(
  {
    restaurantName: {
      type: String,
      required: [true, "Restaurant name is required"],
      trim: true,
    },
    cuisineType: {
      type: String,
      required: [true, "Cuisine type is required"],
      trim: true,
    },
    regionCategory: {
      type: String,
      enum: ["Asian", "European", "American", "Middle Eastern"],
      required: [true, "Region category is required"],
    },
    restaurantImage: {
      type: String,
      default: "",
    },
    galleryImages: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: [true, "Location details are required"],
      trim: true,
    },
    openingHours: {
      type: String,
      default: "5pm – 11pm",
    },
    ratings: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    priceRange: {
      type: String,
      enum: ["$", "$$", "$$$", "$$$$"],
      default: "$$$",
    },
    menuItems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "MenuItem",
      },
    ],
    tableAvailability: [tableSchema],
    featured: {
      type: Boolean,
      default: false,
    },
    trending: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Search Index for query optimizations
restaurantSchema.index({ restaurantName: "text", location: "text", cuisineType: "text" });

const Restaurant = mongoose.model("Restaurant", restaurantSchema);

export default Restaurant;
