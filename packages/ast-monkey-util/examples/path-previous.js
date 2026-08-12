// Move to the previous sibling path

import { strict as assert } from "node:assert";

import { pathPrev } from "../dist/ast-monkey-util.esm.js";

assert.equal(pathPrev("article.children.2"), "article.children.1");
assert.equal(pathPrev("article.children.0"), null);
