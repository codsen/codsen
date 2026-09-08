import { strict as assert } from "node:assert";
import { comb } from "../dist/email-comb.esm.js";

const source = String.raw`<style>.a\31/* note */ a{color:red}</style><body><div class="a1"><a>x</a></div></body>`;
const result = comb(source);
assert.equal(result.result, source.replace("/* note */", "/**/"));
assert.equal(result.log.commentsLength, "/* note */".length - "/**/".length);
