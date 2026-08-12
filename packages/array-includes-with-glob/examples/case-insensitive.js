// Match glob patterns without matching letter case

import { strict as assert } from "node:assert";

import { includesWithGlob } from "../dist/array-includes-with-glob.esm.js";

assert.equal(
  includesWithGlob(["README.md"], "read*.MD", { caseSensitive: false }),
  true,
);
