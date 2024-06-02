// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

const callerDir = path.resolve(".");

const testme = () => arrObjOrBoth("any");

// action
runPerf(testme, callerDir);
