#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { set } from "../dist/edit-package-json.esm.js";

const testme = () => set(`{ "a": "b", "c": { "d": ["e"] } }`, "c.d", 1);

// action
runPerf(testme, callerDir);
