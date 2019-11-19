interface IFrequencyCounter {
    value: number;
    frequency: number;
}

// contains all the methods for interacting with the user
class FibberUI extends EventTarget  {
    fibber: Fibber;
    _intervalPanel: HTMLDivElement;
    _secondsInput: HTMLInputElement;
    _startTimerButton: HTMLButtonElement;
    _pauseTimerButton: HTMLButtonElement;
    _resumeTimerButton: HTMLButtonElement;

    _entryPanel: HTMLDivElement;
    _userPrompt: HTMLParagraphElement;
    _numberInput: HTMLInputElement;
    _enterButton: HTMLButtonElement;


    _displayPanel: HTMLDivElement;


    constructor() {
        super();

        this.initControls();


        this.addEventListener("timerset", () => {
            this.displayMessage("Timer set!");
            this._intervalPanel.classList.add("hidden");
            this._entryPanel.classList.remove("hidden");
            this._numberInput.focus();
        });

        this.addEventListener("timerpaused", () => {
            this.displayMessage("Timer paused!");
        });

        this.addEventListener("timerresumed", () => {
            this.displayMessage("Timer resumed!");
        });

        this.addEventListener("timerhit", () => {
            this.displayNumbers();
        });

        this.addEventListener("numberstored", () => {
            this._userPrompt.innerHTML = "Great, please enter your next number:";
            this._numberInput.value = undefined;
            this._numberInput.focus();
        });

        this.addEventListener("fibfound", ()=> {
            this.sayFib();
        });

    }

    initControls = () => {
        this._intervalPanel = document.querySelector("#interval");
        this._secondsInput = document.querySelector("#timer_seconds");
        this._startTimerButton = document.querySelector("#set_timer_button");
        this._startTimerButton.addEventListener("click", (evt: Event) => {
            if(this.fibber) {
                this.fibber.interval = parseInt(this._secondsInput.value, 10);
            }
        });
        this._pauseTimerButton = document.querySelector("#pause_timer");
        this._pauseTimerButton.addEventListener("click", (evt: Event) => {
            if(this.fibber) {
                this.fibber.pauseTimer();
            }
        });
        this._resumeTimerButton = document.querySelector("#resume_timer");
        this._resumeTimerButton.addEventListener("click", (evt: Event) => {
            if(this.fibber) {
                this.fibber.resumeTimer();
            }
        });

        this._displayPanel = document.querySelector("#display_screen");



        this._entryPanel = document.querySelector("#number_entry");
        this._userPrompt = document.querySelector("#user_prompt");
        this._numberInput = document.querySelector("#entered_number");
        this._enterButton = document.querySelector("#enter_number_button");
        this._enterButton.addEventListener("click", (evt: Event) => {
            console.log("enter button clicked");
            if(this.fibber) {
                this.fibber.checkNumber(parseInt(this._numberInput.value, 10));
            }
        });


        this._secondsInput.focus();
    }

    displayMessage = ( strMessage: string ) => {
        const divMsg: HTMLDivElement = document.createElement("div");
        divMsg.innerHTML = strMessage;
        document.body.appendChild(divMsg);
        divMsg.addEventListener("animationend", (evt: Event)=> {
            const targetDiv: HTMLDivElement = document.querySelector(".ui-message");
            if(targetDiv) {
                targetDiv.parentElement.removeChild(targetDiv);
            }
        });
        divMsg.classList.add("ui-message");
    }

    displayNumbers = () => {
        const numbers: Array<IFrequencyCounter> = this.fibber.enteredNumbers.slice();

        console.log(numbers);

        this._displayPanel.innerHTML = "";

        numbers.forEach( (storedNumber: IFrequencyCounter) => {
            const newSpan: HTMLElement = document.createElement("span");
            newSpan.innerHTML = storedNumber.value.toString(10);

            const newCount: HTMLElement = document.createElement("em");
            newCount.innerHTML = storedNumber.frequency.toString(10);

            newSpan.appendChild(newCount);

            this._displayPanel.appendChild(newSpan);
        });
    }

    sayFib = () => {
        const divFib: HTMLDivElement = document.createElement("div");
        divFib.innerHTML = "FIB";
        document.body.appendChild(divFib);
        divFib.addEventListener("animationend", (evt: Event)=> {
            const targetDiv: HTMLDivElement = document.querySelector(".fib");
            if(targetDiv) {
                targetDiv.parentElement.removeChild(targetDiv);
            }
        });
        divFib.classList.add("fib");
    }
}

// handles the logic of the application
export class Fibber {
    public test: string;

    // the number of seconds to wait before
    // refreshing the display list, default 15
    private _interval: number = 15;
    private _currSecs: number = 15;
    private _timerRunning: boolean = false;
    private _timer: number;
    private _entered: Array<IFrequencyCounter> = [];

    public ui: FibberUI;

    constructor(objUI?: FibberUI) {
        this.ui = objUI ? objUI : new FibberUI();
        this.ui.fibber = this;

        console.log("I am fibbr, hear me fib");
    }

    public get interval(): number {
        return this._interval;
    }

    public set interval(intSeconds: number) {
        // ensure a positive, whole number
        intSeconds = Math.abs(parseInt(intSeconds.toString(10), 10));
        if( !isNaN(intSeconds) ) {
            this._interval = intSeconds;
            this._currSecs = intSeconds;
            this.startTimer();
            this.ui.dispatchEvent(new CustomEvent("timerset"));
        }
    }

    startTimer = () => {
        this._timerRunning = true;
        this._timer = ((setInterval(this.tick, 1000) as unknown) as number);
    }

    pauseTimer = () => {
        this._timerRunning = false;
        this.ui.dispatchEvent(new CustomEvent("timerpaused"));
    }

    resumeTimer = ()=> {
        this._timerRunning = true;
        this.ui.dispatchEvent(new CustomEvent("timerresumed"));
    }

    tick = () => {
        if(this._timerRunning) {
            this._currSecs--;
            if(this._currSecs <= 0) {
                this.ui.dispatchEvent(new CustomEvent("timerhit"));
                this._currSecs = this._interval;
            }
        }
    }


    public get enteredNumbers(): Array<IFrequencyCounter> {
        const arrEntered: Array<IFrequencyCounter> = this._entered.slice();
        arrEntered.sort( (a, b) => {
            if( a.frequency > b.frequency ) {
                return -1;
            }
            if( a.frequency < b.frequency ) {
                return 1;
            }
            return 0;
        });
        return arrEntered;
    }

    public testMe = () => {
        console.log(this.test);
    }

    public checkNumber = (intTest: number) => {
        // make sure it's a positive integer
        intTest = Math.abs(parseInt(intTest.toString(10), 10));

        // if it is a positive integer
        if( !isNaN(intTest) ) {
            // ensure we stash it in our collection of entered numbers
            this.storeNumber(intTest);

            if( this.isInSequence(intTest) ) {
                this.ui.dispatchEvent(new CustomEvent("fibfound"));
            }
        }
    }

    storeNumber = (intEntered: number) => {
        const objRecord: IFrequencyCounter = this.getStoredNumber(intEntered);
        objRecord.frequency++;
        this.ui.dispatchEvent(new CustomEvent("numberstored"));
        console.log(this._entered);
    }

    getStoredNumber = (intEntered: number) => {
        let objRecord: IFrequencyCounter;

        this._entered.forEach( (storedNumber: IFrequencyCounter) => {
            if(storedNumber.value === intEntered) {
                objRecord = storedNumber;
            }
        });

        if(!objRecord) {
            const newRecord: IFrequencyCounter = { value: intEntered, frequency: 0 };
            this._entered.push(newRecord);
            return newRecord;
        } else {
            return objRecord;
        }
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

        if(intTest === 0 || intTest === 1) {
            // we already know these are fib numbers
            return true;
        }

        // a loop to to continue the sequence for the first thousand numbers
        for(let i: number = 0; i < 1000; ++i) {
            // the next number in the sequence is the sum of the previous two
            let newFib: number = intFibA + intFibB;
            console.log("Examining the next fib number: " + newFib.toString(10));

            // if the number is the one we are looking for
            if( newFib === intTest) {
                console.log(newFib.toString(10) + " is equal to " + intTest.toString(10));
                return true; // great success
            }

            // however, if the number is larger than the one we are looking for
            if( newFib > intTest) {
                console.log(newFib.toString(10) + " is greater than " + intTest.toString(10));
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