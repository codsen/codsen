// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rRegex } from "../dist/ranges-regex.esm.js";

const callerDir = path.resolve(".");

const testme = () => rRegex(/def/g, "abcdefghij_abcdefghij", "");

// action
runPerf(testme, callerDir);
