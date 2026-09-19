// Quick Take

import { strict as assert } from "node:assert";

import { traverseWithLookahead } from "../dist/ast-monkey.esm.js";

const input = [{ a: "b" }, { c: "d" }];
const currentAndNextPaths = [];

traverseWithLookahead(
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
