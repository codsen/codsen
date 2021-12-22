#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { matchRightIncl } from "../dist/string-match-left-right.esm.js";

const callerDir = path.resolve(".");

const testme = () => matchRightIncl("abcdef", 2, ["gjd", "cy", "cdz", "cde"]);

// action
runPerf(testme, callerDir);
