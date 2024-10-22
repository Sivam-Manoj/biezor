import * as fs from "fs";
import * as path from "path";
import { errorMessages } from "../errorMessages"; // Import your error messages

// Function to log errors to 'logs/errors.log'
export const logErrorToFile = (message: string, details: any = null) => {
  // Use process.cwd() to get the project's root directory
  const projectRoot = process.cwd();
  const logsDir = path.join(projectRoot, "logs"); // Create 'logs' in the user's project root
  const logFile = path.join(logsDir, "errors.log");

  // Create the 'logs' directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Check if this is the first error being logged by checking if the log file exists
  const isFirstLog = !fs.existsSync(logFile);

  // Function to format the stack trace for better readability
  const formatStackTrace = (stack: string | undefined) => {
    if (!stack) return "No stack trace available";

    // Split stack trace into lines and indent each line
    return stack
      .split("\n")
      .map((line) => `    ${line}`) // Indent stack trace for better readability
      .join("\n");
  };

  // Prepare log entry with a clear structure and formatting
  const timestamp = new Date().toISOString();

  // Determine the status code and relevant error message
  const statusCode = details?.statusCode || 500; // Default to 500 if no status code is provided
  const statusMessage = errorMessages[statusCode] || "Unknown Error"; // Get the relevant error message

  const logEntry = [
    isFirstLog
      ? `Thank you for installing biezor! Read documentation at: https://www.npmjs.com/package/biezor\nPlease consider donating to enhance this package.\n`
      : "", // Add welcome message only on the first log
    `===========================================================`,
    `Timestamp   : ${timestamp}`,
    `Message     : ${message}`,
    `-----------------------------------------------------------`,
    `Status Code : ${statusCode}`, // Include status code
    `Status Message : ${statusMessage}`, // Include relevant status message
    `Details:`,
    details
      ? Object.entries(details)
          .map(([key, value]) => {
            // Avoid logging status code and stack again if included in details
            if (key === "statusCode" || key === "stack") return ""; // Skip these keys to avoid repetition
            return `  ${key}: ${
              typeof value === "object" ? JSON.stringify(value, null, 2) : value
            }`;
          })
          .filter(Boolean) // Remove empty strings
          .join("\n") // Join formatted details into a single string
      : "No additional details available",
    `-----------------------------------------------------------`,
    `Stack Trace:`,
    details?.stack
      ? formatStackTrace(details.stack)
      : "No stack trace available", // Format the stack trace if available
    `===========================================================\n`,
  ].join("\n");

  // Append the formatted log entry to the log file
  fs.appendFileSync(logFile, logEntry, "utf8");
};
