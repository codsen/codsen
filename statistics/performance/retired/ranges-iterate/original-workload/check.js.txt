import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rIterate } from "../dist/ranges-iterate.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  const gathered = [];
  rIterate("abcdefghij", [[0, 7, "xyz"]], ({ i, val }) => {
    gathered.push([i, val]);
  });
  return gathered;
};

// action
runPerf(testme, callerDir);
