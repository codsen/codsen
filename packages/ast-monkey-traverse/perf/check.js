#!/usr/bin/env node

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const callerDir = path.resolve(".");

const input = {
  a: {
    b: {
      c: "c_val",
      d: "d_val",
      e: "e_val",
    },
    f: {
      g: {
        h: ["1", "2", "3"],
        i: [
          "4",
          "5",
          {
            j: "k",
          },
        ],
        l: ["7", "8", "9"],
      },
    },
  },
};
const testme = () =>
  traverse(input, (key1, val1) => {
    let current = val1 !== undefined ? val1 : key1;
    return current;
  });

// action
runPerf(testme, callerDir);
