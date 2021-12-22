#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { sortByCol } from "../dist/array-of-arrays-sort-by-col.esm.js";

const callerDir = path.resolve(".");

const testme = () => sortByCol([[1, 9, 0], [1], [1, 8, 2], [1, 7, 5]], 1);

// action
runPerf(testme, callerDir);
