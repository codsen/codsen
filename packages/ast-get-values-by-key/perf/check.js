#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

const testme = () =>
  getByKey(
    {
      tag: {
        a: "b",
      },
    },
    "tag",
    [
      {
        c: "d",
      },
    ]
  );

// action
runPerf(testme, callerDir);
