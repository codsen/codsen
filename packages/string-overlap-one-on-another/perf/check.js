#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { overlap } from "../dist/string-overlap-one-on-another.esm.js";

const testme = () =>
  overlap("123", "b", { offset: 5, offsetFillerCharacter: "" });

// action
runPerf(testme, callerDir);
