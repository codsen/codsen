#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { tokenizer } from "../dist/codsen-tokenizer.esm.js";

const callerDir = path.resolve(".");

const testme = () => {
  let gathered = [];
  tokenizer("<a>\"something\"<span>'here'</span></a>", {
    tagCb: (obj) => {
      gathered.push(obj);
    },
  });
};

// action
runPerf(testme, callerDir);
