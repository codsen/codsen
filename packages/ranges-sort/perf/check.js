// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rSort } from "../dist/ranges-sort.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  rSort([
    [5, 6],
    [5, 3],
    [5, 0],
  ]);

// action
runPerf(testme, callerDir);
