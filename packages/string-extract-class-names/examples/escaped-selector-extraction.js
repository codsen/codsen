// Extract raw escaped selectors

import { strict as assert } from "node:assert";

import { extract } from "../dist/string-extract-class-names.esm.js";

assert.deepEqual(extract(".foo\\:bar#baz"), {
  res: [".foo\\:bar", "#baz"],
  ranges: [
    [0, 9],
    [9, 13],
  ],
});
