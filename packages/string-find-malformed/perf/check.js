#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { findMalformed } from "../dist/string-find-malformed.esm.js";

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
    }
  );

// action
runPerf(testme, callerDir);
