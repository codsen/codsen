#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { noNewKeys } from "../dist/object-no-new-keys.esm.js";

const callerDir = path.resolve(".");

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
    { mode: 1 },
  );

// action
runPerf(testme, callerDir);
