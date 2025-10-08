// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isPlainObject } from "../dist/codsen-utils.esm.js";

const callerDir = path.resolve(".");

const testme = () => isPlainObject({ a: 1 });

// action
runPerf(testme, callerDir);
