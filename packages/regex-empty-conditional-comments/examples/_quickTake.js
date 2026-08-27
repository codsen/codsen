// Quick Take

import { strict as assert } from "node:assert";

import { emptyCondCommentRegex } from "../dist/regex-empty-conditional-comments.esm.js";

const regex = emptyCondCommentRegex();

assert.equal(regex.flags, "gi");
assert.equal(
  regex.test(`<!--[if !mso]>
<![endif]-->`),
  true,
);
