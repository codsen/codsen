// Replace each match with the next value in the array

import { strict as assert } from "node:assert";

import { getByKey } from "../dist/ast-get-values-by-key.esm.js";

assert.deepEqual(
  getByKey(
    {
      parsed: [{ tag: "html" }],
      foo: { tag: null },
      bar: { tag: null },
    },
    "tag",
    [123, 456],
  ),
  {
    parsed: [{ tag: 123 }],
    foo: { tag: 456 },
    bar: { tag: null },
  },
);
