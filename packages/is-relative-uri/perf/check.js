#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { isRel } from "../dist/is-relative-uri.esm.js";

const testme = () => isRel("//example.com/path///resource.txt");

// action
runPerf(testme, callerDir);
