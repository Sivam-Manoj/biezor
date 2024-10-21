// asyncHandler.ts
import asyncHandler from "express-async-handler"; // Import the express-async-handler
import { Request, Response, NextFunction } from "express";
import { AsyncError } from "./error"; // Ensure this path is correct

// Create an enhanced asyncHandler
const enhancedAsyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) =>
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return await fn(req, res, next);
  });

export default enhancedAsyncHandler;
