import { Request, Response, NextFunction } from "express"; // Import Express types for type-checking
import { AsyncError } from "../error"; // Custom async error type (standardized error handling)
import { errorMessages } from "../errorMessages"; // Custom error messages for various HTTP status codes
import { logErrorToFile } from "../logger/errorLogger"; // Logging function to persist errors in log files

/**
 * Error handling middleware for Express applications.
 * Handles both synchronous and asynchronous errors, logs them, and provides appropriate responses.
 *
 * @param err - The error object caught by the Express framework.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function (used to pass control if necessary).
 */
const errorMiddleware = (
  err: any, // The error object can be of any type (e.g., instance of `Error`, custom error, etc.)
  req: Request, // The incoming request (not used but included as part of the standard Express signature)
  res: Response, // The response object for sending the structured error response
  next: NextFunction // Used for passing errors or control to the next middleware, if needed
) => {
  // Determine if the environment is "development" for verbose error output
  const isDevelopment = process.env.NODE_ENV === "development";

  // Default HTTP status code for errors (500: Internal Server Error) and generic error message
  let statusCode = err.statusCode || 500;
  let message =
    err.message || errorMessages[statusCode] || "Internal Server Error";
  let details: any = null; // Additional details (like stack trace) to include only in development

  // Check if the error is a custom AsyncError and use its properties for detailed error handling
  if (err instanceof AsyncError) {
    statusCode = err.statusCode; // Use specific status code from AsyncError
    message = err.message || errorMessages[statusCode]; // Use specific error message
    details = isDevelopment ? err.details : undefined; // Only expose additional details in development
  }
  // For errors with an explicitly defined statusCode (e.g., 404 or 400)
  else if (err.statusCode) {
    statusCode = err.statusCode;
    message = err.message || errorMessages[statusCode]; // Fallback to predefined error messages
  }
  // General errors (like JavaScript `Error` objects)
  else if (err instanceof Error) {
    message = err.message;
  }

  // Determine whether logging is enabled (based on environment variable LOG)
  const logEnabled = process.env.LOG !== "false"; // If LOG is not set to "false", logging is enabled

  // Log error details to a file if logging is enabled
  if (logEnabled) {
    logErrorToFile(message, {
      statusCode, // The HTTP status code associated with the error
      stack: err.stack, // Stack trace of the error (useful for debugging)
      details: err.details || undefined, // Additional details (if any)
    });
  }

  // In development mode, print the error details to the console for immediate debugging
  if (isDevelopment) {
    console.error(err); // Log the error object to the console
  }

  // Ensure that the response object (`res`) has a `status` method before trying to send the response
  if (typeof res.status === "function") {
    // Send a structured JSON response with the error information
    res.status(statusCode).json({
      status: "error", // Indicating the request resulted in an error
      statusCode, // HTTP status code (e.g., 500, 404, etc.)
      message, // Human-readable error message
      ...(isDevelopment && { stack: err.stack }), // Include stack trace in development mode only
      ...(details && { details }), // Include additional error details (only if available)
    });
  } else {
    next(err); // Pass the error along in case another middleware can handle it
  }
};

export default errorMiddleware;
