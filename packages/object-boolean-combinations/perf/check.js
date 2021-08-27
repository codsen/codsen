#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { combinations } from "../dist/object-boolean-combinations.esm.js";

const testme = () =>
  combinations({
    a: 1,
    b: 1,
    c: 1,
    d: 1,
    e: 0,
    f: 1,
    g: 1,
  });

// action
runPerf(testme, callerDir);
