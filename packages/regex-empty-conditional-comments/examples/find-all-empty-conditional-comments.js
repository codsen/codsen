// Find all empty conditional comments

import { strict as assert } from "node:assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

const html = `<!--[if !mso]><![endif]-->
<p>Keep me</p>
<!--[if gte mso 9]><![endif]-->`;

assert.equal(html.match(emptyCondCommentRegex()).length, 2);
