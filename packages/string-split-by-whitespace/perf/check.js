// deps
import path from "path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { splitByW } from "../dist/string-split-by-whitespace.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  splitByW("some interesting {{text}} {% and %} {{ some more }} text.", {
    ignoreRanges: [
      [17, 25],
      [26, 35],
      [36, 51],
    ],
  });

// action
runPerf(testme, callerDir);
