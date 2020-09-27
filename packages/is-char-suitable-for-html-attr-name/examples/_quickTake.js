/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import is from "../dist/is-char-suitable-for-html-attr-name.esm";

// Follows the spec:
// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2

assert.equal(is("a"), true);
assert.equal(is("?"), false);
