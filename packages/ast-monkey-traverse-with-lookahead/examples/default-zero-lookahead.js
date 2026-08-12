import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse-with-lookahead.esm.js";

const nextLengths = [];

traverse({ first: 1, second: 2 }, (_key, _value, inner) => {
  nextLengths.push(inner.next.length);
});

assert.deepEqual(nextLengths, [0, 0]);
