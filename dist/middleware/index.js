"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = require("../logger");
/**
 * Middleware for logging requests
 * @param req
 * @param res
 * @param next
 */
function logging(req, res, next) {
    logger_1.default.info(`${req.method}\t${req.path}`);
    next();
}
exports.logging = logging;
