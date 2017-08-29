"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require("winston");
/**
 * Customized winston logger instance
 */
exports.default = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({ filename: "app.log" })
    ]
});
