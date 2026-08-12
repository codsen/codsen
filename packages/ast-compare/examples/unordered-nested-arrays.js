import { strict as assert } from "node:assert";

import { compare } from "../dist/ast-compare.esm.js";

const actual = {
  groups: [
    [1, 2],
    [3, 4],
  ],
};
const expected = {
  groups: [
    [4, 3],
    [2, 1],
  ],
};

assert.equal(
  compare(actual, expected, { arrayOrder: "any", matchStrictly: true }),
  true,
);
