#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { getKeysetSync } from "../dist/json-comb-core.esm.js";

const callerDir = path.resolve(".");

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
