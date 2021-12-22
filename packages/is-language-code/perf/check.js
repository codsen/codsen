#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isLangCode } from "../dist/is-language-code.esm.js";

const callerDir = path.resolve(".");

const testme = () => isLangCode("zzz<img           /    >zzz");

// action
runPerf(testme, callerDir);
