// Quick Take

import { strict as assert } from "assert";
import { isAttrNameChar } from "../dist/is-char-suitable-for-html-attr-name.esm.js";

// Follows the spec:
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2

assert.equal(isAttrNameChar("a"), true);
assert.equal(isAttrNameChar("?"), false);
