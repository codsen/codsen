// Skip characters covered by a deletion range

import { strict as assert } from "node:assert";

import { rIterate } from "../dist/ranges-iterate.esm.js";

const visited = [];
rIterate("abcdef", [[1, 3]], (entry) => visited.push(entry));

assert.deepEqual(visited, [
  { i: 0, val: "a" },
  { i: 1, val: "d" },
  { i: 2, val: "e" },
  { i: 3, val: "f" },
]);
