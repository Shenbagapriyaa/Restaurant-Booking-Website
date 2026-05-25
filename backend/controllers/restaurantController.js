import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import Booking from "../models/Booking.js";

// @desc    Get all restaurants with search and filters
// @route   GET /api/restaurants
// @access  Public
export const getAllRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, region, price, rating, featured, trending } = req.query;

    const query = {};

    // Text Search (on name, location, cuisine)
    if (search) {
      query.$or = [
        { restaurantName: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { cuisineType: { $regex: search, $options: "i" } },
      ];
    }

    // Cuisine Filter
    if (cuisine && cuisine !== "All") {
      query.cuisineType = { $regex: cuisine, $options: "i" };
    }

    // Region Filter
    if (region) {
      query.regionCategory = region;
    }

    // Price Filter (e.g. $, $$, $$$, $$$$)
    if (price) {
      query.priceRange = price;
    }

    // Minimum Rating Filter
    if (rating) {
      query.ratings = { $gte: parseFloat(rating) };
    }

    // Featured / Trending status
    if (featured) {
      query.featured = featured === "true";
    }
    
    if (trending) {
      query.trending = trending === "true";
    }

    const restaurants = await Restaurant.find(query).populate("menuItems");

    res.json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant details by ID
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate("menuItems");

    if (restaurant) {
      res.json({
        success: true,
        restaurant,
      });
    } else {
      res.status(404);
      throw new Error("Restaurant not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get recommended dishes and restaurants (AI recommendation system)
// @route   GET /api/recommendations
// @access  Private/Public (Fallback to featured if unauthorized)
export const getRecommendations = async (req, res, next) => {
  try {
    let favoriteCuisines = [];
    let userId = req.user ? req.user._id : null;

    if (userId) {
      // Find user and populate favorite restaurants
      const user = await req.user.populate("favoriteRestaurants");
      
      // Collect cuisines from favorite restaurants
      if (user.favoriteRestaurants && user.favoriteRestaurants.length > 0) {
        user.favoriteRestaurants.forEach((rest) => {
          if (!favoriteCuisines.includes(rest.cuisineType)) {
            favoriteCuisines.push(rest.cuisineType);
          }
        });
      }

      // Collect cuisines from past bookings
      const bookings = await Booking.find({ userId }).populate("restaurantId");
      if (bookings && bookings.length > 0) {
        bookings.forEach((booking) => {
          if (booking.restaurantId && !favoriteCuisines.includes(booking.restaurantId.cuisineType)) {
            favoriteCuisines.push(booking.restaurantId.cuisineType);
          }
        });
      }
    }

    let recommendedRestaurants = [];
    let recommendedDishes = [];

    // If we have favorite cuisines from user history
    if (favoriteCuisines.length > 0) {
      // Find restaurants matching favorite cuisines, sorting by rating descending
      recommendedRestaurants = await Restaurant.find({
        cuisineType: { $in: favoriteCuisines },
      })
        .limit(4)
        .populate("menuItems");

      // Find chef special or bestseller menu items in those cuisines
      recommendedDishes = await MenuItem.find({
        category: { $in: ["Mains", "Starters"] },
        $or: [{ chefSpecial: true }, { bestseller: true }],
      }).limit(4);
    }

    // Fill recommendations with trending / featured if we don't have enough matching results
    if (recommendedRestaurants.length < 4) {
      const additionalRestaurants = await Restaurant.find({
        _id: { $not: { $in: recommendedRestaurants.map((r) => r._id) } },
        $or: [{ featured: true }, { trending: true }],
      })
        .limit(4 - recommendedRestaurants.length)
        .populate("menuItems");
      recommendedRestaurants = [...recommendedRestaurants, ...additionalRestaurants];
    }

    if (recommendedDishes.length < 4) {
      const additionalDishes = await MenuItem.find({
        _id: { $not: { $in: recommendedDishes.map((d) => d._id) } },
        $or: [{ chefSpecial: true }, { bestseller: true }],
      }).limit(4 - recommendedDishes.length);
      recommendedDishes = [...recommendedDishes, ...additionalDishes];
    }

    res.json({
      success: true,
      explanation: favoriteCuisines.length > 0 
        ? `Based on your interest in ${favoriteCuisines.slice(0, 2).join(" & ")}` 
        : "Curated selections based on trending reviews",
      restaurants: recommendedRestaurants.slice(0, 4),
      dishes: recommendedDishes.slice(0, 4),
    });
  } catch (error) {
    next(error);
  }
};
