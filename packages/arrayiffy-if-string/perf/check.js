#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { arrayiffy } from "../dist/arrayiffy-if-string.esm.js";

const testme = () => arrayiffy("aaa");

// action
runPerf(testme, callerDir);
