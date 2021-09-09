#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { fillMissing } from "../dist/object-fill-missing-keys.esm.js";

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
    }
  );

// action
runPerf(testme, callerDir);
