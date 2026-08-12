// Replace matching objects in traversal order

import { strict as assert } from "node:assert";

import { getObj } from "../dist/ast-get-object.esm.js";

assert.deepEqual(
  getObj(
    [
      { type: "text", value: "old heading" },
      { children: [{ type: "text", value: "old body" }] },
    ],
    { type: "text" },
    [
      { type: "text", value: "new heading" },
      { type: "text", value: "new body" },
    ],
  ),
  [
    { type: "text", value: "new heading" },
    { children: [{ type: "text", value: "new body" }] },
  ],
);
