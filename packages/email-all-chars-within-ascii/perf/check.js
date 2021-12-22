#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { within } from "../dist/email-all-chars-within-ascii.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  within(
    "skjglk djjflgkhjjlsjh fshdfh klahl\n jsldfj ldkjgl dkfjgldjlhj;gfkjljlsdflhs"
  );

// action
runPerf(testme, callerDir);
