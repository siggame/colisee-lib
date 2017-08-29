/// <reference types="knex" />
/**
 * @module db
 */
import * as Knex from "knex";
export declare const TEAMS_TABLE = "teams";
export declare const SUBMISSIONS_TABLE = "submissions";
export declare const GAMES_TABLE = "games";
export declare const GAME_SUBMISSIONS_TABLE = "games_submission";
export declare const TEAM_SUBMISSIONS_STATUSES: string[];
export declare const GAME_STATUSES: string[];
/**
 * Main Knex connection. Make queries though this using the Knex API.
 */
export declare const connection: Knex;
/**
 * Initializes the database with Colisee tables
 * @param force - Allow function to initialize a production database
 */
export declare function initializeDatabase(force?: boolean): Promise<void>;
