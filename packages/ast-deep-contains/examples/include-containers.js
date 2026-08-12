// Receive container values as well as leaf values

import { strict as assert } from "node:assert";

import { deepContains } from "../dist/ast-deep-contains.esm.js";

const gathered = [];

deepContains(
  { section: { title: "News", count: 3 } },
  { section: { title: "News" } },
  (leftValue, rightValue, path) => {
    gathered.push([leftValue, rightValue, path]);
  },
  assert.fail,
  { skipContainers: false },
);

assert.deepEqual(gathered, [
  [{ title: "News", count: 3 }, { title: "News" }, "section"],
  ["News", "News", "section.title"],
]);
