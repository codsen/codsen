// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { truncate } from "../dist/string-truncator.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  truncate("Quasi-concoction of the marsupial-related remedies");

// action
runPerf(testme, callerDir);
