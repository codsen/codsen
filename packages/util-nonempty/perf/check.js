#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { nonEmpty } from "../dist/util-nonempty.esm.js";

const testme = () => nonEmpty([[[[[[[[[[[[[[[[[[[[]]]]]]]]]]]]]]]]]]]]);

// action
runPerf(testme, callerDir);
