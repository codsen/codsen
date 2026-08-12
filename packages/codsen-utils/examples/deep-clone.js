// Deeply clone a cyclic object graph

import { strict as assert } from "node:assert";

import { deepClone } from "../dist/codsen-utils.esm.js";

const source = { nested: { value: 1 } };
source.self = source;
source.map = new Map([[source.nested, source]]);

const cloned = deepClone(source);

assert.notEqual(cloned, source);
assert.notEqual(cloned.nested, source.nested);
assert.equal(cloned.self, cloned);
assert.equal([...cloned.map.values()][0], cloned);
