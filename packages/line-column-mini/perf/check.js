#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { lineCol } from "../dist/line-column-mini.esm.js";

const testme = () =>
  lineCol("zzz&amp;amp;rsquo;zzz\n“zzz”".repeat(20), 200, true);

// action
runPerf(testme, callerDir);
