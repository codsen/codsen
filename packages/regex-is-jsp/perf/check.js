#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isJSP } from "../dist/regex-is-jsp.esm.js";

const callerDir = path.resolve(".");

const testme = () => isJSP();

// action
runPerf(testme, callerDir);
