import {Fraction, matrix} from "./build/math.js";
import {BalanceMolecularEqn} from "./build/chemBalance.js";

// Zn + NO3^- + H^+ = Zn^2 + N  [4, 1, 10, 4, 1, 3]
// Pb + PbO2 + H^+ + SO4^2- = PbSO4 + H2O
// AB2 + AC3 + AD5 + AE7 + AF11 + AG13 + AH17 + AI19 + AJ23 = A + ABCDEFGHIJ

let s = "AB2 + AC3 + AD5 + AE7 + AF11 + AG13 + AH17 + AI19 + AJ23 = A + ABCDEFGHIJ";
let a = BalanceMolecularEqn(s);
console.log(a);