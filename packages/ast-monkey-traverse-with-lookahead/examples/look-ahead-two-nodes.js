import { strict as assert } from "node:assert";

import { traverse } from "../dist/ast-monkey-traverse-with-lookahead.esm.js";

const upcomingPaths = [];

traverse(
  { first: 1, second: 2, third: 3 },
  (_key, _value, inner) => {
    upcomingPaths.push(inner.next.map(([, , nextInner]) => nextInner.path));
  },
  2,
);

assert.deepEqual(upcomingPaths, [["second", "third"], ["third"], []]);
