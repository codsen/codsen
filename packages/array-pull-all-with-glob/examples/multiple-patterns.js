// Remove values that match any of several patterns

import { strict as assert } from "node:assert";

import { pull } from "../dist/array-pull-all-with-glob.esm.js";

assert.deepEqual(
  pull(
    ["app.js", "app.test.js", "readme.md", "notes.txt"],
    ["*.test.js", "*.md"],
  ),
  ["app.js", "notes.txt"],
);
