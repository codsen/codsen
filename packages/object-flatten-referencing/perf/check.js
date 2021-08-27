#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { flattenReferencing } from "../dist/object-flatten-referencing.esm.js";

const testme = () =>
  flattenReferencing(
    {
      key1: {
        key2: ["val1", "val2", "val3"],
      },
      key3: {
        key4: ["val4", "val5", "val6"],
      },
    },
    {
      key1: "Contact us",
      key3: {
        key4: ["val4", "val5", "val6"],
      },
    },
    {
      wrapHeadsWith: "%%_",
      wrapTailsWith: "_%%",
      xhtml: false,
    }
  );

// action
runPerf(testme, callerDir);
