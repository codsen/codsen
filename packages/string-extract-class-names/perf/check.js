#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { extract } from "../dist/string-extract-class-names.esm.js";

const testme = () =>
  extract("p#id-name:lang(it) p#id-name-other:lang(en)", true);

// action
runPerf(testme, callerDir);
