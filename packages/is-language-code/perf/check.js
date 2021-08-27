#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { isLangCode } from "../dist/is-language-code.esm.js";

const testme = () => isLangCode("zzz<img           /    >zzz");

// action
runPerf(testme, callerDir);
