import { expect } from "chai";

describe("Sanity", function() {
    it("should be sane", () => {
        expect(true).is.true;
        expect(false).is.false;
    });
    it("should not be insane", () => {
        expect(true).is.not.false;
        expect(false).is.not.true;
    });
});
