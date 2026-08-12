// Move up one AST level

import { strict as assert } from "node:assert";

import { pathUp } from "../dist/ast-monkey-util.esm.js";

assert.equal(pathUp("article.children.2.children.0"), "article.children.2");
assert.equal(pathUp("article.children.2"), "article");
assert.equal(pathUp("article"), "0");
