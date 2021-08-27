#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { isProduction4a } from "../dist/charcode-is-valid-xml-name-character.esm.js";

const testme = () => isProduction4a("\uD800\uDC00");

// action
runPerf(testme, callerDir);
