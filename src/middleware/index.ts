import { NextFunction, Request, Response } from "express";

import logger from "../logger";

/**
 * Middleware for logging requests
 * @param req
 * @param res 
 * @param next 
 */
export function logging(req: Request, res: Response, next: NextFunction) {
    logger.info(`${req.method}\t${req.path}`);
    next();
}
