#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

const testme = () => emptyCondCommentRegex();

// action
runPerf(testme, callerDir);
