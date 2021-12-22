// Quick Take

import { strict as assert } from "assert";

import { pathNext, pathPrev, pathUp } from "../dist/ast-monkey-util.esm.js";

assert.equal(pathNext("9.children.3"), "9.children.4");

assert.equal(pathPrev("9.children.33"), "9.children.32");

assert.equal(pathUp("9.children.1.children.2"), "9.children.1");
