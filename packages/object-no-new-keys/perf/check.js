#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.mjs";

// setup
import { noNewKeys } from "../dist/object-no-new-keys.esm.js";

const testme = () =>
  noNewKeys(
    {
      a: [
        {
          b: "aaa",
          d: "aaa",
          f: "fff",
        },
        {
          c: "aaa",
          k: "kkk",
        },
      ],
      x: "x",
    },
    {
      a: [
        {
          b: "bbb",
          c: "ccc",
        },
      ],
    },
    { mode: 1 }
  );

// action
runPerf(testme, callerDir);
