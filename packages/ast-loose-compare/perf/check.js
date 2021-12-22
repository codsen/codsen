#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { looseCompare } from "../dist/ast-loose-compare.esm.js";

const callerDir = path.resolve(".");

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
