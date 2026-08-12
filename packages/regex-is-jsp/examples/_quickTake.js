// Quick Take

import { strict as assert } from "node:assert";

import { isJSP } from "../dist/regex-is-jsp.esm.js";

// detects JSP code
assert.equal(isJSP().test('<div><% out.println("Hi!"); %></div>'), true);
