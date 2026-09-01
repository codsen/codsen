// deps
import { strict as assert } from "node:assert";
import path from "node:path";

import { runPerf } from "../../../ops/scripts/perf.js";
import { isEmpty } from "../dist/ast-is-empty.esm.js";

const callerDir = path.resolve(".");

const fixture = Object.freeze([
  Object.freeze({
    a: Object.freeze([""]),
    b: Object.freeze({
      c: Object.freeze(["", "", Object.freeze({ d: Object.freeze([""]) })]),
    }),
  }),
]);

const testme = () => isEmpty(fixture);

assert.equal(testme(), true);

// action
runPerf(testme, callerDir);
