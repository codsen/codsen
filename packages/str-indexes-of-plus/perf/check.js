#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { strIndexesOfPlus } from "../dist/str-indexes-of-plus.esm.js";

const testme = () => strIndexesOfPlus("zabczabc", "abc", 1);

// action
runPerf(testme, callerDir);
