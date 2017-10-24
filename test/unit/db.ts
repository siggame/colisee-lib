import * as chai from "chai";
import { expect } from "chai";

import { db } from "../../src";

describe("The db module", function () {
    it("shall provide the ability to do a dry run", async () => {
        const sql = db.initializeDatabase(true);
        expect(sql).to.exist;
    });

    describe("rowsToTeams", function () {
        it("should map 0 rows to 0 teams", async () => {
            expect(db.rowsToTeams([])).to.be.empty;
        });
        it("should map N rows to N teams", async () => {
            const rows = [
                {
                    contact_email: "test@example.com",
                    contact_name: "test",
                    created_at: Date.now().toString(),
                    hash_iterations: 0,
                    id: 4,
                    is_eligible: true,
                    name: "yoyo",
                    password: "password",
                    role: "admin",
                    salt: "somesalt",
                    updated_at: Date.now().toString(),
                },
            ];
            const teams: db.Team[] = [
                {
                    contactEmail: rows[0].contact_email,
                    contactName: rows[0].contact_name,
                    createdAt: new Date(rows[0].created_at),
                    hashIterations: rows[0].hash_iterations,
                    id: rows[0].id,
                    isEligible: rows[0].is_eligible,
                    name: rows[0].name,
                    password: rows[0].password,
                    role: rows[0].role as db.TEAM_ROLE,
                    salt: rows[0].salt,
                    updatedAt: new Date(rows[0].updated_at),
                },
            ];

            expect(db.rowsToTeams(rows)).to.deep.equals(teams);
        });
        it("should throw if missing element", async () => {
            try {
                await db.rowsToTeams([{ invalid: "error" }]);
                chai.assert("Expected error");
            } catch (e) {
                expect(e).is.not.instanceOf(chai.AssertionError);
            }
        });
    });

    describe("rowsToGames", function () {
        it("should map 0 rows to 0 games", async () => {
            expect(db.rowsToGames([])).to.be.empty;
        });
        it("should map N rows to N games", async () => {
            const rows = [
                {
                    created_at: Date.now().toString(),
                    id: 4,
                    log_url: null,
                    lose_reason: null,
                    status: db.GAME_STATUSES[0],
                    updated_at: Date.now().toString(),
                    win_reason: null,
                    winner_id: null,
                },
            ];
            const games: db.Game[] = [
                {
                    createdAt: new Date(rows[0].created_at),
                    id: rows[0].id,
                    logUrl: rows[0].log_url,
                    loseReason: rows[0].lose_reason,
                    status: rows[0].status as db.GAME_STATUS_TYPE,
                    updatedAt: new Date(rows[0].updated_at),
                    winReason: rows[0].win_reason,
                    winnerId: rows[0].winner_id,
                },
            ];

            expect(db.rowsToGames(rows)).to.deep.equals(games);
        });
        it("should throw if missing element", async () => {
            try {
                await db.rowsToGames([{ invalid: "error" }]);
                chai.assert("Expected error");
            } catch (e) {
                expect(e).is.not.instanceOf(chai.AssertionError);
            }
        });
    });

    describe("rowsToGameSubmissions", function () {
        it("should map 0 rows to 0 game submissions", async () => {
            expect(db.rowsToGameSubmissions([])).to.be.empty;
        });
        it("should map N rows to N game submissions", async () => {
            const rows = [
                {
                    created_at: Date.now().toString(),
                    game_id: 0,
                    id: 4,
                    output_url: null,
                    submission_id: 5,
                    updated_at: Date.now().toString(),
                },
            ];
            const games: db.GameSubmission[] = [
                {
                    createdAt: new Date(rows[0].created_at),
                    gameId: rows[0].game_id,
                    id: rows[0].id,
                    outputUrl: rows[0].output_url,
                    submissionId: rows[0].submission_id,
                    updatedAt: new Date(rows[0].updated_at),
                },
            ];

            expect(db.rowsToGameSubmissions(rows)).to.deep.equals(games);
        });
        it("should throw if missing element", async () => {
            try {
                await db.rowsToGameSubmissions([{ invalid: "error" }]);
                chai.assert("Expected error");
            } catch (e) {
                expect(e).is.not.instanceOf(chai.AssertionError);
            }
        });
    });

    describe("rowsToSubmissions", function () {
        it("should map 0 rows to 0 submissions", async () => {
            expect(db.rowsToSubmissions([])).to.be.empty;
        });
        it("should map N rows to N game", async () => {
            const rows = [
                {
                    created_at: Date.now().toString(),
                    id: 4,
                    image_name: null,
                    log_url: null,
                    status: db.SUBMISSION_STATUSES[0],
                    submission_url: null,
                    team_id: 5,
                    updated_at: Date.now().toString(),
                    version: 3,
                },
            ];
            const submissions: db.Submission[] = [
                {
                    createdAt: new Date(rows[0].created_at),
                    id: rows[0].id,
                    imageName: rows[0].image_name,
                    logUrl: rows[0].log_url,
                    status: rows[0].status as db.SUBMISSION_STATUS_TYPE,
                    submissionUrl: rows[0].submission_url,
                    teamId: rows[0].team_id,
                    updatedAt: new Date(rows[0].updated_at),
                    version: rows[0].version,
                },
            ];

            expect(db.rowsToSubmissions(rows)).to.deep.equals(submissions);
        });
        it("should throw if missing element", async () => {
            try {
                await db.rowsToSubmissions([{ invalid: "error" }]);
                chai.assert("Expected error");
            } catch (e) {
                expect(e).is.not.instanceOf(chai.AssertionError);
            }
        });
    });
});
