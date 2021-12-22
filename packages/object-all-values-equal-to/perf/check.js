#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { allEq } from "../dist/object-all-values-equal-to.esm.js";

const callerDir = path.resolve(".");

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
