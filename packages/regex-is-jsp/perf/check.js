#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { isJSP } from "../dist/regex-is-jsp.esm.js";

const testme = () => isJSP();

// action
runPerf(testme, callerDir);
