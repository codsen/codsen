// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { globSync } from "../dist/codsen-glob.esm.js";

const callerDir = path.resolve(".");

const testme = () => globSync("src/**/*.ts", { cwd: callerDir });

// action
runPerf(testme, callerDir);
