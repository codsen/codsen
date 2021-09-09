#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";
import { Linter } from "../dist/emlint.esm.js";

// 1. basic tests
const str = "< a>";
const linter = new Linter();
linter.setMaxListeners(Infinity);
const testme = () =>
  linter.verify(str, {
    rules: {
      "tag-space-after-opening-bracket": 2,
    },
  });

// action
runPerf(testme, callerDir);
