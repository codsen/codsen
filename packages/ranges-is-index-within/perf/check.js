// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isIndexWithin } from "../dist/ranges-is-index-within.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  isIndexWithin(
    5,
    [
      [2, 4],
      [6, 8],
      [10, 15],
      [20, 30],
      [35, 40],
      [45, 50],
      [55, 60],
    ],
    {
      returnMatchedRangeInsteadOfTrue: true,
    },
  );

// action
runPerf(testme, callerDir);
