// Look ahead two nodes at a time

import { strict as assert } from "node:assert";

import { traverseWithLookahead } from "../dist/ast-monkey.esm.js";

const upcomingPaths = [];

traverseWithLookahead(
  { first: 1, second: 2, third: 3 },
  (_key, _value, inner) => {
    upcomingPaths.push(inner.next.map(([, , nextInner]) => nextInner.path));
  },
  2,
);

assert.deepEqual(upcomingPaths, [["second", "third"], ["third"], []]);
