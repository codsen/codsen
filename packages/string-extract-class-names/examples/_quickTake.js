/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import extract from "../dist/string-extract-class-names.esm.js";

// extracts classes
assert.deepEqual(extract("div.first-class.second-class"), [
  ".first-class",
  ".second-class",
]);

// and id's
assert.deepEqual(extract("div#brambles.gramples#croodles"), [
  "#brambles",
  ".gramples",
  "#croodles",
]);

// optionally, you can request ranges (see codsen.com/ranges/):
assert.deepEqual(extract("div.first-class.second-class", true), [
  [3, 15],
  [15, 28],
]);
