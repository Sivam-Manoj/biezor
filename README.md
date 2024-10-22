# Biezor - Powerful Express Async Error Handler with Middleware And Error, Success, Performance Logger

**Biezor** is a lightweight middleware package designed for handling asynchronous errors in Express applications. With Biezor, you don’t need to write your own error-handling middleware; just import and configure it to manage async errors gracefully and provide consistent, structured error responses.

#### Please consider donating to enhance this package. [Buy Me a Coffee](https://www.buymeacoffee.com/sivam_manoj)

## Features

- **Plug-and-Play Integration**: Quickly integrate Biezor into your Express app without the need for custom middleware.
- **Automatic Error Handling**: Automatically catches and handles asynchronous errors in routes and middleware.
- **Automatic Logging of Errors**: Logs asynchronous errors in the `logs` folder with detailed information.
- **Logging of Successful Requests**: Automatically logs successful requests in the `logs/success.log` file, including request details for performance monitoring and auditing.
- **Client IP Address Logging**: Captures and logs the client's IP address for each request, enhancing traceability and debugging.
- **Customizable Error Responses**: Provide custom error messages along with status codes and optional additional details.
- **Detailed Error Stacks**: Displays detailed error stack traces in development mode for easier debugging.
- **Performance Monitoring**: Measures the duration of request handling, helping identify slow routes and performance bottlenecks.
- **TypeScript Support**: Fully compatible with TypeScript, enabling type safety and better tooling.
- **JavaScript Compatibility**: Works seamlessly in regular JavaScript applications.
- **Flexible Error Handling**: Supports both direct error throwing and try-catch scenarios for greater flexibility.
- **Lightweight**: Minimal overhead and easy to use, making it suitable for any Express application.
- **Modular Design**: Easily extendable for custom error handling and logging.

## Installation

You can install Biezor via npm:

````bash
npm install biezor

## Installation

You can install Biezor via npm or yarn:

```bash
npm install biezor
# or
yarn add biezor

````

#### set your .env file:

```env
NODE_ENV = "development" // use production when deployment(defualt production).
```

```env
LOG = false // if you dont want to create and log errors declare LOG as false(defaul true).
```

#### typescript example

```typescript
// server.ts
// Import necessary modules
import { configDotenv } from "dotenv"; // Module to load environment variables from a .env file
("dotenv/config.js"); // Ensure dotenv config is loaded correctly
import express, { Request, Response, NextFunction } from "express"; // Import the Express framework and types
import pkg, { AsyncError } from "biezor"; // Import the Biezor middleware package

// Load environment variables from .env file
configDotenv();

// Destructure the required components from the Biezor package
const { biezor, biezorMiddleware } = pkg;

// Create an instance of an Express application
const app = express();
// Define the port for the server to listen on
const PORT: number = parseInt(process.env.PORT || "3000"); // Use the PORT from environment variables or default to 3000

// Middleware to parse JSON requests
app.use(express.json()); // Allows the application to parse JSON payloads in incoming requests

/**
 * To avoid logging errors, simply use LOG = false in your .env file.
 */

// Example route that triggers an error using the AsyncError class
app.get(
  "/error",
  biezor(async (req: Request, res: Response, next: NextFunction) => {
    // Trigger an error with the AsyncError class
    next(
      new AsyncError("This is an error", 404, {
        detail: "Error when sending GET request", // This error will be logged in logs/errors.log
      })
    );
  })
);

// Example route demonstrating error handling with try-catch
app.get(
  "/try-catch-error",
  biezor(async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Simulate an error being thrown
      throw new AsyncError("This is a try-catch error example", 403, {
        reason: "Debugging error when using try-catch",
        solution: "Consider implementing better error handling",
      });
    } catch (error) {
      // Pass the error to the next middleware for handling
      next(error);
    }
  })
);

// Example working route for demonstration
app.get(
  "/",
  biezor(async (req: Request, res: Response) => {
    // This will be executed if no error is thrown, and logs successful requests in logs/success.log file

    // Send a response for successful requests
    res.send("Hello, World!");
  })
);

// Biezor error-handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // Pass the error to the Biezor middleware for structured error handling
  biezorMiddleware(err, res, req, next);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

#### javascript example

```javascript
// server.ts
// Import necessary modules
import { configDotenv } from "dotenv"; // Module to load environment variables from a .env file
("dotenv/config.js"); // Ensure dotenv config is loaded correctly
import express from "express"; // Import the Express framework
import pkg from "biezor"; // Import the Biezor middleware package

// Load environment variables from .env file
configDotenv();

// Destructure the required components from the Biezor package
const { biezor, biezorMiddleware, AsyncError } = pkg;

// Create an instance of an Express application
const app = express();
// Define the port for the server to listen on
const PORT = process.env.PORT || 3000; // Use the PORT from environment variables or default to 3000

// Middleware to parse JSON requests
app.use(express.json()); // Allows the application to parse JSON payloads in incoming requests

/**to avoid logging errors simply use LOG = false in your env file*/

// Example route that triggers an error using the AsyncError class
app.get(
  "/error",
  biezor(async (req, res, next) => {
    // Trigger an error with the AsyncError class
    next(
      new AsyncError("This is an error", 404, {
        detail: "Error when sending GET request", //this error logged in the logs/errors.log
      })
    );
  })
);

// Example route demonstrating error handling with try-catch
app.get(
  "/try-catch-error",
  biezor(async (req, res, next) => {
    try {
      // Simulate an error being thrown
      throw new AsyncError("This is a try-catch error example", 403, {
        reason: "Debugging error when using try-catch",
        solution: "Consider implementing better error handling",
      });
    } catch (error) {
      // Pass the error to the next middleware for handling
      next(error);
    }
  })
);

// Example working route for demonstration
app.get(
  "/",
  biezor(async (req, res) => {
    // it will  be executed if no error is thrown and logs successfull requests in logs/success.log file

    // Send a response for successful requests
    res.send("Hello, World!");
  })
);

// Biezor error-handling middleware
app.use((err, req, res, next) => {
  // Pass the error to the Biezor middleware for structured error handling
  biezorMiddleware(err, res, req, next);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
```

## Use Cases

- **API Development**: Effortlessly handle asynchronous errors in RESTful APIs. With Biezor, you ensure that clients receive structured error responses, making it easier for them to understand what went wrong.
- **Middleware Integration**: Quickly integrate Biezor into existing Express middleware to enhance error handling across your application without needing to write custom error handling code.

- **Debugging**: Utilize detailed error messages and stack traces provided during development to identify and resolve issues efficiently. Biezor's error handling makes it simple to track down problems in your async routes.

- **Third-Party Service Calls**: Handle errors gracefully when making calls to external APIs or services. Biezor helps manage errors in a consistent manner, ensuring users receive informative responses.

- **Complex Business Logic**: Simplify error handling in complex asynchronous workflows where multiple async operations might fail. Biezor helps streamline error management without cluttering your code.

## API

### `biezor(asyncRouteHandler)`

Wraps an asynchronous route handler to catch and handle errors.

- **Parameters**:

  - `asyncRouteHandler` (Function): The async function to wrap.

- **Returns**: A wrapped function that forwards any error to the next middleware.

### `biezorMiddleware(err, req, res, next)`

Middleware for handling thrown errors and sending structured error responses.

- **Parameters**:
  - `err` (Error): The error object.
  - `req` (Request): The request object.
  - `res` (Response): The response object.
  - `next` (NextFunction): The next middleware function.

### `AsyncError(message, statusCode, details)`

Custom error class that you can throw to generate an error with a specific status code and message.

- **Parameters**:
  - `message` (string): The error message.
  - `statusCode` (number): The HTTP status code (default is 500).
  - `details` (object): Optional additional details about the error.

## MIT License

```
Copyright (c) 2024 Sivam Manoj

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

1. The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

2. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

For any inquiries, you can contact me at:
```

**Email**: [manom8193@gmail.com](mailto:manom8193@gmail.com)
