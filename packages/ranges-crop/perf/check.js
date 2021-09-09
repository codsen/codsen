#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { rCrop } from "../dist/ranges-crop.esm.js";

const testme = () =>
  rCrop(
    [
      [1, 3],
      [5, 10],
      [12, 15],
      [16, 20],
    ],
    15
  );

// action
runPerf(testme, callerDir);
