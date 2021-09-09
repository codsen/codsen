#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { rRegex } from "../dist/ranges-regex.esm.js";

const testme = () => rRegex(/def/g, "abcdefghij_abcdefghij", "");

// action
runPerf(testme, callerDir);
