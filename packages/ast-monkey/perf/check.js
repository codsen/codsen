#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { find } from "../dist/ast-monkey.esm.js";

// find()
const testme = () =>
  find(
    {
      a: {
        b: "c1",
      },
      k: {
        b: "c2",
      },
      z: {
        x: "y",
      },
    },
    {
      key: null,
      val: { b: "c*" },
    }
  );

// action
runPerf(testme, callerDir);
