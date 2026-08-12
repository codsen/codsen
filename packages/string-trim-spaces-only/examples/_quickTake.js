// Quick Take

import { strict as assert } from "node:assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.deepEqual(trimSpaces("  aaa   "), {
  res: "aaa",
  ranges: [
    [0, 2],
    [5, 8],
  ],
});
