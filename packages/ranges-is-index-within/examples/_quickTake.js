/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import isIndexWithin from "../dist/ranges-is-index-within.esm.js";

assert.equal(
  isIndexWithin(8, [
    [1, 2],
    [5, 10],
  ]),
  true
);

assert.equal(
  isIndexWithin(12, [
    [1, 2],
    [5, 10],
  ]),
  false
);
