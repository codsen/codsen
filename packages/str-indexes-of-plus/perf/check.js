// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

const callerDir = path.resolve(".");

const testme = () => strIndexesOfPlus("zabczabc", "abc", 1);

// action
runPerf(testme, callerDir);
