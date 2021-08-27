#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { sortByCol } from "../dist/array-of-arrays-sort-by-col.esm.js";

const testme = () => sortByCol([[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]], 1);

// action
runPerf(testme, callerDir);
