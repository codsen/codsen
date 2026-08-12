// Report healthy named-entity ranges

import { strict as assert } from "node:assert";

import { fixEnt } from "../dist/string-fix-broken-named-entities.esm.js";

const healthy = [];
const ranges = fixEnt("A&nbsp;B &nsp; C", {
  entityCatcherCb: (from, to) => healthy.push([from, to]),
});

assert.deepEqual(healthy, [[1, 7]]);
assert.equal(ranges.length, 1);
assert.equal(ranges[0][2], "&nbsp;");
