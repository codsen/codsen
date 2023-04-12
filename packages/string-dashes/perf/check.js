#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { convertAll } from "../dist/string-dashes.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  convertAll("Dashes come in two sizes - the en dash and the em dash.", {
    convertDashes: true,
    convertEntities: true,
  });

// action
runPerf(testme, callerDir);
