import { Request, Response, NextFunction } from "express";

// error.ts
export class AsyncError extends Error {
  statusCode: number;
  details?: any;

  constructor(message: string, statusCode = 500, details = {}) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}
