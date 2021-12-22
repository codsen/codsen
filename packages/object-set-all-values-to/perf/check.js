#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { setAllValuesTo } from "../dist/object-set-all-values-to.esm.js";

const callerDir = path.resolve(".");

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
