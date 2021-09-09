#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { setAllValuesTo } from "../dist/object-set-all-values-to.esm.js";

const testme = () =>
  setAllValuesTo([
    [
      {
        a: "a",
      },
      {
        b: "b",
      },
    ],
    {
      c: "c",
      d: [{ e: "e" }],
    },
  ]);

// action
runPerf(testme, callerDir);
