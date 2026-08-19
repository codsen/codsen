// Inspect a node's metadata and its lookahead

import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse-with-lookahead.esm.js";

let firstMetadata;

traverse(
  [{ a: "b" }, { c: "d" }],
  (_key, _value, inner, stop) => {
    if (!firstMetadata) {
      firstMetadata = inner;
      stop.now = true;
    }
  },
  1,
);

assert.deepEqual(firstMetadata, {
  depth: 0,
  path: "0",
  parent: [{ a: "b" }, { c: "d" }],
  parentType: "array",
  next: [
    [
      "a",
      "b",
      {
        depth: 1,
        path: "0.a",
        parent: { a: "b" },
        parentType: "object",
      },
    ],
  ],
});
