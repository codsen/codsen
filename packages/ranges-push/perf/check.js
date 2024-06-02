// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { Ranges } from "../dist/ranges-push.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  let ranges = new Ranges();
  ranges.add(6, 10);
  ranges.add(16, 20, "bbb");
  ranges.add(11, 15, "aaa");
  ranges.add(10, 30);
  ranges.add(1, 5);
};

// action
runPerf(testme, callerDir);
