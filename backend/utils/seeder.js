import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

// Models
import User from "../models/User.js";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import Booking from "../models/Booking.js";

// Data
import { menuItemsData, restaurantsData } from "./seedData.js";

dotenv.config();

// Seeding function
const importData = async () => {
  try {
    await connectDB();

    // Clear existing database collections
    await User.deleteMany();
    await Restaurant.deleteMany();
    await MenuItem.deleteMany();
    await Booking.deleteMany();

    console.log("Database cleared successfully...");

    // 1. Insert Menu Items
    const createdMenuItems = await MenuItem.insertMany(menuItemsData);
    console.log(`${createdMenuItems.length} Menu Items seeded.`);

    // Map menu items by category / cuisine for easier association
    const starters = createdMenuItems.filter((item) => item.category === "Starters");
    const mains = createdMenuItems.filter((item) => item.category === "Mains");
    const desserts = createdMenuItems.filter((item) => item.category === "Desserts");
    const easternItems = createdMenuItems.filter((item) => item.category === "From the East");
    const mocktails = createdMenuItems.filter((item) => item.category === "Mocktails");

    // 2. Map & Seed Restaurants
    const seededRestaurants = [];

    for (let rData of restaurantsData) {
      // Setup table occupancy configurations
      const tableAvailability = [
        { tableNumber: 1, label: "Window · 2", seats: 2, available: true },
        { tableNumber: 2, label: "Booth · 4", seats: 4, available: true },
        { tableNumber: 3, label: "Bar · 2", seats: 2, available: false }, // pre-book table 3 to look realistic
        { tableNumber: 4, label: "Chef's · 6", seats: 6, available: true },
        { tableNumber: 5, label: "Patio · 4", seats: 4, available: true },
        { tableNumber: 6, label: "Private · 8", seats: 8, available: false }, // pre-book table 6 to look realistic
      ];

      // Associate specific menu items depending on cuisine
      let menuRefs = [];

      // Add general starters, desserts, and mocktails
      menuRefs.push(...starters.map((i) => i._id));
      menuRefs.push(...desserts.map((i) => i._id));
      menuRefs.push(...mocktails.map((i) => i._id));

      if (rData.cuisineType === "Japanese Omakase") {
        const japaneseDish = easternItems.find((d) => d.foodName.includes("Omakase"));
        if (japaneseDish) menuRefs.push(japaneseDish._id);
      } else if (rData.cuisineType === "Modern European") {
        menuRefs.push(...mains.filter((m) => ["A5 Wagyu Reserve", "Atlantic Turbot", "Tagliolini al Tartufo"].includes(m.foodName)).map((i) => i._id));
      } else if (rData.cuisineType === "French Bistro") {
        menuRefs.push(...mains.filter((m) => ["Atlantic Turbot", "Tagliolini al Tartufo"].includes(m.foodName)).map((i) => i._id));
      } else if (rData.cuisineType === "Steakhouse") {
        menuRefs.push(...mains.filter((m) => ["A5 Wagyu Reserve", "Gourmet Truffle Burger"].includes(m.foodName)).map((i) => i._id));
      }

      // If it's a general restaurant, add eastern dishes
      if (rData.cuisineType === "Modern European") {
        menuRefs.push(...easternItems.filter((e) => ["Masala Dosa", "Paneer Butter Masala", "Lucknowi Chicken Biryani"].includes(e.foodName)).map((i) => i._id));
      }

      const newRest = await Restaurant.create({
        ...rData,
        tableAvailability,
        menuItems: menuRefs,
      });
      seededRestaurants.push(newRest);
    }

    console.log(`${seededRestaurants.length} Restaurants seeded.`);

    // 3. Create Seed Users
    // 3a. Admin Account
    await User.create({
      fullName: "Maison Admin",
      email: "admin@maison.com",
      password: "adminpassword",
      role: "admin",
      phoneNumber: "+1 (212) 555-0199",
      profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Admin&backgroundColor=000&textColor=fff"
    });

    // 3b. Customer Account (Jane Doe)
    const jane = await User.create({
      fullName: "Jane Doe",
      email: "jane.doe@maison.com",
      password: "password123",
      role: "user",
      phoneNumber: "+1 (212) 555-0182",
      profileImage: "https://api.dicebear.com/7.x/initials/svg?seed=Jane%20Doe&backgroundColor=d4af37&textColor=000",
      favoriteRestaurants: [seededRestaurants[0]._id, seededRestaurants[2]._id, seededRestaurants[3]._id],
      favoriteDishes: [createdMenuItems[0]._id, createdMenuItems[2]._id],
      notifications: [
        {
          title: "Welcome to Maison",
          body: "Your premium account is successfully set up. Book luxury dining reservations with zero service fees.",
          icon: "Star",
          unread: false
        },
        {
          title: "Chef's tasting menu added",
          body: "Kaiseki Mori just released a new spring omakase.",
          icon: "Star",
          unread: true
        },
        {
          title: "Points earned",
          body: "You earned 250 Gold points! Redeem points toward a complimentary wine pairing on your next booking.",
          icon: "TrendingUp",
          unread: true
        }
      ]
    });

    // 3c. Seed user bookings to make the dashboard look active
    // Active Booking 1: Aurum (Tonite)
    const dateTonight = new Date();
    dateTonight.setUTCHours(19, 30, 0, 0); // 7:30 PM

    const booking1 = await Booking.create({
      userId: jane._id,
      restaurantId: seededRestaurants[0]._id,
      bookingDate: dateTonight,
      bookingTime: "7:30 PM",
      guestCount: 2,
      tableNumber: 4, // Chef's table
      specialRequest: "Window table preferred, celebrating anniversary.",
      bookingStatus: "Confirmed",
      paymentStatus: "Pending"
    });

    // Active Booking 2: Kaiseki Mori (Next Week)
    const dateNextWeek = new Date();
    dateNextWeek.setDate(dateNextWeek.getDate() + 7);
    dateNextWeek.setUTCHours(20, 0, 0, 0); // 8:00 PM

    const booking2 = await Booking.create({
      userId: jane._id,
      restaurantId: seededRestaurants[1]._id,
      bookingDate: dateNextWeek,
      bookingTime: "8:00 PM",
      guestCount: 4,
      tableNumber: 1, // Window table
      specialRequest: "",
      bookingStatus: "Confirmed",
      paymentStatus: "Pending"
    });

    // Past Booking: Lumiere
    const datePast = new Date();
    datePast.setDate(datePast.getDate() - 10);
    datePast.setUTCHours(19, 0, 0, 0); // 7:00 PM

    const booking3 = await Booking.create({
      userId: jane._id,
      restaurantId: seededRestaurants[2]._id,
      bookingDate: datePast,
      bookingTime: "7:00 PM",
      guestCount: 2,
      tableNumber: 2, // Booth
      specialRequest: "No shellfish allergy warning.",
      bookingStatus: "Confirmed",
      paymentStatus: "Paid"
    });

    // Append to Jane's notifications for pre-seeded bookings
    jane.notifications.unshift({
      title: "Reservation confirmed",
      body: `Aurum · Tonight at 7:30 PM. Table 4 (Chef's table).`,
      icon: "Calendar",
      unread: true
    });
    await jane.save();

    console.log("Mock Users, Bookings and Notifications seeded.");
    console.log("Database seeded successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error with seeding database: ${error.message}`);
    process.exit(1);
  }
};

importData();
