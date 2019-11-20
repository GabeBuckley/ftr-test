import { Fibber, IFrequencyCounter } from "./fibber";

// the FibberUI class handles user input and output
// for the application.
export class FibberUI extends EventTarget {
    // the Fibber object that we represent
    fibber: Fibber;

    // the area of the screen to display our input
    // for the number of seconds between display
    // updates
    _intervalPanel: HTMLDivElement;

    // the field into which the user will enter
    // the number of seconds for the interval
    _secondsInput: HTMLInputElement;

    // the button that the user will click
    // to start the timer
    _startTimerButton: HTMLButtonElement;

    // the button that the user will click
    // to pause the timer
    _pauseTimerButton: HTMLButtonElement;

    // the button that the user will click
    // to resume the timer
    _resumeTimerButton: HTMLButtonElement;

    // the area of the screen to display our input
    // for candidate numbers to be entered
    _entryPanel: HTMLDivElement;

    // a text display region we can use to prompt
    // the user for input
    _userPrompt: HTMLParagraphElement;

    // the field into which the user will
    // enter potential fibonacci numbers
    _numberInput: HTMLInputElement;

    // the button the user will click to
    // check the fibonacciness of the number
    _enterButton: HTMLButtonElement;

    // a region of the screen in which we will
    // render our application controls
    _controlPanel: HTMLDivElement;

    // a region of the screen onto which we
    // will paint updates of the entered numbers
    _displayPanel: HTMLDivElement;

    // the button the user will click to end
    // the application
    _quitButton: HTMLButtonElement;

    // the area of the screen shown to the user
    // after the application has ended
    _byePanel: HTMLDivElement;

    // initialises this instance of the UI
    constructor() {

        // invokes the constructor of the EventTarget
        // constructor
        super();

        // initialise our control layout
        this.initControls();

        // listen for the 'timerset' event issued by
        // the Fibber object
        this.addEventListener("timerset", () => {

            // acknowledge the setting of the timer
            this.displayMessage("Timer set!");

            // hide the interval panel
            if(this._intervalPanel) {
                this._intervalPanel.classList.add("hidden");
            }

            // show the entry panel
            if(this._entryPanel) {
                this._entryPanel.classList.remove("hidden");
            }

            // and put the cursor in the number input field
            if(this._numberInput) {
                this._numberInput.focus();
            }
        });

        // listen for the 'timerpaused' event issued by
        // the Fibber object
        this.addEventListener("timerpaused", () => {
            // acknowledge that the timer has been paused
            this.displayMessage("Timer paused!");
        });

        // listen for the 'timerresumed' event issued by
        // the Fibber object
        this.addEventListener("timerresumed", () => {
            // acknowledge that the timer has been resumed
            this.displayMessage("Timer resumed!");
        });

        // listen for the 'timerhit' event issued by
        // the Fibber object
        this.addEventListener("timerhit", () => {
            // the timer has counted down to zero
            // display the number list
            this.displayNumbers();
        });

        // listen for the 'numberstored' event issued by
        // the Fibber object
        this.addEventListener("numberstored", () => {
            // prompt the user for another number
            if(this._userPrompt) {
                this._userPrompt.innerHTML = "Great, please enter your next number:";
            }

            // clear the number input and place the cursor
            // back in the field
            if(this._numberInput) {
                this._numberInput.value = undefined;
                this._numberInput.focus();
            }
        });

        // listen for the 'fibfound' event issued by
        // the Fibber object
        this.addEventListener("fibfound", () => {
            // make the word 'FIB' appear on screen
            this.sayFib();
        });

        // listen for the 'fibbrquit' event issued by
        // the Fibber object
        this.addEventListener("fibbrquit", () => {
            // hide the entry panel
            if(this._entryPanel) {
                this._entryPanel.classList.add("hidden");
            }

            // hide the control panel
            if(this._controlPanel) {
                this._controlPanel.classList.add("hidden");
            }

            // show the goodbye panel
            if(this._byePanel) {
                this._byePanel.classList.remove("hidden");
            }
        });

    }

    // assigns actual HTML elements found in the DOM to the variables
    // defined above
    initControls = () => {
        this._intervalPanel = document.querySelector("#interval");
        this._secondsInput = document.querySelector("#timer_seconds");

        // tie the start-timer button into the Fibber's interval property
        this._startTimerButton = document.querySelector("#set_timer_button");
        if(this._startTimerButton) {
            this._startTimerButton.addEventListener("click", (evt: Event) => {
                if(this.fibber) {
                    this.fibber.interval = parseInt(this._secondsInput.value, 10);
                }
            });
        }

        // tie the pause-timer button into the Fibber's pauseTimer method
        this._pauseTimerButton = document.querySelector("#pause_timer");
        if(this._pauseTimerButton) {
            this._pauseTimerButton.addEventListener("click", (evt: Event) => {
                if(this.fibber) {
                    this.fibber.pauseTimer();
                }
            });
        }

        // tie the resume-timer button into the Fibber's resumeTimer method
        this._resumeTimerButton = document.querySelector("#resume_timer");
        if(this._resumeTimerButton) {
            this._resumeTimerButton.addEventListener("click", (evt: Event) => {
                if(this.fibber) {
                    this.fibber.resumeTimer();
                }
            });
        }

        this._displayPanel = document.querySelector("#display_screen");
        this._entryPanel = document.querySelector("#number_entry");
        this._userPrompt = document.querySelector("#user_prompt");
        this._numberInput = document.querySelector("#entered_number");

        // tie the enter-number button into the Fibber's checkNumber method
        this._enterButton = document.querySelector("#enter_number_button");
        if(this._enterButton) {
            this._enterButton.addEventListener("click", (evt: Event) => {
                if(this.fibber) {
                    this.fibber.checkNumber(parseInt(this._numberInput.value, 10));
                }
            });
        }

        this._controlPanel = document.querySelector("#controls");

        // tie the quit button into the Fibber's quit method.
        this._quitButton = document.querySelector("#quit_fibbr");
        if(this._quitButton) {
            this._quitButton.addEventListener("click", (evt: Event) => {
                if(this.fibber) {
                    this.fibber.quit();
                    this.displayNumbers();
                }
            });
        }

        this._byePanel = document.querySelector("#goodbye");

        // focus the cursor into the seconds input to begin
        if(this._secondsInput) {
            this._secondsInput.focus();
        }
    }

    // displays a brief message on the screen to alert the user
    // to the occurrence of some event
    // takes the message to be displayed (as a string) as an parameter
    displayMessage = ( strMessage: string ) => {
        // create an element to display the message on screen
        const divMsg: HTMLDivElement = document.createElement("div");

        // inject the supplied message as text inside the element
        divMsg.innerHTML = strMessage;

        // make the element a child of our document's body
        if(document.body) {
            document.body.appendChild(divMsg);
        }

        // these elements are animated, once the animation has finished
        // we should remove the extraneous message div
        divMsg.addEventListener("animationend", (evt: Event)=> {
            const targetDiv: HTMLDivElement = document.querySelector(".ui-message");
            if(targetDiv) {
                targetDiv.parentElement.removeChild(targetDiv);
            }
        });

        // adding the ui-message class invokes the animation
        divMsg.classList.add("ui-message");
    }

    // displays the list of entered numbers to the user
    displayNumbers = () => {
        // get a copy of the entered numbers from the Fibber
        const numbers: Array<IFrequencyCounter> = this.fibber.enteredNumbers.slice();

        if(this._displayPanel) {
            // clear anything currently in the display panel
            this._displayPanel.innerHTML = "";

            // for each number in our list
            numbers.forEach( (storedNumber: IFrequencyCounter) => {
                // create an element to show the value
                const newSpan: HTMLElement = document.createElement("span");
                newSpan.innerHTML = storedNumber.value.toString(10);

                // and another element to show the frequency
                const newCount: HTMLElement = document.createElement("em");
                newCount.innerHTML = storedNumber.frequency.toString(10);

                // add the frequency element to the number element
                newSpan.appendChild(newCount);

                // and place them in the display panel
                this._displayPanel.appendChild(newSpan);
            });
        }
    }

    // alerts the user to the fact that the number they entered
    // was indeed a fibonacci number
    sayFib = () => {
        // create an element to display the message on screen
        const divFib: HTMLDivElement = document.createElement("div");

        // set the text of the element to 'FIB'
        divFib.innerHTML = "FIB";

        // add the element to the DOM
        if(document.body) {
            document.body.appendChild(divFib);
        }

        // this too is animated. once we're done we should remove
        // the element
        divFib.addEventListener("animationend", (evt: Event)=> {
            const targetDiv: HTMLDivElement = document.querySelector(".fib");
            if(targetDiv) {
                targetDiv.parentElement.removeChild(targetDiv);
            }
        });

        // adding the class will invoke the animation
        divFib.classList.add("fib");
    }
}
