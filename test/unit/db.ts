import { expect } from "chai";

import { db } from "../../src";

describe("The db module", function() {
    it("shall provide the ability to do a dry run", async() => {
        const sql = db.initializeDatabase(true);
        expect(sql).to.exist;
    });
});
