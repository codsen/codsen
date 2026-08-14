// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { compare } from "../dist/ast-compare.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  compare(
    [
      { a: "a" },
      { b: "b" },
      { c1: "c1", c2: "c2" },
      { d1: "d1", d2: "d2" },
      { e: "e" },
    ],
    [
      { c2: "c2", c1: "c1" },
      { d2: "d2", d1: "d1" },
    ],
  );

// action
assert.equal(testme(), true);
runPerf(testme, callerDir);
