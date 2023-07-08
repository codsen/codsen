#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { findMalformed } from "../dist/string-find-malformed.esm.js";

const callerDir = path.resolve(".");

const gathered = [];
const testme = () =>
  findMalformed(
    "abcabcd.f",
    "abcdef",
    (obj) => {
      gathered.push(obj);
    },
    {
      maxDistance: 2,
    },
  );

// action
runPerf(testme, callerDir);
