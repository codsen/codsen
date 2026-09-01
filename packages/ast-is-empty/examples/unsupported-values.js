// Return null when the tree contains an unsupported value type

import { strict as assert } from "node:assert";

import { isEmpty } from "../dist/ast-is-empty.esm.js";

assert.equal(isEmpty({ title: "", count: 0 }), null);
assert.equal(isEmpty({ title: "visible", count: 0 }), null);
assert.equal(isEmpty({ count: 0, title: "visible" }), null);
assert.equal(isEmpty(null), null);
