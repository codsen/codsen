// Treat whitespace-only strings as content

import { strict as assert } from "node:assert";

import { isEmpty } from "../dist/ast-is-empty.esm.js";

assert.equal(isEmpty({ title: "", body: " " }), false);
