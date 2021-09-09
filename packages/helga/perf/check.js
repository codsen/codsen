#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { helga } from "../dist/helga.esm.js";

const testme = () => helga("abc\ndef", { targetJSON: true });

// action
runPerf(testme, callerDir);
