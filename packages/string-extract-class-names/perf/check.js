#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { extract } from "../dist/string-extract-class-names.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  extract("p#id-name:lang(it) p#id-name-other:lang(en)", true);

// action
runPerf(testme, callerDir);
