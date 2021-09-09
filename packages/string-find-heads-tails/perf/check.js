#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

const testme = () => strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%");

// action
runPerf(testme, callerDir);
