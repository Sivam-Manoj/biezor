import { Request, Response, NextFunction } from "express"; // Import Express types for type-checking
import { AsyncError } from "../error"; // Custom async error type (for standardized error handling)
import { errorMessages } from "../errorMessages"; // Import custom error message mappings
import { logErrorToFile } from "../logger/errorLogger"; // Import the error logger function for logging errors to a file

// Custom error handler middleware
const errorMiddleware = (
  err: any, // `err`: the error that was caught (could be any type)
  req: Request, // `req`: the request object (unused but part of the standard signature)
  res: Response, // `res`: the response object used to send the error response
  next: NextFunction // `next`: used to pass control to the next middleware (unused here)
) => {
  // Determine if the environment is development (used for detailed logging and responses)
  const isDevelopment = process.env.NODE_ENV === "development";

  // Set a default status code (500 for internal server error) and message
  let statusCode = err.statusCode || 500;
  let message =
    err.message || errorMessages[statusCode] || "Internal Server Error"; // Fallback to mapped error message or a generic one
  let details: any = null; // Details (e.g., error stack or debug info) are optionally added in development mode

  // If the error is an instance of a custom AsyncError, use its specific properties
  if (err instanceof AsyncError) {
    statusCode = err.statusCode; // Use the error's custom status code
    message = err.message || errorMessages[statusCode]; // Use the error's custom message or a mapped one
    details = isDevelopment ? err.details : undefined; // Include error details in development mode
  }
  // If the error object already has a statusCode property, use that
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || errorMessages[statusCode]; // Default to mapped error messages if none is provided
  }
  // For generic Error objects, extract the message
  else if (err instanceof Error) {
    message = err.message;
  }

  // Check if logging should occur
  const logEnabled = process.env.LOG !== "false"; // Log if LOG is not explicitly set to "false"

  // Log the error details to a file if logging is enabled
  if (logEnabled) {
    logErrorToFile(message, {
      statusCode, // Log the HTTP status code
      stack: err.stack, // Log the stack trace of the error
      details: err.details || undefined, // Include any additional error details (if available)
    });
  }

  // In development mode, log the error to the console for immediate visibility
  if (isDevelopment) {
    console.error(err);
  }

  // Structure the error response to send back to the client
  const response = {
    status: "error", // The status is always "error" for failed requests
    statusCode, // Send the HTTP status code (e.g., 500, 404, etc.)
    message, // Send the error message (could be custom or default)
    ...(isDevelopment && { stack: err.stack }), // Only include the stack trace in development mode
    ...(details && { details }), // Include additional error details if available
  };

  // Send the structured JSON response to the client with the appropriate status code
  res.status(statusCode).json(response);
};

export default errorMiddleware;
