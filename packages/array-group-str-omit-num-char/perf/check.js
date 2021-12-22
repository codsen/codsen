#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { groupStr } from "../dist/array-group-str-omit-num-char.esm.js";

const callerDir = path.resolve(".");

const testme = () => groupStr(["a1-1", "a2-2", "b3-3", "c4-4"]);

// action
runPerf(testme, callerDir);
