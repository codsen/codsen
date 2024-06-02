// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rProcessOutside } from "../dist/ranges-process-outside.esm.js";

const callerDir = path.resolve(".");

const gather = [];
const testme = () =>
  rProcessOutside("abcdefghij", [[1, 5]], (idx) => {
    gather.push(idx);
  });

// action
runPerf(testme, callerDir);
