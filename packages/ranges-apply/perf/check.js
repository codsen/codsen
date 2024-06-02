// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rApply } from "../dist/ranges-apply.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  rApply("aaa delete me bbb and me too ccc", [
    [4, 14],
    [18, 29],
  ]);

// action
runPerf(testme, callerDir);
