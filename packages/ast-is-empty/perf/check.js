#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { isEmpty } from "../dist/ast-is-empty.esm.js";

const testme = () =>
  isEmpty([
    {
      a: [""],
      b: { c: ["", " ", { d: [""] }] },
    },
  ]);

// action
runPerf(testme, callerDir);
