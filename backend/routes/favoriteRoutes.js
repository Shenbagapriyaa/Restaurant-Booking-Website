import express from "express";
import {
  addFavorite,
  removeFavorite,
  toggleFavoriteRestaurant,
} from "../controllers/favoriteController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Secure all favorite routes

router.post("/", addFavorite);
router.delete("/:id", removeFavorite);
router.post("/toggle/:id", toggleFavoriteRestaurant);

export default router;
