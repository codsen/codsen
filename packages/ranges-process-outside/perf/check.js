// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rProcessOutside } from "../dist/ranges-process-outside.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  const gathered = [];
  rProcessOutside("abcdefghij", [[1, 5]], (idx) => {
    gathered.push(idx);
  });
  return gathered;
};

// action
runPerf(testme, callerDir);
