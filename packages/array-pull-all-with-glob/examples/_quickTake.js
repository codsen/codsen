/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import pullAllWithGlob from "../dist/array-pull-all-with-glob.esm.js";

assert.deepEqual(
  pullAllWithGlob(
    ["keep_me", "name-1", "name-2", "name-jhkgdhgkhdfghdkghfdk"],
    ["name-*"]
  ),
  ["keep_me"]
);
