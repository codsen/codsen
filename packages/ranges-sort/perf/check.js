#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { rSort } from "../dist/ranges-sort.esm.js";

const testme = () =>
  rSort([
    [5, 6],
    [5, 3],
    [5, 0],
  ]);

// action
runPerf(testme, callerDir);
