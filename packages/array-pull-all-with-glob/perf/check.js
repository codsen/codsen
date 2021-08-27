#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { pull } from "../dist/array-pull-all-with-glob.esm.js";

const testme = () =>
  pull(
    [
      "Module-1",
      "only this left",
      "module-2",
      "module-3",
      "elements",
      "elemental",
    ],
    ["module-*", "something else", "element*"]
  );

// action
runPerf(testme, callerDir);
