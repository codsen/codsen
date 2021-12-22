#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { remDup } from "../dist/string-remove-duplicate-heads-tails.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  remDup("{{ Hi {{ first_name }}! }}", {
    heads: "   {{     ",
    tails: "    }}       ",
  });

// action
runPerf(testme, callerDir);
