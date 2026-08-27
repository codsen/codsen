// Preserve CSS references and selectors

import { strict as assert } from "node:assert";

import { conv } from "../dist/color-shorthand-hex-to-six-digit.esm.js";

assert.equal(
  conv(
    'a[href="icons.svg#abc"] { color: #abc; background: url(/* icon */ "sprite.svg#fff") }',
  ),
  'a[href="icons.svg#abc"] { color: #aabbcc; background: url(/* icon */ "sprite.svg#fff") }',
);
