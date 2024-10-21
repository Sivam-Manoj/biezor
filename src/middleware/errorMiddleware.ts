// errorMiddleware.ts
import { Request, Response, NextFunction } from "express";
import { AsyncError } from "../error";
import { errorMessages } from "../errorMessages"; // Import the error messages

// Custom error handler middleware
const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Determine if the environment is development
  const isDevelopment = process.env.NODE_ENV === "development";

  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message =
    err.message || errorMessages[statusCode] || "Internal Server Error"; // Use error message map
  let details: any = null;

  // If the error is an instance of AsyncError, use its properties
  if (err instanceof AsyncError) {
    statusCode = err.statusCode;
    message = err.message || errorMessages[statusCode]; // Default to mapped message if no custom message
    details = isDevelopment ? err.details : undefined; // Show details only in development
  } else if (err.statusCode) {
    // If the error has a statusCode property, use it
    statusCode = err.statusCode;
    message = err.message || errorMessages[statusCode]; // Use the mapped message if available
  } else if (err instanceof Error) {
    // If it's a generic Error object, extract message
    message = err.message;
  }

  // Log the error details only in development
  if (isDevelopment) {
    console.error(err);
  }

  // Structure the error response
  const response = {
    status: "error",
    statusCode,
    message,
    ...(isDevelopment && { stack: err.stack }), // Include stack trace in development mode
    ...(details && { details }), // Include error details if available
  };

  // Send the structured error response
  res.status(statusCode).json(response);
};

export default errorMiddleware;
