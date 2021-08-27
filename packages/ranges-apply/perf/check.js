#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { rApply } from "../dist/ranges-apply.esm.js";

const testme = () =>
  rApply("aaa delete me bbb and me too ccc", [
    [4, 14],
    [18, 29],
  ]);

// action
runPerf(testme, callerDir);
