// Keep whitespace-only objects when hungry matching is disabled

import { strict as assert } from "node:assert";

import { deleteObj } from "../dist/ast-delete-object.esm.js";

const source = [{ a: "\n" }, { key: "value" }, { b: "   " }, { c: "" }];

assert.deepEqual(
  deleteObj(
    source,
    {},
    {
      matchKeysStrictly: false,
      hungryForWhitespace: false,
    },
  ),
  source,
);
