#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { flattenAllArrays } from "../dist/object-flatten-all-arrays.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  flattenAllArrays({
    d: "d",
    b: "b",
    a: "a",
    c: [
      {
        b: "b",
        a: "a",
      },
      {
        d: "d",
        c: "c",
      },
    ],
  });

// action
runPerf(testme, callerDir);
