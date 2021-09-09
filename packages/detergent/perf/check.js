#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { det } from "../dist/detergent.esm.js";

const testme = () =>
  det(
    `<a style="display: block !important;">first\u0003second</a>z\n  \n\n   and more text here \xA3\xA3\xA3\xA3`
  ).res;

// action
runPerf(testme, callerDir);
