/* eslint import/extensions:0 */

// Non-parsing algorithm can tackle really dodgy CSS

import { strict as assert } from "assert";
import extract from "../dist/string-extract-class-names.esm.js";

// probably invalid input, but works anyway:
assert.deepEqual(extract("?#id1#id2? #id3#id4> p > #id5#id6"), [
  "#id1",
  "#id2",
  "#id3",
  "#id4",
  "#id5",
  "#id6",
]);
