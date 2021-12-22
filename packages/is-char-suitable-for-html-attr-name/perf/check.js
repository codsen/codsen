#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isAttrNameChar } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  isAttrNameChar("A");
};

// action
runPerf(testme, callerDir);
