import * as fs from "fs";
import * as path from "path";
import { errorMessages } from "../errorMessages";

// Function to format the timestamp in the desired timezone (GMT +5:30 in this case)
const formatTimestamp = (date: Date, timezoneOffset: number) => {
  // Convert UTC time to the desired timezone
  const localTime = new Date(date.getTime() + timezoneOffset * 60 * 1000);

  // Format the time to "DD-MM-YYYY HH:mm:ss" format
  const day = String(localTime.getDate()).padStart(2, "0");
  const month = String(localTime.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const year = localTime.getFullYear();
  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Function to log errors to 'logs/errors.log'
export const logErrorToFile = (message: string, details: any = null) => {
  const projectRoot = process.cwd();
  const logsDir = path.join(projectRoot, "logs");
  const logFile = path.join(logsDir, "errors.log");

  // Create the 'logs' directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Check if this is the first error being logged
  const isFirstLog = !fs.existsSync(logFile);

  // Format the stack trace for better readability
  const formatStackTrace = (stack: string | undefined) => {
    if (!stack) return "No stack trace available";
    return stack
      .split("\n")
      .map((line) => `    ${line}`)
      .join("\n");
  };

  // Set the timezone offset to GMT +5:30 (330 minutes)
  const timezoneOffset = 5.5 * 60; // Convert hours to minutes
  const timestamp = formatTimestamp(new Date(), timezoneOffset);

  // Prepare the log entry
  const statusCode = details?.statusCode || 500;
  const statusMessage = errorMessages[statusCode] || "Unknown Error";

  const logEntry = [
    isFirstLog
      ? `Thank you for installing biezor! Read documentation at: https://www.npmjs.com/package/biezor\nPlease consider donating to enhance this package. buymeacoffee.com/sivam_manoj\n`
      : "",
    `===========================================================`,
    `Timestamp   : ${timestamp}`, // Formatted timestamp
    `Message     : ${message}`,
    `-----------------------------------------------------------`,
    `Status Code : ${statusCode}`,
    `Status Message : ${statusMessage}`,
    `Details:`,
    details
      ? Object.entries(details)
          .map(([key, value]) => {
            if (key === "statusCode" || key === "stack") return "";
            return `  ${key}: ${
              typeof value === "object" ? JSON.stringify(value, null, 2) : value
            }`;
          })
          .filter(Boolean)
          .join("\n")
      : "No additional details available",
    `-----------------------------------------------------------`,
    `Stack Trace:`,
    details?.stack
      ? formatStackTrace(details.stack)
      : "No stack trace available",
    `===========================================================\n`,
  ].join("\n");

  // Append the log entry to the log file
  fs.appendFileSync(logFile, logEntry, "utf8");
};
