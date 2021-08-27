#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { pathNext } from "../dist/ast-monkey-util.esm.js";

const testme = () => pathNext("9.children.3");

// action
runPerf(testme, callerDir);
