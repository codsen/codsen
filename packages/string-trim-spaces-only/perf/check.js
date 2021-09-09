#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

const testme = () => trimSpaces("   \n  a a  \n   ");

// action
runPerf(testme, callerDir);
