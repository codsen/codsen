// Find every matching object in a nested AST

import { strict as assert } from "node:assert";

import { getObj } from "../dist/ast-get-object.esm.js";

assert.deepEqual(
  getObj(
    [
      { type: "text", value: "Title" },
      { children: [{ type: "text", value: "Body" }] },
    ],
    { type: "text" },
  ),
  [
    { type: "text", value: "Title" },
    { type: "text", value: "Body" },
  ],
);
