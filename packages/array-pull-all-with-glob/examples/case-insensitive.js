// Match removal patterns without regard to letter case

import { strict as assert } from "node:assert";

import { pull } from "../dist/array-pull-all-with-glob.esm.js";

assert.deepEqual(
  pull(["Draft.md", "README.md", "notes.txt"], ["*.MD"], {
    caseSensitive: false,
  }),
  ["notes.txt"],
);
