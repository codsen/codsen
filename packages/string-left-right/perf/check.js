// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { right } from "../dist/string-left-right.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  right("a \n\n\n     \n      \t\t\t\t      \n \n    \n b", 1);

// action
runPerf(testme, callerDir);
