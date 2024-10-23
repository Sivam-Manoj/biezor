import * as fs from "fs";
import * as path from "path";

// Function to format the timestamp in a specified timezone (e.g., GMT +5:30)
const formatTimestamp = (date: Date, timezoneOffset: number) => {
  // Convert UTC time to the desired timezone
  const localTime = new Date(date.getTime() + timezoneOffset * 60 * 1000);

  // Format the time to "DD-MM-YYYY HH:mm:ss" format
  const day = String(localTime.getDate()).padStart(2, "0");
  const month = String(localTime.getMonth() + 1).padStart(2, "0");
  const year = localTime.getFullYear();
  const hours = String(localTime.getHours()).padStart(2, "0");
  const minutes = String(localTime.getMinutes()).padStart(2, "0");
  const seconds = String(localTime.getSeconds()).padStart(2, "0");

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
};

// Function to log successful requests to 'logs/success.log'
export const logSuccessToFile = ({
  requestId,
  method,
  url,
  statusCode,
  duration,
  clientIp,
}: {
  requestId: string;
  method: string;
  url: string;
  statusCode: number;
  duration: string;
  clientIp: string | undefined;
}) => {
  const projectRoot = process.cwd();
  const logsDir = path.join(projectRoot, "logs");
  const logFile = path.join(logsDir, "success.log");

  // Create the 'logs' directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Check if this is the first success log being recorded
  const isFirstLog = !fs.existsSync(logFile);

  // Set the timezone offset in minutes (for GMT +5:30, it's 330 minutes)
  const timezoneOffset = 330; // GMT +5:30

  // Format the timestamp using the specified timezone
  const timestamp = formatTimestamp(new Date(), timezoneOffset);

  // Prepare log entry with a clear structure and formatting
  const logEntry = [
    isFirstLog
      ? `Thank you for installing biezor! Read documentation at: https://www.npmjs.com/package/biezor\nPlease consider donating to enhance this package. buymeacoffee.com/sivam_manoj\n`
      : "", // Add welcome message only on the first log
    `===========================================================`,
    `Timestamp   : ${timestamp}`, // Use formatted timestamp
    `Request ID  : ${requestId}`,
    `Method      : ${method}`,
    `URL         : ${url}`,
    `Status Code : ${statusCode}`,
    `Duration    : ${duration} ms`,
    `Client IP   : ${clientIp || "Not available"}`,
    `-----------------------------------------------------------`,
    `===========================================================\n`,
  ].join("\n");

  // Append the formatted log entry to the log file
  fs.appendFileSync(logFile, logEntry, "utf8");
};
