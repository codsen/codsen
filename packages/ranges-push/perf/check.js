#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { Ranges } from "../dist/ranges-push.esm.js";

const testme = () => {
  const ranges = new Ranges();
  ranges.add(6, 10);
  ranges.add(16, 20, "bbb");
  ranges.add(11, 15, "aaa");
  ranges.add(10, 30);
  ranges.add(1, 5);
};

// action
runPerf(testme, callerDir);
