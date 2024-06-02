// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { conv } from "../dist/color-shorthand-hex-to-six-digit.esm.js";

const callerDir = path.resolve(".");

const testme = () => conv("aaaa #f0c zzzz\n\t\t\t#fc0");

// action
runPerf(testme, callerDir);
