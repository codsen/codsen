#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { expander } from "../dist/string-range-expander.esm.js";

const testme = () =>
  expander({
    str: "aaaaaaaaaaaa",
    from: 2,
    to: 5,
    addSingleSpaceToPreventAccidentalConcatenation: true,
  });

// action
runPerf(testme, callerDir);
