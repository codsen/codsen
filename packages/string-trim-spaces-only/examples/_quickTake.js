// Quick Take

import { strict as assert } from "assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.deepEqual(trimSpaces("  aaa   "), {
  res: "aaa",
  ranges: [
    [0, 2],
    [5, 8],
  ],
});

assert.deepEqual(trimSpaces("   \t  zz   \n    "), {
  res: "\t  zz   \n",
  ranges: [
    [0, 3],
    [12, 16],
  ],
});
