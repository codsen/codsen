#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

const testme = () =>
  includesWithGlob(
    ["something", "anything", "everything"],
    ["anything", "zzz"],
    {
      arrayVsArrayAllMustBeFound: "any",
    }
  );

// action
runPerf(testme, callerDir);
