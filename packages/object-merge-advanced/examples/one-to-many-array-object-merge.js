// Apply one array object to every object in the other array

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced([{ published: true }], [{ id: 1 }, { id: 2 }], {
    oneToManyArrayObjectMerge: true,
  }),
  [
    { published: true, id: 1 },
    { published: true, id: 2 },
  ],
);
