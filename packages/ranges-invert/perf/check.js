#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { rInvert } from "../dist/ranges-invert.esm.js";

const testme = () =>
  rInvert(
    [
      [0, 1],
      [1, 2],
      [5, 9],
    ],
    9
  );

// action
runPerf(testme, callerDir);
