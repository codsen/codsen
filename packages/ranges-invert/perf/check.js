// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rInvert } from "../dist/ranges-invert.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  rInvert(
    [
      [0, 1],
      [1, 2],
      [5, 9],
    ],
    9,
  );

// action
runPerf(testme, callerDir);
