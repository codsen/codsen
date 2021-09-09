#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { looseCompare } from "../dist/ast-loose-compare.esm.js";

const testme = () =>
  looseCompare(
    {
      a: "a",
      b: {
        c: "c",
      },
    },
    {
      a: "a",
      b: undefined,
    }
  );

// action
runPerf(testme, callerDir);
