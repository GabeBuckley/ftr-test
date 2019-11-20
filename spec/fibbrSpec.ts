import { Fibber } from "../src/app/fibber";

describe("Fibber", () => {

    it("Should exist", () => {
        const fibberApp: Fibber = new Fibber();
        expect(fibberApp).toBeTruthy();
    });

    it("Should reflect a change to the interval", () => {
        const fibberApp: Fibber = new Fibber();
        fibberApp.interval = 10;
        expect(fibberApp.interval).toEqual(10);
    });

    it("Should not have a running timer", () => {
        const fibberApp: Fibber = new Fibber();
        expect(fibberApp.isTimerRunning).toBeFalsy();
    });

    it("Should have a running timer if we invoke the startTimer method", () => {
        const fibberApp: Fibber = new Fibber();
        fibberApp.startTimer();
        expect(fibberApp.isTimerRunning).toBeTruthy();
    });

    it("Should not have a running timer if we pause the timer", () => {
        const fibberApp: Fibber = new Fibber();
        fibberApp.startTimer();
        fibberApp.pauseTimer();
        expect(fibberApp.isTimerRunning).toBeFalsy();
    });

    it("Should have a running timer if we resume the timer", () => {
        const fibberApp: Fibber = new Fibber();
        fibberApp.startTimer();
        fibberApp.pauseTimer();
        fibberApp.resumeTimer();
        expect(fibberApp.isTimerRunning).toBeTruthy();
    });

    it("Should have a an empty number array to begin with", () => {
        const fibberApp: Fibber = new Fibber();
        expect(fibberApp.enteredNumbers.length).toEqual(0);
    });

    it("Should have a an element in the number array after checking a number", () => {
        const fibberApp: Fibber = new Fibber();
        fibberApp.checkNumber(5);
        expect(fibberApp.enteredNumbers.length).toEqual(1);
    });

    it("Should still only have one element in the number array after checking the same number five times", () => {
        const fibberApp: Fibber = new Fibber();
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(5);
        expect(fibberApp.enteredNumbers.length).toEqual(1);
    });

    it("Should should have a frequncy of 5 too", () => {
        const fibberApp: Fibber = new Fibber();
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(5);
        expect(fibberApp.enteredNumbers[0].frequency).toEqual(5);
    });

    it("Should should have a length of five if we enter different numbers", () => {
        const fibberApp: Fibber = new Fibber();
        fibberApp.checkNumber(5);
        fibberApp.checkNumber(4);
        fibberApp.checkNumber(3);
        fibberApp.checkNumber(2);
        fibberApp.checkNumber(1);
        expect(fibberApp.enteredNumbers.length).toEqual(5);
    });

    it("Should should return true if we give it a fib number", () => {
        const fibberApp: Fibber = new Fibber();
        expect(fibberApp.isInSequence(6765)).toBeTruthy();
    });

    it("Should should return false if we give it a non-fib number", () => {
        const fibberApp: Fibber = new Fibber();
        expect(fibberApp.isInSequence(5999)).toBeFalsy();
    });


});
