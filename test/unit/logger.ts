import logger from "../../src/logger";

export default function () {

    describe("Logger", function () {
        it("shall be able to log", () => {
            logger.info("info");
            logger.warn("warn");
            logger.error("error");
            logger.debug("debug");
        });
    });

}
