# ftr-test
FTR Platform Developer Coding Test Response

A compiled version of this application can be viewed at http://gabrielbuckley.com/fibbr/

## Getting started

This assumes you have node, npm and git already installed.

Firstly clone or download the solution from https://github.com/GabeBuckley/ftr-test

Then:

1 install it: `npm install` - this will install all of the tooling required to develop and test the application

2 test it: `npm run test` - this will invoke a Headless Chrome instance and run through a suite of tests to ensure the application is working as intended

3 build it: `npm run build` - this will transpile the TypeScript and SASS source code into JavaScript and CSS code that can be displayed in the browser and place the result in the ./dist folder

4 run it: `npm run serve` - this will fire up a web server and serve the bundled application via the browser. You wil be able to view the application at http://127.0.0.1:1123/

### Notes
At this time the application has only been tested using the Chrome web browser

## Part Two
Part 2: Changes to your application
1. _You have a new requirement to implement for your application: its logic should stay
exactly the same but it will need to have a different user interface (e.g. if you wrote a
web app, a different UI may be a REPL).
Please describe how you would go about implementing this new UI in your application?
Would you need to restructure your solution in any way?_
The solution has been designed to keep the logic very loosely coupled with the UI. The main Fibber class is passed (or generates) a UI object with which to communicate with the user. The UI is event driven, responding to application life-cycle events emitted by the Fibber object. As long as the UI object you pass to the Fibber class has a `.fibber` property and extends the `EventTarget` interface, the Fibber class doesn't need to know anything else about the UI that is presenting its logic to the user.

2. _You now need to make your application “production ready”, and deploy it so that it can
be used by customers.
Please describe the steps you’d need to take for this to happen._
The application is currently in a very basic form. The UI is not responsive, nor would it pass Accessibility testing.
I would refactor the SCSS to provide for a responsive layout that adapted to different screen sizes.
I would also add in various aria attributes to make the site more accessible to users who may be visually impaired

I would improve the testing of the application, set up puppeteer for some end-to-end tests. I would also need to test it in multiple browsers. Currently it has only been tested in Google's Chrome browser.

3. _What did you think about this coding test - is there anything you’d suggest in order to
improve it?_
Two things. I would modify the list of entered numbers such that it was obvious to the user which numbers in the list were Fibonacci numbers and which were not. And I wouldn't bother with any more than the first 100 numbers in the Fibonacci sequence. Even then, the 100th Fib number is 21 digits long. I don't think anyone is going to be entering numbers that large.



