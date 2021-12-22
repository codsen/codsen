#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { det } from "../dist/detergent.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  det(
    `<a style="display: block !important;">first\u0003second</a>z\n  \n\n   and more text here \xA3\xA3\xA3\xA3`
  ).res;

// action
runPerf(testme, callerDir);
