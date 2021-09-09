#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { flattenAllArrays } from "../dist/object-flatten-all-arrays.esm.js";

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
