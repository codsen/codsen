// Preserve CSS token boundaries when removing comments

import { strict as assert } from "node:assert";
import { crush } from "../dist/html-crush.esm.js";

// The comment separates the escaped class name from descendant whitespace.
const source = String.raw`<style>.a\31/* explanation */ a{color:red}</style>`;
const result = crush(source);
assert.equal(result.result, String.raw`<style>.a\31/**/ a{color:red}</style>`);
assert.equal(result.applicableOpts.removeCSSComments, true);
