#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { splitByW } from "../dist/string-split-by-whitespace.esm.js";

const testme = () =>
  splitByW("some interesting {{text}} {% and %} {{ some more }} text.", {
    ignoreRanges: [
      [17, 25],
      [26, 35],
      [36, 51],
    ],
  });

// action
runPerf(testme, callerDir);
