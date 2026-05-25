import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import rateLimit from "express-rate-limit";

// Configuration files
import connectDB from "./config/db.js";
import { configureCloudinary } from "./config/cloudinary.js";

// Routes imports
import authRoutes from "./routes/authRoutes.js";
import restaurantRoutes from "./routes/restaurantRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

// Middlewares
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

// 1. Initialize environment variables
dotenv.config();

// Connect to Database
connectDB();

// Configure Cloudinary
configureCloudinary();

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Logging
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// 2. Updated Security & CORS
app.use(helmet({ crossOriginResourcePolicy: false }));

app.use(
  cors({
    // Add "http://localhost:8082" to this list
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:8082"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(uploadsDir));

// Rate Limiting
app.use("/api", rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
}));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/restaurants", restaurantRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/admin", adminRoutes);

// Base Check
app.get("/", (req, res) => {
  res.json({ message: "Maison API is running..." });
});

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5005;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});