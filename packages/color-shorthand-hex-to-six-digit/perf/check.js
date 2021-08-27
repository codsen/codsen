#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { conv } from "../dist/color-shorthand-hex-to-six-digit.esm.js";

const testme = () => conv("aaaa #f0c zzzz\n\t\t\t#fc0");

// action
runPerf(testme, callerDir);
