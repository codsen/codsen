#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

const testme = () => remSep("1,000,000,000,000,999,999.2");

// action
runPerf(testme, callerDir);
