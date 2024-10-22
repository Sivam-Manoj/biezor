// express.d.ts
import { Request } from "express";

// Extend the Request interface to include a custom id property
declare global {
  namespace Express {
    interface Request {
      id?: string; // You can make this required by removing the `?` if desired
    }
  }
}
