/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import { pull } from "../dist/array-pull-all-with-glob.esm.js";

assert.deepEqual(
  pull(
    ["keep_me", "name-1", "name-2", "name-jhkgdhgkhdfghdkghfdk"],
    ["name-*"]
  ),
  ["keep_me"]
);
