#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { rMerge } from "../dist/ranges-merge.esm.js";

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
