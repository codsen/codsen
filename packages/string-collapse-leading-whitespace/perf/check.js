#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

const callerDir = path.resolve(".");

const testme = () => collWhitespace("\n \n\n\n", 5);

// action
runPerf(testme, callerDir);
