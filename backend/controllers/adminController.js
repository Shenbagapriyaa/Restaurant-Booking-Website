import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";

// @desc    Add a new restaurant
// @route   POST /api/admin/restaurants
// @access  Private/Admin
export const addRestaurant = async (req, res, next) => {
  const {
    restaurantName,
    cuisineType,
    regionCategory,
    restaurantImage,
    description,
    location,
    openingHours,
    priceRange,
  } = req.body;

  try {
    // Basic table configuration (6 standard tables of varying sizes)
    const tableAvailability = [
      { tableNumber: 1, label: "Window · 2", seats: 2, available: true },
      { tableNumber: 2, label: "Booth · 4", seats: 4, available: true },
      { tableNumber: 3, label: "Bar · 2", seats: 2, available: true },
      { tableNumber: 4, label: "Chef's · 6", seats: 6, available: true },
      { tableNumber: 5, label: "Patio · 4", seats: 4, available: true },
      { tableNumber: 6, label: "Private · 8", seats: 8, available: true },
    ];

    const restaurant = await Restaurant.create({
      restaurantName,
      cuisineType,
      regionCategory,
      restaurantImage: restaurantImage || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4", // placeholder
      description,
      location,
      openingHours: openingHours || "5pm – 11pm",
      priceRange: priceRange || "$$$",
      tableAvailability,
      featured: false,
      trending: false,
    });

    res.status(201).json({
      success: true,
      message: "Restaurant added successfully",
      restaurant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Edit a restaurant
// @route   PUT /api/admin/restaurants/:id
// @access  Private/Admin
export const editRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    // Update keys
    const allowedUpdates = [
      "restaurantName",
      "cuisineType",
      "regionCategory",
      "restaurantImage",
      "description",
      "location",
      "openingHours",
      "priceRange",
      "featured",
      "trending",
    ];

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        restaurant[field] = req.body[field];
      }
    });

    const updatedRestaurant = await restaurant.save();

    res.json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant: updatedRestaurant,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a restaurant
// @route   DELETE /api/admin/restaurants/:id
// @access  Private/Admin
export const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    // Remove restaurant
    await Restaurant.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Restaurant deleted successfully",
      restaurantId: req.params.id,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add menu item to a restaurant
// @route   POST /api/admin/restaurants/:id/menu
// @access  Private/Admin
export const addMenuItem = async (req, res, next) => {
  const { foodName, foodImage, category, description, price, vegNonVeg, spicyLevel, bestseller, chefSpecial } = req.body;

  try {
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    // Create the menu item
    const menuItem = await MenuItem.create({
      foodName,
      foodImage: foodImage || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", // default food placeholder
      category,
      description,
      price: parseFloat(price),
      vegNonVeg: vegNonVeg || "nonVeg",
      spicyLevel: spicyLevel ? parseInt(spicyLevel) : 0,
      bestseller: bestseller === "true" || bestseller === true,
      chefSpecial: chefSpecial === "true" || chefSpecial === true,
      rating: 5.0,
    });

    // Append to restaurant menuItems list
    restaurant.menuItems.push(menuItem._id);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: "Menu item added successfully to " + restaurant.restaurantName,
      menuItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all users (Admin only)
// @route   GET /api/admin/users
// @access  Private/Admin
export const manageUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select("-password").sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    List all reservations (Admin only)
// @route   GET /api/admin/bookings
// @access  Private/Admin
export const manageReservations = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate("userId", "fullName email phoneNumber")
      .populate("restaurantId", "restaurantName location")
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

// @desc    Get dashboard metrics & analytics
// @route   GET /api/admin/analytics
// @access  Private/Admin
export const getAnalyticsDashboard = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments({});
    const totalBookings = await Booking.countDocuments({});
    const totalRestaurants = await Restaurant.countDocuments({});
    
    // Status Breakdowns
    const confirmedBookings = await Booking.countDocuments({ bookingStatus: "Confirmed" });
    const cancelledBookings = await Booking.countDocuments({ bookingStatus: "Cancelled" });

    // Recent Bookings
    const recentBookings = await Booking.find({})
      .populate("userId", "fullName")
      .populate("restaurantId", "restaurantName")
      .sort({ createdAt: -1 })
      .limit(5);

    // Distribution by region
    const regionAggregation = await Restaurant.aggregate([
      { $group: { _id: "$regionCategory", count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      metrics: {
        totalUsers,
        totalBookings,
        totalRestaurants,
        bookingsBreakdown: {
          confirmed: confirmedBookings,
          cancelled: cancelledBookings,
        },
        recentBookings,
        regionDistribution: regionAggregation,
      },
    });
  } catch (error) {
    next(error);
  }
};
