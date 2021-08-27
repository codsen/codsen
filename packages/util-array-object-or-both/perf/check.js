#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { arrObjOrBoth } from "../dist/util-array-object-or-both.esm.js";

const testme = () => arrObjOrBoth("any");

// action
runPerf(testme, callerDir);
