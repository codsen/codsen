// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { combinations } from "../dist/object-boolean-combinations.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  combinations({
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 0,
    f: 1,
    g: 1,
  });

// action
runPerf(testme, callerDir);
