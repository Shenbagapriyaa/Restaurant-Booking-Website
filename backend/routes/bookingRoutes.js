import express from "express";
import {
  bookTable,
  getMyBookings,
  updateBooking,
  cancelBooking,
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect); // Secure all booking routes

router.post("/", bookTable);
router.get("/my-bookings", getMyBookings);
router.put("/:id", updateBooking);
router.delete("/:id", cancelBooking);

export default router;
