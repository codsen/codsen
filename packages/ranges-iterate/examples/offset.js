// Start iteration at an existing output offset

import { strict as assert } from "node:assert";

import { rIterate } from "../dist/ranges-iterate.esm.js";

const visited = [];
rIterate("abcdef", [[3, 4, "X"]], (entry) => visited.push(entry), 2);

assert.deepEqual(visited, [
  { i: 2, val: "c" },
  { i: 3, val: "X" },
  { i: 4, val: "e" },
  { i: 5, val: "f" },
]);
