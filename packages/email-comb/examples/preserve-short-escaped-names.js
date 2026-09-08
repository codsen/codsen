// Unchanged short names keep the escaping required by their output context.
import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const html = String.raw`<style>.\31{color:red}[class="\22"]{color:blue}</style><body><div class="1">one</div><div class="&quot;">quote</div></body>`;
const result = comb(html, { uglify: true });

assert.equal(result.result, html);
assert.deepEqual(result.log.uglified, [
  [".1", ".1"],
  ['."', '."'],
]);
