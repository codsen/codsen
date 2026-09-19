// Look ahead by zero nodes by default

import { strict as assert } from "node:assert";

import { traverseWithLookahead } from "../dist/ast-monkey.esm.js";

const nextLengths = [];

traverseWithLookahead({ first: 1, second: 2 }, (_key, _value, inner) => {
  nextLengths.push(inner.next.length);
});

assert.deepEqual(nextLengths, [0, 0]);
