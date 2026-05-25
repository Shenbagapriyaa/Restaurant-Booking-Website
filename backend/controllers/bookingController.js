import Booking from "../models/Booking.js";
import Restaurant from "../models/Restaurant.js";
import User from "../models/User.js";

// @desc    Book a table
// @route   POST /api/bookings
// @access  Private
export const bookTable = async (req, res, next) => {
  const { restaurantId, bookingDate, bookingTime, guestCount, tableNumber, specialRequest } = req.body;

  try {
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    // Verify if table exists in restaurant table layout
    const targetTable = restaurant.tableAvailability.find(t => t.tableNumber === parseInt(tableNumber));
    if (!targetTable) {
      res.status(400);
      throw new Error(`Table ${tableNumber} does not exist at this venue`);
    }

    // Check if table is already booked for that date & time
    const parsedDate = new Date(bookingDate);
    // Start and end of the day to query
    const startOfDay = new Date(parsedDate.setUTCHours(0, 0, 0, 0));
    const endOfDay = new Date(parsedDate.setUTCHours(23, 59, 59, 999));

    const existingBooking = await Booking.findOne({
      restaurantId,
      bookingDate: { $gte: startOfDay, $lte: endOfDay },
      bookingTime,
      tableNumber: parseInt(tableNumber),
      bookingStatus: { $ne: "Cancelled" }
    });

    if (existingBooking) {
      res.status(400);
      throw new Error(`Table ${tableNumber} is already booked for ${bookingTime} on this date.`);
    }

    // Create the booking
    const booking = await Booking.create({
      userId: req.user._id,
      restaurantId,
      bookingDate: new Date(bookingDate),
      bookingTime,
      guestCount: parseInt(guestCount),
      tableNumber: parseInt(tableNumber),
      specialRequest: specialRequest || "",
      bookingStatus: "Confirmed",
      paymentStatus: "Pending",
    });

    // Add confirmation notification to the user's account
    const user = await User.findById(req.user._id);
    if (user) {
      user.notifications.unshift({
        title: "Reservation confirmed",
        body: `${restaurant.restaurantName} · ${new Date(bookingDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })} at ${bookingTime}. Table ${tableNumber} (${targetTable.label.split(" · ")[0]}).`,
        icon: "Calendar",
        unread: true,
      });
      await user.save();
    }

    // Populate restaurant details for return payload
    await booking.populate("restaurantId");

    res.status(201).json({
      success: true,
      message: "Reservation confirmed successfully",
      booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user's reservations
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("restaurantId")
      .sort({ bookingDate: -1, bookingTime: -1 });

    res.json({
      success: true,
      count: bookings.length,
      bookings,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a reservation
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res, next) => {
  const { bookingDate, bookingTime, guestCount, tableNumber, specialRequest } = req.body;

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    // Confirm possession
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("You are not authorized to modify this booking");
    }

    const restaurant = await Restaurant.findById(booking.restaurantId);
    
    // Check conflicts if date, time, or table is modified
    if (
      (bookingDate && new Date(bookingDate).getTime() !== booking.bookingDate.getTime()) ||
      (bookingTime && bookingTime !== booking.bookingTime) ||
      (tableNumber && parseInt(tableNumber) !== booking.tableNumber)
    ) {
      const checkDate = bookingDate ? new Date(bookingDate) : booking.bookingDate;
      const checkTime = bookingTime || booking.bookingTime;
      const checkTable = tableNumber ? parseInt(tableNumber) : booking.tableNumber;

      const startOfDay = new Date(new Date(checkDate).setUTCHours(0, 0, 0, 0));
      const endOfDay = new Date(new Date(checkDate).setUTCHours(23, 59, 59, 999));

      const conflict = await Booking.findOne({
        _id: { $ne: booking._id },
        restaurantId: booking.restaurantId,
        bookingDate: { $gte: startOfDay, $lte: endOfDay },
        bookingTime: checkTime,
        tableNumber: checkTable,
        bookingStatus: { $ne: "Cancelled" }
      });

      if (conflict) {
        res.status(400);
        throw new Error(`Table ${checkTable} is occupied at ${checkTime} on this date.`);
      }

      booking.bookingDate = checkDate;
      booking.bookingTime = checkTime;
      booking.tableNumber = checkTable;
    }

    booking.guestCount = guestCount ? parseInt(guestCount) : booking.guestCount;
    booking.specialRequest = specialRequest !== undefined ? specialRequest : booking.specialRequest;

    const updatedBooking = await booking.save();
    await updatedBooking.populate("restaurantId");

    // Add modification notification to user profile
    const user = await User.findById(req.user._id);
    if (user && restaurant) {
      user.notifications.unshift({
        title: "Reservation updated",
        body: `Your visit to ${restaurant.restaurantName} is rescheduled to ${new Date(updatedBooking.bookingDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} at ${updatedBooking.bookingTime}.`,
        icon: "Calendar",
        unread: true,
      });
      await user.save();
    }

    res.json({
      success: true,
      message: "Reservation successfully rescheduled",
      booking: updatedBooking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a reservation
// @route   DELETE /api/bookings/:id
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error("Reservation not found");
    }

    // Confirm ownership or admin
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      res.status(403);
      throw new Error("You are not authorized to cancel this booking");
    }

    booking.bookingStatus = "Cancelled";
    await booking.save();

    const restaurant = await Restaurant.findById(booking.restaurantId);

    // Notify user
    const user = await User.findById(req.user._id);
    if (user && restaurant) {
      user.notifications.unshift({
        title: "Reservation cancelled",
        body: `We have cancelled your booking at ${restaurant.restaurantName}. We hope to host you another time.`,
        icon: "X",
        unread: true,
      });
      await user.save();
    }

    res.json({
      success: true,
      message: "Reservation cancelled successfully",
      bookingId: booking._id,
    });
  } catch (error) {
    next(error);
  }
};
