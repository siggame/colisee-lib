import logger from "../../src/logger";

describe("The logger module", function() {
    it("shall be able to log", () => {
        logger.info("info");
        logger.warn("warn");
        logger.error("error");
        logger.debug("debug");
    });
});
