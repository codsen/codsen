// Apply and merge numeric replacement values

import { strict as assert } from "node:assert";

import { rApply } from "../dist/ranges-apply.esm.js";

assert.equal(rApply("abc", [[1, 1, 0]]), "a0bc");
assert.equal(
  rApply("abcdef", [
    [1, 3, 1],
    [2, 4, 2],
  ]),
  "a3ef",
);
