import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User association is required"],
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: [true, "Restaurant association is required"],
    },
    bookingDate: {
      type: Date,
      required: [true, "Reservation date is required"],
    },
    bookingTime: {
      type: String,
      required: [true, "Reservation time slot is required"], // e.g. "19:30" or "7:30 PM"
    },
    guestCount: {
      type: Number,
      required: [true, "Guest count is required"],
      min: [1, "At least 1 guest must be selected"],
      max: [20, "For reservations over 20 guests, please contact us directly"],
    },
    tableNumber: {
      type: Number,
      required: [true, "Table assignment is required"],
    },
    specialRequest: {
      type: String,
      default: "",
    },
    bookingStatus: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Confirmed",
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

// Indexes to speed up queries for a user's reservations or restaurant bookings on a specific day
bookingSchema.index({ userId: 1, bookingDate: -1 });
bookingSchema.index({ restaurantId: 1, bookingDate: 1 });

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
