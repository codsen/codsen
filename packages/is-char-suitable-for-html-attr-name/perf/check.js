#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { isAttrNameChar } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

const testme = () => {
  isAttrNameChar("A");
};

// action
runPerf(testme, callerDir);
