// Quick Take

import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse-with-lookahead.esm.js";

const input = [{ a: "b" }, { c: "d" }];
const currentAndNextPaths = [];

traverse(
  input,
  (_key, _value, inner) => {
    currentAndNextPaths.push([inner.path, inner.next[0]?.[2].path ?? null]);
  },
  1,
);

assert.deepEqual(currentAndNextPaths, [
  ["0", "0.a"],
  ["0.a", "1"],
  ["1", "1.c"],
  ["1.c", null],
]);
