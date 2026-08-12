// Inspect the replacement ranges

import { strict as assert } from "node:assert";

import { fixRowNums } from "../dist/js-row-num.esm.js";

const { ranges } = fixRowNums(
  'const foo = "bar";\n console.log(`0 foo = $' + "{foo}`)",
);

assert.deepEqual(ranges, [[33, 34, "002"]]);
