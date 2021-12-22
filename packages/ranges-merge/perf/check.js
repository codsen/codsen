#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rMerge } from "../dist/ranges-merge.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  rMerge(
    [
      [3, 8, "c"],
      [1, 4],
      [2, 5, "b"],
    ],
    { mergeType: 2 }
  );

// action
runPerf(testme, callerDir);
