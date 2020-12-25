// Quick Take

import { strict as assert } from "assert";
import { isJSP } from "../dist/regex-is-jsp.esm.js";

// detects JSP code
assert.equal(isJSP().test(`<div><% out.println("Hi!"); %></div>`), true);

// in case if it's not nunjucks
assert.equal(isJSP().test(`<div>tralala</div>`), false);
