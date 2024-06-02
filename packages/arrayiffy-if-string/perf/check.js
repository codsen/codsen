// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { arrayiffy } from "../dist/arrayiffy-if-string.esm.js";

const callerDir = path.resolve(".");

const testme = () => arrayiffy("aaa");

// action
runPerf(testme, callerDir);
