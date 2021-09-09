#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { isJinjaSpecific } from "../dist/regex-jinja-specific.esm.js";

const testme = () => isJinjaSpecific();

// action
runPerf(testme, callerDir);
