#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { within } from "../dist/email-all-chars-within-ascii.esm.js";

const testme = () =>
  within(
    "skjglk djjflgkhjjlsjh fshdfh klahl\n jsldfj ldkjgl dkfjgldjlhj;gfkjljlsdflhs"
  );

// action
runPerf(testme, callerDir);
