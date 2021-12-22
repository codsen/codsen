#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { expander } from "../dist/string-range-expander.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  expander({
    str: "aaaaaaaaaaaa",
    from: 2,
    to: 5,
    addSingleSpaceToPreventAccidentalConcatenation: true,
  });

// action
runPerf(testme, callerDir);
