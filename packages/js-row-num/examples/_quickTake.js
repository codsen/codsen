// Quick Take

import { strict as assert } from "assert";

import { fixRowNums } from "../dist/js-row-num.esm.js";

// sets line number to 002 because it's on row number two
const { result, ranges } = fixRowNums(
  'const foo = "bar";\n console.log(`0 foo = ${foo}`)',
);
assert.deepEqual(
  result,
  'const foo = "bar";\n console.log(`002 foo = ${foo}`)',
);
assert.deepEqual(ranges, [[33, 34, "002"]]);
