// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { split } from "../dist/string-bionic-split.esm.js";

const callerDir = path.resolve(".");

const testme = () => split("trichotillomania");

// action
runPerf(testme, callerDir);
