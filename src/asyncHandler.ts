import asyncHandler from "express-async-handler"; // Import the express-async-handler for handling async route handlers
import { Request, Response, NextFunction } from "express"; // Import necessary types from Express
import { performance } from "perf_hooks"; // For measuring performance of request handling
import { logSuccessToFile } from "./logger/successLogger"; // Import the success logging function

/**
 * Enhanced async handler for Express.js.
 * This function wraps async route handlers to:
 * - Automatically measure performance
 * - Log successful requests to a file
 * - Handle errors and pass them to the next middleware
 *
 * @param fn - An async function that handles the request and response
 * @returns An Express middleware function that handles requests
 */
const enhancedAsyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Record the start time for performance measurement
    const start = performance.now();

    try {
      // Execute the provided async function (the actual route handler)
      await fn(req, res, next);
    } catch (error) {
      // If an error occurs, pass it to the next error-handling middleware
      next(error);
    } finally {
      // Only log requests that are successful (HTTP status codes 200-299)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Calculate the duration it took to handle the request
        const duration = performance.now() - start;

        // Retrieve the client's IP address from request headers or socket
        const clientIp =
          req.headers["x-forwarded-for"] || req.socket.remoteAddress;

        // Check if logging should occur
        const logEnabled = process.env.LOG !== "false"; // Log if LOG is not explicitly set to "false"
        // Log the successful request using the success logger

        if (logEnabled) {
          logSuccessToFile({
            requestId: req.id || "N/A", // Include the request ID for traceability (can be generated in middleware)
            method: req.method, // HTTP method (GET, POST, etc.)
            url: req.originalUrl, // The original URL of the request
            statusCode: res.statusCode, // The HTTP status code of the response
            duration: duration.toFixed(2), // Duration of the request handling in milliseconds, fixed to two decimal points
            clientIp: clientIp as string, // The client's IP address
          });
        }
      }
    }
  });

export default enhancedAsyncHandler;
