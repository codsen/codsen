// Apply and merge numeric replacement values

import { strict as assert } from "node:assert";

import { rApply } from "../dist/ranges-apply.esm.js";

assert.equal(rApply("abc", [0, 0, 0]), "0abc");
assert.equal(
  rApply("abcdef", [
    [1, 3, 1],
    [2, 4, 2],
  ]),
  "a3ef",
);
