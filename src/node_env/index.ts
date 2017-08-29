import { defaultTo } from "lodash";

/**
 * The node environment. Defaults to development if not provided
 */
export const NODE_ENV: string = defaultTo<string>(process.env.NODE_ENV, "development");

/**
 * Is the environment in development mode?
 */
export const IS_DEVELOPMENT: boolean = NODE_ENV === "development";

/**
 * Is the environment in production mode?
 */
export const IS_PRODUCTION: boolean = NODE_ENV === "production";