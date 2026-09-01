// Traverse a tree using the re-exported `traverse`

import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey.esm.js";

const result = traverse(
  { count: 1, nested: { count: 2 } },
  (key, value, innerObj) => {
    const current = innerObj.parentType === "object" ? value : key;
    return key === "count" ? current + 1 : current;
  },
);

assert.deepEqual(result, { count: 2, nested: { count: 3 } });
