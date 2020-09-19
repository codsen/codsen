/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import unfancy from "../dist/string-unfancy.esm.js";

// U+2019
// https://www.fileformat.info/info/unicode/char/2019/index.htm
// https://mothereff.in/js-escapes
const rightSingleQuote = "\u2019";

assert.equal(unfancy(`someone${rightSingleQuote}s`), "someone's");

// works with encoded HTML:
assert.equal(unfancy("someone&rsquo;s"), "someone's");
