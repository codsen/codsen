// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { left, right } from "../dist/string-left-right.esm.js";

const callerDir = path.resolve(".");

const input = "xa \n\n\n     \n      \t\t\t\t      \n \n    \n b";
const rightmost = input.length - 1;

// Paired core lookup: both calls cross the same mixed-whitespace gap.
const testme = () => right(input, 1) + left(input, rightmost);

// action
runPerf(testme, callerDir);
