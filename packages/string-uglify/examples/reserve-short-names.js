// Keep existing short names reserved

import { strict as assert } from "node:assert";

import { uglifyArr } from "../dist/string-uglify.esm.js";

assert.deepEqual(uglifyArr([".a", ".alpha", ".b", ".bravo"]), [
  ".a",
  ".s",
  ".b",
  ".m",
]);
