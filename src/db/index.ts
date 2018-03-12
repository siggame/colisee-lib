/**
 * @module db
 */

import * as Knex from "knex";
import * as _ from "lodash";

import logger from "../logger";

const DB_HOST: string = _.defaultTo<string>(process.env.DB_HOST, "localhost");
const DB_PORT: string = _.defaultTo<string>(process.env.DB_PORT, "5432");
const DB_USER: string = _.defaultTo<string>(process.env.DB_USER, "postgres");
const DB_PASS: string = _.defaultTo<string>(process.env.DB_PASS, "postgres");
const DB_NAME: string = _.defaultTo<string>(process.env.DB_NAME, "postgres");

export const TEAMS_TABLE = "teams";
export const USERS_TABLE = "users";
export const TEAMS_USERS_TABLE = "teams_users";
export const SUBMISSIONS_TABLE = "submissions";
export const GAMES_TABLE = "games";
export const GAMES_SUBMISSIONS_TABLE = "games_submissions";

export const USER_ROLES = ["user", "admin"];
export type USER_ROLE = "user" | "admin";

export const SUBMISSION_STATUSES = ["queued", "building", "finished", "failed"];
export type SUBMISSION_STATUS_TYPE = "queued" | "building" | "finished" | "failed";

export const GAME_STATUSES = ["queued", "playing", "finished", "failed"];
export type GAME_STATUS_TYPE = "queued" | "playing" | "finished" | "failed";

/**
 * Main Knex connection. Make queries though this using the Knex API.
 */
export const connection = Knex({
    client: "pg",
    connection: {
        database: DB_NAME,
        host: DB_HOST,
        password: DB_PASS,
        port: DB_PORT,
        user: DB_USER,
    },
});

/**
 * Initializes the database with Colisee tables
 * @param dryRun - Doesn't actually execute SQL if true.
 * @param force - Allow function to initialize a production database
 */
export async function initializeDatabase(dryRun: boolean = true): Promise<string> {

    const conn: Knex = (() => {
        if (dryRun) {
            return Knex({ client: "pg" });
        } else {
            return connection;
        }
    })();

    // Create All Tables
    const tables: [string, (def: Knex.TableBuilder) => any][] = [
        [TEAMS_TABLE, table => {
            table.increments("id");
            table.string("name", 64)
                .notNullable()
                .unique();
            table.boolean("is_eligible")
                .notNullable();
            table.boolean("is_paid")
                .notNullable();
            table.boolean("is_closed")
                .notNullable();
            table.integer("team_captain_id")
                .unsigned()
                .notNullable()
                .references(`${USERS_TABLE}.id`)
                .comment("The id of the user who 'owns' the team");
            table.timestamps(true, true);
        }],

        [USERS_TABLE, table => {
            table.increments("id");
            table.string("name", 64)
                .notNullable()
                .unique();
            table.string("contact_email", 64)
                .notNullable()
                .unique();
            table.string("contact_name", 64)
                .notNullable();
            table.integer("hash_iterations")
                .defaultTo(0)
                .notNullable();
            table.string("password", 256)
                .notNullable();
            table.enu("role", USER_ROLES)
                .notNullable();
            table.string("salt", 256)
                .notNullable();
            table.json("form_response");
            table.string("bio", 1024);
            table.binary("profile_pic");
            table.boolean("active")
                .notNullable();

            table.timestamps(true, true);
        }],

        [TEAMS_USERS_TABLE, table => {
            table.increments("id");

            table.integer("user_id")
                .unsigned()
                .notNullable()
                .references(`${USERS_TABLE}.id`)
                .comment("The user that is on the team");

            table.integer("team_id")
                .unsigned()
                .notNullable()
                .references(`${TEAMS_TABLE}.id`)
                .comment("The team that the user is on");

            table.timestamps(true, true);
        }],

        [SUBMISSIONS_TABLE, table => {
            table.increments("id");
            table.integer("team_id")
                .unsigned()
                .references(`${TEAMS_TABLE}.id`);

            table.integer("version").notNullable();
            table.enu("status", SUBMISSION_STATUSES).notNullable();

            table.string("submission_url");
            table.string("log_url");
            table.string("image_name")
                .comment("The docker image of the submission contained on the Arena Docker Registry");

            table.timestamps(true, true);

            // Constraints
            table.unique(["team_id", "version"]);
        }],

        [GAMES_TABLE, table => {
            table.increments("id");
            table.enu("status", GAME_STATUSES)
                .notNullable();

            table.string("win_reason");
            table.string("lose_reason");
            table.integer("winner_id")
                .unsigned()
                .references(`${SUBMISSIONS_TABLE}.id`)
                .comment("The id of the winning submission");

            table.string("log_url")
                .comment("Link to the game log.");

            table.timestamps(true, true);
        }],

        [GAMES_SUBMISSIONS_TABLE, table => {
            table.increments("id");

            table.integer("submission_id")
                .unsigned()
                .notNullable()
                .references(`${SUBMISSIONS_TABLE}.id`)
                .comment("The submission that is a player in the linked game.");

            table.integer("game_id")
                .unsigned()
                .notNullable()
                .references(`${GAMES_TABLE}.id`)
                .comment("The game that is/was played by the linked player.");

            table.string("output_url")
                .comment("Link to the output generated by the linked submission.");

            table.timestamps(true, true);
        }],
    ];

    const sqlStrings = [];
    for (const [table, def] of tables) {
        const t = conn.schema.createTable(table, def);
        sqlStrings.push(t.toString());
        try {
            await t;
        } catch (e) {
            logger.warn(e);
        }
    }

    return `${sqlStrings.join(";\n")};\n`;
}

export interface Team {
    id: number;
    name: string;
    isEligible: boolean;
    isPaid: boolean;
    isClosed: boolean;
    teamCaptainId: number;

    createdAt: Date;
    updatedAt: Date;
}

export function rowsToTeams(rows: any[]): Team[] {
    return rows.map((row): Team => {
        return {
            createdAt: new Date(row.created_at),
            id: row.id,
            isClosed: row.is_closed,
            isEligible: row.is_eligible,
            isPaid: row.is_paid,
            name: row.name,
            teamCaptainId: row.team_captain_id,
            updatedAt: new Date(row.updated_at),
        };
    });
}

export interface User {
    id: number;
    name: string;
    contactEmail: string;
    contactName: string;
    hashIterations: number;
    password: string;
    role: USER_ROLE;
    salt: string;
    formResponse: {};
    active: boolean;
    bio: string;
    profilePic: string;

    createdAt: Date;
    updatedAt: Date;
}

export function rowsToUsers(rows: any[]): User[] {
    return rows.map((row): User => {
        return {
            active: row.active,
            bio: row.bio,
            contactEmail: row.contact_email,
            contactName: row.contact_name,
            createdAt: new Date(row.created_at),
            formResponse: row.form_response,
            hashIterations: row.hash_iterations,
            id: row.id,
            name: row.name,
            password: row.password,
            profilePic: row.profile_pic,
            role: row.role,
            salt: row.salt,
            updatedAt: new Date(row.updated_at),
        };
    });
}

export interface Submission {
    id: number;
    teamId: number;
    version: number;
    status: SUBMISSION_STATUS_TYPE;

    submissionUrl: string | null;
    logUrl: string | null;
    imageName: string | null;

    createdAt: Date;
    updatedAt: Date;
}

export function rowsToSubmissions(rows: any[]): Submission[] {
    return rows.map((row): Submission => {
        return {
            createdAt: new Date(row.created_at),
            id: row.id,
            imageName: row.image_name,
            logUrl: row.log_url,
            status: row.status,
            submissionUrl: row.submission_url,
            teamId: row.team_id,
            updatedAt: new Date(row.updated_at),
            version: row.version,
        };
    });
}

export interface Game {
    id: number;
    status: GAME_STATUS_TYPE;
    winReason: string | null;
    loseReason: string | null;
    winnerId: number | null;
    logUrl: string | null;

    createdAt: Date;
    updatedAt: Date;
}

export function rowsToGames(rows: any[]): Game[] {
    return rows.map((row): Game => {
        return {
            createdAt: new Date(row.created_at),
            id: row.id,
            logUrl: row.log_url,
            loseReason: row.lose_reason,
            status: row.status,
            updatedAt: new Date(row.updated_at),
            winReason: row.win_reason,
            winnerId: row.winner_id,
        };
    });
}

export interface GameSubmission {
    id: number;
    submissionId: number;
    gameId: number;
    outputUrl: string | null;

    createdAt: Date;
    updatedAt: Date;
}

export function rowsToGameSubmissions(rows: any[]): GameSubmission[] {
    return rows.map((row): GameSubmission => {
        return {
            createdAt: new Date(row.created_at),
            gameId: row.game_id,
            id: row.id,
            outputUrl: row.output_url,
            submissionId: row.submission_id,
            updatedAt: new Date(row.updated_at),
        };
    });
}
