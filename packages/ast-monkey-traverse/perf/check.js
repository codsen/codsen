#!/usr/bin/env node

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { traverse } from "../dist/ast-monkey-traverse.esm.js";

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
    const current = val1 !== undefined ? val1 : key1;
    return current;
  });

// action
runPerf(testme, callerDir);
