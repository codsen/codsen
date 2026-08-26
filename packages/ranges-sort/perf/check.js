// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { testme } from "./workload.js";

const callerDir = path.resolve(".");

// action
runPerf(testme, callerDir);
