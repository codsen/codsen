#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

const callerDir = path.resolve(".");

const testme = () => remSep("1,000,000,000,000,999,999.2");

// action
runPerf(testme, callerDir);
