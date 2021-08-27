#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { deepContains } from "../dist/ast-deep-contains.esm.js";

const testme = () => {
  const gathered = [];
  const errors = [];
  deepContains(
    { a: "1", b: "2" },
    { a: "1", b: "2", c: "3" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    (err) => {
      errors.push(err);
    }
  );
};

// action
runPerf(testme, callerDir);
