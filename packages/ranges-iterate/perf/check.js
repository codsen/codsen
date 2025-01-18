/* eslint-disable @typescript-eslint/no-unused-vars */

// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { rIterate } from "../dist/ranges-iterate.esm.js";

const callerDir = path.resolve(".");

let pinged = "";
let index = 0;
const testMe = () => {
  rIterate(
    "abcdefghij",
    [
      [0, 5],
      [5, 10],
    ],
    ({ val }) => {
      pinged += val;
      index += 1;
    },
  );
};

// action
runPerf(testMe, callerDir);
