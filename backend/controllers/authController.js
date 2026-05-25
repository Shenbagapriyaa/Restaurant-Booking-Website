import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  const { fullName, email, password, phoneNumber } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists with this email address");
    }

    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
      profileImage: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=d4af37&textColor=000`, // beautiful default avatar
    });

    if (user) {
      res.status(201).json({
        success: true,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data provided");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Authenticate user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Find user and explicitly request the password field
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      // Remove password before sending user info
      user.password = undefined;

      res.json({
        success: true,
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        profileImage: user.profileImage,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("favoriteRestaurants")
      .populate("favoriteDishes");

    if (user) {
      res.json({
        success: true,
        user,
      });
    } else {
      res.status(404);
      throw new Error("User profile not found");
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile details
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    user.fullName = req.body.fullName || user.fullName;
    user.phoneNumber = req.body.phoneNumber || user.phoneNumber;
    
    // Check if email has changed and if it's already taken
    if (req.body.email && req.body.email !== user.email) {
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        res.status(400);
        throw new Error("Email address is already in use by another account");
      }
      user.email = req.body.email;
    }

    if (req.body.password) {
      user.password = req.body.password;
    }

    // Handle Profile Image Upload (Cloudinary support if configured)
    if (req.file) {
      if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== "placeholder_cloud_name") {
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "maison_profiles",
          });
          user.profileImage = result.secure_url;
          // Delete temp local file
          fs.unlinkSync(req.file.path);
        } catch (uploadError) {
          console.error("Cloudinary upload failed:", uploadError);
          // Fallback to local path URL
          user.profileImage = `/uploads/${req.file.filename}`;
        }
      } else {
        // Fallback to local path URL
        user.profileImage = `/uploads/${req.file.filename}`;
      }
    }

    const updatedUser = await user.save();
    
    // Fetch user populated
    const populatedUser = await User.findById(updatedUser._id)
      .populate("favoriteRestaurants")
      .populate("favoriteDishes");

    res.json({
      success: true,
      user: populatedUser,
      token: generateToken(populatedUser._id),
    });
  } catch (error) {
    next(error);
  }
};
