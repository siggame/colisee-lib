import db from "./db";
import logger from "./logger";
import sanity from "./sanity";

export default () => {

    describe("Unit Tests |", () => {
        db();
        logger();
        sanity();
    });

};
