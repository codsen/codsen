// Preserve non-space whitespace at the trimmed boundaries

import { strict as assert } from "node:assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.deepEqual(trimSpaces("   \t  zz   \n    "), {
  res: "\t  zz   \n",
  ranges: [
    [0, 3],
    [12, 16],
  ],
});
