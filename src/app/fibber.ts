import { FibberUI } from "./fibber-ui";

// the IFrequencyCounter interface is used to
// record the number of times a particular number
// was entered into the system
export interface IFrequencyCounter {
    value: number; // the number that was entered
    frequency: number; // the number of times it was entered
}

// the Fibber class is the engine room of the application
// it can either take a FibberUI object as an argument
// or, if omitted it will use the default FibberUI
export class Fibber {

    // the number of seconds to wait before
    // refreshing the display list, default 15
    private _interval: number = 15;

    // the number of seconds remaining until
    // a display update should occur
    private _currSecs: number = 15;

    // whether or not the timer is currently running
    private _timerRunning: boolean = false;

    // a handle to the interval-based timer
    private _timer: number;

    // an array of all the numbers that have been entered
    // along with the frequency of that number
    private _entered: Array<IFrequencyCounter> = [];

    // the UI attached to this Fibber
    public ui: FibberUI;

    // initialise the Fibber object, passing an optional
    // ui object
    constructor(objUI?: FibberUI) {
        // if a ui object was passed in, use it
        // otherwise create one
        this.ui = objUI ? objUI : new FibberUI();

        // set up bidirectional communication
        // we know about the ui, the ui doesn't yet
        // know about us
        this.ui.fibber = this;
    }

    // returns the current timer interval
    public get interval(): number {
        return this._interval;
    }

    // sets the timer interval to the supplied number
    // of seconds
    public set interval(intSeconds: number) {
        // ensure a positive, whole number
        intSeconds = Math.abs(parseInt(intSeconds.toString(10), 10));

        // if it is a valid number
        if( !isNaN(intSeconds) ) {
            // set the interval to the new value
            this._interval = intSeconds;

            // and also set the remaining seconds
            // to the same value
            this._currSecs = intSeconds;

            // set the timer to counting down
            this.startTimer();

            // and let the UI know that the timer has started
            this.ui.dispatchEvent(new CustomEvent("timerset"));
        }
    }

    // starts the countdown timer
    startTimer = () => {
        this._timerRunning = true;

        // uses a 1000ms (1 second) interval to run the 'tick' function
        this._timer = ((setInterval(this.tick, 1000) as unknown) as number);
    }

    // temporarily stops the timer from running
    pauseTimer = () => {
        this._timerRunning = false;
        this.ui.dispatchEvent(new CustomEvent("timerpaused"));
    }

    // restarts the timer after it has been paused
    resumeTimer = ()=> {
        this._timerRunning = true;
        this.ui.dispatchEvent(new CustomEvent("timerresumed"));
    }

    // run once every second when the timer is running
    tick = () => {
        if(this._timerRunning) {
            // reduce the number of remaining seconds by 1
            this._currSecs--;

            // if there are zero seconds remaining
            if(this._currSecs <= 0) {
                // let the ui know to display the list of entered
                // numbers
                this.ui.dispatchEvent(new CustomEvent("timerhit"));

                // then reset the timer with the specified interval
                this._currSecs = this._interval;
            }
        }
    }

    // returns the list of entered numbers, sorted in descending
    // order by frequency
    public get enteredNumbers(): Array<IFrequencyCounter> {
        // create a copy of the main array
        const arrEntered: Array<IFrequencyCounter> = this._entered.slice();

        // sort the array by frequency
        arrEntered.sort( (a, b) => {
            if( a.frequency > b.frequency ) {
                return -1;
            }
            if( a.frequency < b.frequency ) {
                return 1;
            }
            return 0;
        });

        // and then return the sorted array
        return arrEntered;
    }

    // ends the application. Stops the timer,
    // displays the list of entered numbers and
    // lets the UI know that the user has quit
    public quit = () => {
        this._timerRunning = false;
        clearInterval(this.interval);
        this.ui.dispatchEvent(new CustomEvent("fibbrquit"));
    }

    // stores the supplied number in the list
    // checks  to see if it is a fibonacci number,
    // and alerts the UI if it is
    public checkNumber = (intTest: number) => {
        // make sure it's a positive integer
        intTest = Math.abs(parseInt(intTest.toString(10), 10));

        // if it is a positive integer
        if( !isNaN(intTest) ) {
            // ensure we stash it in our collection of entered numbers
            this.storeNumber(intTest);

            // check if it is in the sequence
            if( this.isInSequence(intTest) ) {

                // if so, tell the UI about it
                this.ui.dispatchEvent(new CustomEvent("fibfound"));
            }
        }
    }

    // stores an entered number in the array
    storeNumber = (intEntered: number) => {
        // get the counter for this number
        const objRecord: IFrequencyCounter = this.getStoredNumber(intEntered);

        // and increase the frequency by 1
        objRecord.frequency++;

        // let the UI know that the number has been stored
        this.ui.dispatchEvent(new CustomEvent("numberstored"));
    }

    // given an integer, returns the matching record
    getStoredNumber = (intEntered: number) => {
        let objRecord: IFrequencyCounter;

        // if there is a matching record already, use it
        this._entered.forEach( (storedNumber: IFrequencyCounter) => {
            if(storedNumber.value === intEntered) {
                objRecord = storedNumber;
            }
        });

        // otherwise, create a new one and return that instead
        if(!objRecord) {
            const newRecord: IFrequencyCounter = { value: intEntered, frequency: 0 };
            this._entered.push(newRecord);
            return newRecord;
        } else {
            return objRecord;
        }
    }


     // tests a number to determine if it is a component of
     // the fibonacci sequence: 0,1,1,2,3,5,8... as featured
     // prominently in Dan Brown's bestselling novel "The Da Vinci Code"
    public isInSequence = (intTest: number) => {
        // the first two numbers in the sequence
        let intFibA: number = 0;
        let intFibB: number = 1;

        if(intTest === intFibA || intTest === intFibB) {
            // we already know these are fib numbers
            return true;
        }

        // a loop to to continue the sequence for the first thousand numbers
        for(let i: number = 0; i < 1000; ++i) {
            // the next number in the sequence is the sum of the previous two
            let newFib: number = intFibA + intFibB;

            // if the number is the one we are looking for
            if( newFib === intTest) {
                return true; // great success
            }

            // however, if the number is larger than the one we are looking for
            if( newFib > intTest) {
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