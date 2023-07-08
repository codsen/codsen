#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  fillMissing(
    {
      a: {
        x: "x",
      },
      z: "z",
    },
    {
      a: {
        b: {
          c: false,
          d: false,
        },
        x: false,
      },
      z: false,
    },
    {
      doNotFillThesePathsIfTheyContainPlaceholders: ["a.b"],
    },
  );

// action
runPerf(testme, callerDir);
