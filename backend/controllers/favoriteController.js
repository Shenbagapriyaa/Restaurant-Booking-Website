import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";

// @desc    Add a restaurant to favorites
// @route   POST /api/favorites
// @access  Private
export const addFavorite = async (req, res, next) => {
  const { restaurantId } = req.body;

  try {
    if (!restaurantId) {
      res.status(400);
      throw new Error("restaurantId is required");
    }

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    const user = await User.findById(req.user._id);
    const isFav = user.favoriteRestaurants.includes(restaurantId);

    if (!isFav) {
      user.favoriteRestaurants.push(restaurantId);
      await user.save();
    }

    res.status(201).json({
      success: true,
      message: "Added to favorites",
      favoriteRestaurants: user.favoriteRestaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a restaurant from favorites
// @route   DELETE /api/favorites/:id
// @access  Private
export const removeFavorite = async (req, res, next) => {
  const restaurantId = req.params.id;

  try {
    const user = await User.findById(req.user._id);
    
    user.favoriteRestaurants = user.favoriteRestaurants.filter(
      (id) => id.toString() !== restaurantId.toString()
    );
    await user.save();

    res.json({
      success: true,
      message: "Removed from favorites",
      favoriteRestaurants: user.favoriteRestaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite status of a restaurant
// @route   POST /api/favorites/restaurant/:id
// @access  Private
export const toggleFavoriteRestaurant = async (req, res, next) => {
  try {
    const restaurantId = req.params.id;
    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      res.status(404);
      throw new Error("Restaurant not found");
    }

    const user = await User.findById(req.user._id);
    const isFav = user.favoriteRestaurants.includes(restaurantId);

    if (isFav) {
      user.favoriteRestaurants = user.favoriteRestaurants.filter(
        (id) => id.toString() !== restaurantId.toString()
      );
      await user.save();
      res.json({
        success: true,
        message: "Removed from favorites",
        isFavorite: false,
        favoriteRestaurants: user.favoriteRestaurants,
      });
    } else {
      user.favoriteRestaurants.push(restaurantId);
      await user.save();
      res.json({
        success: true,
        message: "Added to favorites",
        isFavorite: true,
        favoriteRestaurants: user.favoriteRestaurants,
      });
    }
  } catch (error) {
    next(error);
  }
};
