#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

const testme = () => fixEnt("&&NbSpzzz&&NbSpzzz\ny &isindot; z\n&nsp;\n&pound");

// action
runPerf(testme, callerDir);
