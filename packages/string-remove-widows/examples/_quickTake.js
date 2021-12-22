// Quick Take

import { strict as assert } from "assert";

import { removeWidows } from "../dist/string-remove-widows.esm.js";

const { ranges, res } = removeWidows("Some text with many words on one line.");

// see codsen.com/ranges/
assert.deepEqual(ranges, [[32, 33, "&nbsp;"]]);

assert.equal(res, "Some text with many words on one&nbsp;line.");
