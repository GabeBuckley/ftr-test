export class Fibber {
    public test: string;
    constructor() {
        this.test = "I am fibber";
    }

    public testMe = () => {
        console.log(this.test);
    }
}