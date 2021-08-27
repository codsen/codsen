#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { compare } from "../dist/ast-compare.esm.js";

const testme = () =>
  compare(
    [{ a: "a" }, { b: "b" }, { c1: "c1", c2: "c2" }, { d2: "d2" }, { e: "e" }],
    [
      { c2: "c2", c1: "c1" },
      { d2: "d2", d1: "d1" },
    ]
  );

// action
runPerf(testme, callerDir);
