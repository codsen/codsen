#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

const callerDir = path.resolve(".");

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
    ],
  );

// action
runPerf(testme, callerDir);
