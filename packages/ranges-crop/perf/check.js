#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rCrop } from "../dist/ranges-crop.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  rCrop(
    [
      [1, 3],
      [5, 10],
      [12, 15],
      [16, 20],
    ],
    15,
  );

// action
runPerf(testme, callerDir);
