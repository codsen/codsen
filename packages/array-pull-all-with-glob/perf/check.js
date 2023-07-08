#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { pull } from "../dist/array-pull-all-with-glob.esm.js";

const callerDir = path.resolve(".");

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
    ["module-*", "something else", "element*"],
  );

// action
runPerf(testme, callerDir);
