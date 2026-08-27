// Use a fresh regular expression for an independent scan

import { strict as assert } from "node:assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

const comment = "<!--[if mso]><![endif]-->";
const first = emptyCondCommentRegex();
const second = emptyCondCommentRegex();

assert.notEqual(first, second);
assert.equal(first.test(comment), true);
assert.equal(first.lastIndex, comment.length);
assert.equal(second.lastIndex, 0);
