#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { rProcessOutside } from "../dist/ranges-process-outside.esm.js";

const gather = [];
const testme = () =>
  rProcessOutside("abcdefghij", [[1, 5]], (idx) => {
    gather.push(idx);
  });

// action
runPerf(testme, callerDir);
