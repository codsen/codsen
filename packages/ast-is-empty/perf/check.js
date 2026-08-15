// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isEmpty } from "../dist/ast-is-empty.esm.js";

const callerDir = path.resolve(".");

const testme = () =>
  isEmpty([
    {
      a: [""],
      b: { c: ["", "", { d: [""] }] },
    },
  ]);

assert.equal(testme(), true);

// action
runPerf(testme, callerDir);
