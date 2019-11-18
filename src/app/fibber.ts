interface FrequencyCounter {
    value: number;
    frequency: number;
}

export class Fibber {
    public test: string;

    // the number of seconds to wait before
    // refreshing the display list, default 15
    private _interval: number = 15;
    private _entered: Array<FrequencyCounter>;

    constructor() {
        this.test = "I am fibber, hear me fib";
    }

    // tslint:disable-next-line: typedef
    public get interval() {
        return this._interval;
    }

    public set interval(intSeconds: number){
        // ensure a positive, whole number
        intSeconds = Math.abs(parseInt(intSeconds.toString(10), 10));

        this._interval = intSeconds;
    }

    public testMe = () => {
        console.log(this.test);
    }


    /**
     * Tests a number to determine if it is a component of
     * the fibonacci sequence: 0,1,1,2,3,5,8... as featured
     * prominently in Dan Brown's bestselling novel "The Da Vinci Code"
     */
    public isInSequence = (intTest: number) => {
        // the first two numbers in the sequence
        let intFibA: number = 0;
        let intFibB: number = 1;

        // a loop to to continue the sequence for the first thousand numbers
        for(let i: number = 0; i < 1000; ++i){
            // the next number in the sequence is the sum of the previous two
            let newFib: number = intFibA + intFibB;

            // if the number is the one we are looking for
            if( newFib === intTest){
                return true; // great success
            }

            // however, if the number is larger than the one we are looking for
            if( newFib > intTest){
                return false; // sorry buddy, they ain't getting any smaller
            }

            // get ready to calculate the next value
            intFibA = intFibB;
            intFibB = newFib;
        }

        // if by some freakish chance we ever get here,
        // then the number we're looking for definitely is NOT
        // one of the first 1000 fibonacci numbers

        return false; // with extreme prejudice
    }
}