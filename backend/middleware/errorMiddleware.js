// Express global error handler
export const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  // Handle Mongoose cast error (bad ObjectId)
  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 400;
    message = "Resource not found (invalid ID format)";
  }

  // Handle Mongoose duplicate key error (e.g. duplicate email)
  if (err.code === 11000) {
    statusCode = 400;
    message = `Duplicate field value entered: ${Object.keys(err.keyValue).join(", ")}. Please use another value.`;
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = Object.values(err.errors).map((val) => val.message).join(", ");
  }

  // Handle JsonWebToken errors
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token credentials. Please login again.";
  }

  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Your session token has expired. Please login again.";
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

// Handle route not found (404 API routes)
export const notFound = (req, res, next) => {
  const error = new Error(`Not Found - API Endpoint ${req.originalUrl} does not exist`);
  res.status(404);
  next(error);
};
