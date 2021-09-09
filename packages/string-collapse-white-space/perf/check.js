#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { collapse } from "../dist/string-collapse-white-space.esm.js";

const testme = () =>
  collapse(" a \n \n b ", {
    trimLines: false,
    trimnbsp: true,
    removeEmptyLines: false,
  });

// action
runPerf(testme, callerDir);
