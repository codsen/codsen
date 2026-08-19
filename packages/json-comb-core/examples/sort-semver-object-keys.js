// Sort object keys in semver order

import { strict as assert } from "node:assert";

import { sortAllObjectsSync } from "../dist/json-comb-core.esm.js";

assert.deepEqual(
  Object.keys(
    sortAllObjectsSync({
      "10.0.0": "latest",
      "2.10.0": "middle",
      "2.9.0": "oldest",
    }),
  ),
  ["2.9.0", "2.10.0", "10.0.0"],
);
