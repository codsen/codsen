// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isNumber } from "../dist/codsen-utils.esm.js";

const callerDir = path.resolve(".");

const testme = () => isNumber("The quick brown fox jumps over a lazy dog.");

// action
runPerf(testme, callerDir);
