#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { isJinjaNunjucksRegex } from "../dist/regex-is-jinja-nunjucks.esm.js";

const testme = () => isJinjaNunjucksRegex();

// action
runPerf(testme, callerDir);
