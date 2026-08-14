// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { looseCompare } from "../dist/ast-loose-compare.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  looseCompare(
    {
      a: {
        b: "d",
        c: [],
        e: "f",
        g: "h",
      },
    },
    {
      a: {
        b: "d",
        c: [],
      },
    },
  );

// action
assert.equal(testme(), true);
runPerf(testme, callerDir);
