import User from "../models/User.js";

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    res.json({
      success: true,
      count: user.notifications.length,
      notifications: user.notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark all user notifications as read
// @route   PUT /api/notifications/read
// @access  Private
export const markNotificationsAsRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    // Update unread flag in subdocuments
    user.notifications.forEach((n) => {
      n.unread = false;
    });

    await user.save();

    res.json({
      success: true,
      message: "All notifications marked as read",
      notifications: user.notifications,
    });
  } catch (error) {
    next(error);
  }
};
