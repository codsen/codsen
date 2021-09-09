#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { tokenizer } from "../dist/codsen-tokenizer.esm.js";

const testme = () => {
  const gathered = [];
  tokenizer(`<a>"something"<span>'here'</span></a>`, {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
};

// action
runPerf(testme, callerDir);
