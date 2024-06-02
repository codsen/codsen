/* eslint no-unused-vars:0 */

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rIterate } from "../dist/ranges-iterate.esm.js";

const callerDir = path.resolve(".");

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
    },
  );

// action
runPerf(testme, callerDir);
