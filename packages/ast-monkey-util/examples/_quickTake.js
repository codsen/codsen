// Quick Take

import { strict as assert } from "node:assert";

import { pathNext } from "../dist/ast-monkey-util.esm.js";

assert.equal(pathNext("9.children.3"), "9.children.4");
