import * as fs from "fs";
import * as path from "path";

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
  // Use process.cwd() to get the project's root directory
  const projectRoot = process.cwd();
  const logsDir = path.join(projectRoot, "logs"); // Create 'logs' in the user's project root
  const logFile = path.join(logsDir, "success.log");

  // Create the 'logs' directory if it doesn't exist
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  // Check if this is the first success log being recorded
  const isFirstLog = !fs.existsSync(logFile);

  // Prepare log entry with a clear structure and formatting
  const timestamp = new Date().toISOString();

  const logEntry = [
    isFirstLog ? `Thank you for using this application! \n` : "", // Add welcome message only on the first log
    `===========================================================`,
    `Timestamp   : ${timestamp}`,
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
