interface IFrequencyCounter {
    value: number;
    frequency: number;
}

// contains all the methods for interacting with the user
class FibberUI extends EventTarget  {
    constructor() {
        super();
        this.addEventListener("fibfound", ()=> {
            this.sayFib();
        });
    }

    sayFib(): void {
        const divFib: HTMLDivElement = document.createElement("div");
        divFib.innerHTML = "FIB";
        document.body.appendChild(divFib);
        divFib.addEventListener("animationend", (evt: Event)=>{
            const targetDiv: HTMLDivElement = document.querySelector(".fib");
            if(targetDiv){
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
    private _entered: Array<IFrequencyCounter>;

    public ui: FibberUI;

    constructor(objUI?: FibberUI) {
        this.ui = objUI ? objUI : new FibberUI();

        this.ui.dispatchEvent(new CustomEvent("fibfound"));

        console.log("I am fibbr, hear me fib");
    }

    public get interval(): number {
        return this._interval;
    }

    public set interval(intSeconds: number) {
        // ensure a positive, whole number
        intSeconds = Math.abs(parseInt(intSeconds.toString(10), 10));

        this._interval = intSeconds;
    }


    public get enteredNumbers(): Array<IFrequencyCounter> {
        const arrEntered: Array<IFrequencyCounter> = this._entered.slice();
        arrEntered.sort( (a, b) => {
            if( a.frequency > b.frequency ) {
                return 1;
            }
            if( a.frequency < b.frequency ) {
                return -1;
            }
            return 0;
        });
        return arrEntered;
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

    public sayFib(): void {
        this.ui.sayFib();
    }
}