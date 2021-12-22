#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { lineCol } from "../dist/line-column-mini.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  lineCol("zzz&amp;amp;rsquo;zzz\n“zzz”".repeat(20), 200, true);

// action
runPerf(testme, callerDir);
