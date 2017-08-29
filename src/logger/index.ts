import * as winston from "winston";

/**
 * Customized winston logger instance
 */
export default new (winston.Logger)({
    transports: [
      new (winston.transports.Console)(),
      new (winston.transports.File)({ filename: "app.log" })
    ]
});