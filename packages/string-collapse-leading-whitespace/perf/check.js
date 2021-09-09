#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

const testme = () => collWhitespace("\n \n\n\n", 5);

// action
runPerf(testme, callerDir);
