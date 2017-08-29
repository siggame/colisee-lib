"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
/**
 * The node environment. Defaults to development if not provided
 */
exports.NODE_ENV = lodash_1.defaultTo(process.env.NODE_ENV, "development");
/**
 * Is the environment in development mode?
 */
exports.IS_DEVELOPMENT = exports.NODE_ENV === "development";
/**
 * Is the environment in production mode?
 */
exports.IS_PRODUCTION = exports.NODE_ENV === "production";
