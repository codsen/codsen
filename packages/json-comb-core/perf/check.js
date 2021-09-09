#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { getKeysetSync } from "../dist/json-comb-core.esm.js";

const testme = () =>
  getKeysetSync([
    {
      a: false,
      b: {
        c: {
          d: [{ a: "aaa" }],
        },
      },
    },
    {
      b: {
        c: {
          d: [{ b: "bbb", c: "ccc" }],
        },
      },
    },
    {
      b: {
        c: {
          d: false,
        },
      },
    },
    {
      b: {
        c: false,
      },
    },
  ]);

// action
runPerf(testme, callerDir);
