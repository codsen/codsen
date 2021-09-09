#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { groupStr } from "../dist/array-group-str-omit-num-char.esm.js";

const testme = () => groupStr(["a1-1", "a2-2", "b3-3", "c4-4"]);

// action
runPerf(testme, callerDir);
