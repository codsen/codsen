#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { perfRef } from "../dist/perf-ref.esm.js";

const testme = () => perfRef();

// action
runPerf(testme, callerDir);
