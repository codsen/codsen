import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse.esm.js";

const result = traverse({ price: 10, nested: { price: 20 } }, (key, value) => {
  const current = value !== undefined ? value : key;
  return key === "price" ? current * 1.2 : current;
});

assert.deepEqual(result, { price: 12, nested: { price: 24 } });
