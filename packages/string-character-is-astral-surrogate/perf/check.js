#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { isHighSurrogate } from "../dist/string-character-is-astral-surrogate.esm.js";

const testme = () => isHighSurrogate("\uD83E");

// action
runPerf(testme, callerDir);
