import express from "express";
import {
  addRestaurant,
  editRestaurant,
  deleteRestaurant,
  addMenuItem,
  manageUsers,
  manageReservations,
  getAnalyticsDashboard,
} from "../controllers/adminController.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly); // Enforce admin check for all subroutes

router.post("/restaurants", addRestaurant);
router.put("/restaurants/:id", editRestaurant);
router.delete("/restaurants/:id", deleteRestaurant);
router.post("/restaurants/:id/menu", addMenuItem);
router.get("/users", manageUsers);
router.get("/bookings", manageReservations);
router.get("/analytics", getAnalyticsDashboard);

export default router;
