#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { matchRightIncl } from "../dist/string-match-left-right.esm.js";

const testme = () => matchRightIncl("abcdef", 2, ["gjd", "cy", "cdz", "cde"]);

// action
runPerf(testme, callerDir);
