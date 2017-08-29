"use strict";
/**
 * @module db
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Knex = require("knex");
const _ = require("lodash");
const node_env_1 = require("../node_env");
const DB_HOST = _.defaultTo(process.env.DB_HOST, "localhost");
const DB_PORT = _.defaultTo(process.env.DB_PORT, "5432");
const DB_USER = _.defaultTo(process.env.DB_USER, "postgres");
const DB_PASS = _.defaultTo(process.env.DB_PASS, "postgres");
const DB_NAME = _.defaultTo(process.env.DB_NAME, "postgres");
exports.TEAMS_TABLE = "teams";
exports.SUBMISSIONS_TABLE = "submissions";
exports.GAMES_TABLE = "games";
exports.GAME_SUBMISSIONS_TABLE = "games_submission";
exports.TEAM_SUBMISSIONS_STATUSES = ["queued", "building", "finished", "failed"];
exports.GAME_STATUSES = ["queued", "playing", "finished"];
/**
 * Main Knex connection. Make queries though this using the Knex API.
 */
exports.connection = (node_env_1.IS_DEVELOPMENT ? buildDevelopmentConnection() : buildProductionConnection());
function buildDevelopmentConnection() {
    return Knex({
        client: "sqlite3",
        connection: {
            filename: "./db.sqlite",
        }
    });
}
function buildProductionConnection() {
    return Knex({
        client: "postgresql",
        connection: {
            host: DB_HOST,
            port: DB_PORT,
            user: DB_USER,
            password: DB_PASS,
            database: DB_NAME
        }
    });
}
/**
 * Initializes the database with Colisee tables
 * @param force - Allow function to initialize a production database
 */
function initializeDatabase(force = false) {
    return __awaiter(this, void 0, void 0, function* () {
        if (node_env_1.IS_PRODUCTION)
            throw new Error("Cannot initialize database on production unless force=true.");
        // Drop All Tables
        const dropAll = [
            exports.TEAMS_TABLE,
            exports.SUBMISSIONS_TABLE,
            exports.GAMES_TABLE,
            exports.GAME_SUBMISSIONS_TABLE
        ].map(table => exports.connection.schema.dropTableIfExists(table));
        yield Promise.all(dropAll);
        // Create All Tables
        yield exports.connection.schema.createTable(exports.TEAMS_TABLE, table => {
            table.increments("id");
            table.string("name", 64)
                .notNullable()
                .unique();
            table.string("contact_email", 64)
                .notNullable()
                .unique();
            table.string("password", 256)
                .notNullable();
            table.boolean("is_eligible")
                .notNullable();
            table.timestamps(true, true);
        });
        yield exports.connection.schema.createTable(exports.SUBMISSIONS_TABLE, table => {
            table.increments("id");
            table.integer("team_id")
                .unsigned()
                .references(`${exports.TEAMS_TABLE}.id`);
            table.integer("version").notNullable();
            table.enu("status", exports.TEAM_SUBMISSIONS_STATUSES).notNullable();
            table.string("submission_url");
            table.string("log_url");
            table.string("image_name")
                .comment("The docker image of the submission contained on the Arena Docker Registry");
            table.timestamps(true, true);
            // Constraints
            table.unique(["team_id", "version"]);
        });
        yield exports.connection.schema.createTable(exports.GAMES_TABLE, table => {
            table.increments("id");
            table.enu("status", exports.GAME_STATUSES);
            table.string("win_reason");
            table.string("lose_reason");
            table.integer("winner_id")
                .unsigned()
                .references(`${exports.SUBMISSIONS_TABLE}.id`)
                .comment("The id of the winning submission");
            table.string("log_url")
                .comment("Link to the game log.");
            table.timestamps(true, true);
        });
        yield exports.connection.schema.createTable(exports.GAME_SUBMISSIONS_TABLE, table => {
            table.increments("id");
            table.integer("submission_id")
                .unsigned()
                .notNullable()
                .references(`${exports.SUBMISSIONS_TABLE}.id`)
                .comment("The submission that is a player in the linked game.");
            table.integer("game_id")
                .unsigned()
                .notNullable()
                .references(`${exports.GAMES_TABLE}.id`)
                .comment("The game that is/was played by the linked player.");
            table.string("output_url")
                .comment("Link to the output generated by the linked submission.");
            table.timestamps(true, true);
        });
    });
}
exports.initializeDatabase = initializeDatabase;
