/// <reference types="express" />
import { Request, Response, NextFunction } from "express";
/**
 * Middleware for logging requests
 * @param req
 * @param res
 * @param next
 */
export declare function logging(req: Request, res: Response, next: NextFunction): void;
