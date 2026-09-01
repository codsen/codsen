// deps
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

const callerDir = path.resolve(".");

const fixture = Object.freeze([
  "   ",
  Object.freeze({
    key2: "   ",
    key3: "   \n   ",
    key4: "   \t   ",
  }),
  "\n\n\n\n\n\n   \t   ",
]);

const testme = () => empty(fixture);

// action
runPerf(testme, callerDir);
