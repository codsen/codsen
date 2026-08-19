// Delete nodes by returning `NaN`

import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const result = traverse(
  { visible: "keep", private: "remove", items: ["keep", "remove"] },
  (key, value) => {
    const current = value !== undefined ? value : key;
    return key === "private" || current === "remove" ? Number.NaN : current;
  },
);

assert.deepEqual(result, { visible: "keep", items: ["keep"] });
