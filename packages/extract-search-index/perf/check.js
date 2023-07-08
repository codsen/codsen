#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { extract } from "../dist/extract-search-index.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  extract(
    "The quick brown fox jumps over a lazy dog. Then it suddenly bites dog's tail and runs away. What a fox!",
  );

// action
runPerf(testme, callerDir);
