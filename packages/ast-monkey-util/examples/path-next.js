// Move to the next sibling path

import { strict as assert } from "node:assert";

import { pathNext } from "../dist/ast-monkey-util.esm.js";

assert.equal(pathNext("article.children.2"), "article.children.3");

// A path without a numeric final segment is left unchanged.
assert.equal(pathNext("article.children"), "article.children");
