// Recognise a tree made only from empty strings and containers

import { strict as assert } from "node:assert";

import { isEmpty } from "../dist/ast-is-empty.esm.js";

assert.equal(isEmpty({ sections: [{ title: "", children: ["", {}] }] }), true);
