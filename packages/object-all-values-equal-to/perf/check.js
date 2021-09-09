#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { allEq } from "../dist/object-all-values-equal-to.esm.js";

const testme = () =>
  allEq(
    [
      {
        a: false,
      },
      {
        b: false,
      },
    ],
    false
  );

// action
runPerf(testme, callerDir);
