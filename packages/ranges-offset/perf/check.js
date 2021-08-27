#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { rOffset } from "../dist/ranges-offset.esm.js";

const testme = () =>
  rOffset(
    [
      [0, 1],
      [1, 2],
      [5, 9],
    ],
    100
  );

// action
runPerf(testme, callerDir);
