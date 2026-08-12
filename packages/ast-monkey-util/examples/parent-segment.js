// Find the parent segment

import { strict as assert } from "node:assert";

import { parent } from "../dist/ast-monkey-util.esm.js";

assert.equal(parent("article.children.2.type"), "2");
assert.equal(parent("article"), null);
