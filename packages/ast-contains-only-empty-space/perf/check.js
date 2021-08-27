#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

const testme = () =>
  empty([
    "   ",
    {
      key2: "   ",
      key3: "   \n   ",
      key4: "   \t   ",
    },
    "\n\n\n\n\n\n   \t   ",
  ]);

// action
runPerf(testme, callerDir);
