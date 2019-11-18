
import "./styles";
import { Fibber } from "./fibber";

const fibberApp: Fibber = new Fibber();

fibberApp.testMe();
console.log(fibberApp.isInSequence(7));
console.log(fibberApp.isInSequence(13));