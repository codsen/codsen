#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { unicodeToNative } from "../dist/string-convert-indexes.esm.js";

const testme = () => unicodeToNative("\uD834\uDF06aa", [1, 0, 2]);

// action
runPerf(testme, callerDir);
