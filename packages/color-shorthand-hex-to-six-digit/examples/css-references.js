// Preserve CSS references and selectors

import { strict as assert } from "node:assert";

import { conv } from "../dist/color-shorthand-hex-to-six-digit.esm.js";

assert.equal(
  conv('a[href="#abc"] { color: #abc; background: url(#fff) }'),
  'a[href="#abc"] { color: #aabbcc; background: url(#fff) }',
);
