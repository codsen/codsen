import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse-with-lookahead.esm.js";

const visited = [];

traverse(
  { first: 1, second: 2, third: 3 },
  (key, _value, _inner, stop) => {
    visited.push(key);
    if (key === "second") stop.now = true;
  },
  1,
);

assert.deepEqual(visited, ["first", "second", "third"]);
