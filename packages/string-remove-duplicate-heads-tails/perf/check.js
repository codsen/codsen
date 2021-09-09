#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { remDup } from "../dist/string-remove-duplicate-heads-tails.esm.js";

const testme = () =>
  remDup("{{ Hi {{ first_name }}! }}", {
    heads: "   {{     ",
    tails: "    }}       ",
  });

// action
runPerf(testme, callerDir);
