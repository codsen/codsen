#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { right } from "../dist/string-left-right.esm.js";

const testme = () =>
  right("a \n\n\n     \n      \t\t\t\t      \n \n    \n b", 1);

// action
runPerf(testme, callerDir);
