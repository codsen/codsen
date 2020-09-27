/* eslint import/extensions:0, no-unused-vars:0 */

// Quick Take

import { strict as assert } from "assert";
import isOpening from "../dist/is-html-tag-opening.esm";

const text = `<span>a < b<span>`;

// opening span tag's opening
assert.equal(isOpening(text, 0), true);

// unencoded bracket between a and b
assert.equal(isOpening(text, 8), false);

// closing span tag's opening
assert.equal(isOpening(text, 11), true);
