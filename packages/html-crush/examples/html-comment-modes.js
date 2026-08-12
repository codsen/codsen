// Choose which HTML comments to remove

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

const ordinary = "a<!-- note -->b";
const conditional = "a<!--[if mso]>outlook<![endif]-->b";

assert.equal(crush(ordinary, { removeHTMLComments: 0 }).result, ordinary);
assert.equal(crush(ordinary, { removeHTMLComments: 1 }).result, "ab");
assert.equal(crush(ordinary, { removeHTMLComments: true }).result, "ab");
assert.equal(crush(conditional, { removeHTMLComments: 1 }).result, conditional);
assert.equal(crush(conditional, { removeHTMLComments: 2 }).result, "aoutlookb");
