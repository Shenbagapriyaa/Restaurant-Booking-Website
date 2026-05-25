import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema(
  {
    foodName: {
      type: String,
      required: [true, "Food name is required"],
      trim: true,
    },
    foodImage: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      required: [true, "Category (e.g. Starters, Mains) is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
    },
    vegNonVeg: {
      type: String,
      enum: ["veg", "nonVeg"],
      default: "nonVeg",
    },
    spicyLevel: {
      type: Number,
      default: 0,
      min: 0,
      max: 3,
    },
    bestseller: {
      type: Boolean,
      default: false,
    },
    chefSpecial: {
      type: Boolean,
      default: false,
    },
    rating: {
      type: Number,
      default: 5.0,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

export default MenuItem;
