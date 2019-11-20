import { Fibber } from "../src/app/fibber";

const fibberApp: Fibber = new Fibber();

describe("Fibber", () => {

    beforeAll(function( done ) {
        done();
      });

    it("Should exist", () => {
        expect(fibberApp).toBeTruthy();
    });

    it("Should reflect a change to the interval", () => {
        fibberApp.interval = 10;
        expect(fibberApp.interval).toEqual(10);
    });

    it("Should not change the interval if invalid", () => {
        fibberApp.interval = -10;
        expect(fibberApp.interval).toEqual(10);
    });

});
