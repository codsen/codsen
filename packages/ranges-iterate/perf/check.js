#!/usr/bin/env node
/* eslint no-unused-vars:0 */

// deps
import path from "path";

const callerDir = path.resolve(".");
import { runPerf } from "../../../scripts/run-perf.js";

// setup
import { rIterate } from "../dist/ranges-iterate.esm.js";

let pinged = "";
let index = 0;
const testme = () =>
  rIterate(
    "abcdefghij",
    [
      [0, 5],
      [5, 10],
    ],
    ({ i, val }) => {
      pinged += val;
      index += 1;
    }
  );

// action
runPerf(testme, callerDir);
