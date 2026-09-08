import { strict as assert } from "node:assert";
import { comb } from "../dist/email-comb.esm.js";

const html =
  '<style>.foo{color:red}.bar{color:blue}</style><body><div class="foo&#32;bar">x</div></body>';
const result = comb(html);

assert.deepEqual(result.allInBody, [".bar", ".foo"]);
assert.equal(result.result, html);
