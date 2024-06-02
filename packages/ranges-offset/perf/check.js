// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rOffset } from "../dist/ranges-offset.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  rOffset(
    [
      [0, 1],
      [1, 2],
      [5, 9],
    ],
    100,
  );

// action
runPerf(testme, callerDir);
