#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isJinjaNunjucksRegex } from "../dist/regex-is-jinja-nunjucks.esm.js";

const callerDir = path.resolve(".");

const testme = () => isJinjaNunjucksRegex();

// action
runPerf(testme, callerDir);
