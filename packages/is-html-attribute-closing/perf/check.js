#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { isAttrClosing } from "../dist/is-html-attribute-closing.esm.js";

const testme = () => {
  isAttrClosing(`<a href="zzz" target="_blank" style="color: black;">`, 21, 28);
};

// action
runPerf(testme, callerDir);
