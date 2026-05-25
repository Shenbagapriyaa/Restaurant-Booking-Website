import express from "express";
import {
  getAllRestaurants,
  getRestaurantById,
  getRecommendations,
} from "../controllers/restaurantController.js";
import {
  addRestaurant,
  editRestaurant,
  deleteRestaurant,
} from "../controllers/adminController.js";
import { protect, adminOnly, optionalProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getAllRestaurants);
router.get("/recommendations", optionalProtect, getRecommendations);
router.get("/:id", getRestaurantById);

// Admin-only endpoints matching the API spec
router.post("/", protect, adminOnly, addRestaurant);
router.put("/:id", protect, adminOnly, editRestaurant);
router.delete("/:id", protect, adminOnly, deleteRestaurant);

export default router;
