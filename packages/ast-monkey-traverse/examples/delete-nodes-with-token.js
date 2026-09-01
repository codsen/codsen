// Delete nodes with the collision-free token

import { strict as assert } from "node:assert";

import { DELETE, traverse } from "../dist/ast-monkey-traverse.esm.js";

const result = traverse(
  { visible: "keep", private: "remove", items: ["keep", "remove"] },
  (key, value, inner) => {
    const current = inner.parentType === "object" ? value : key;
    return key === "private" || current === "remove" ? DELETE : current;
  },
);

assert.deepEqual(result, { visible: "keep", items: ["keep"] });
