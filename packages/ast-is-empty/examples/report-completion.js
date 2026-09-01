// Inspect frozen completion statistics

import { strict as assert } from "node:assert";

import { isEmpty } from "../dist/ast-is-empty.esm.js";

let completion;
assert.equal(
  isEmpty({ title: "", children: [""] }, {
    reportCompletionFunc(stats) {
      completion = stats;
    },
  }),
  true,
);
assert.equal(completion.uniqueContainersVisited, 2);
assert.equal(completion.objectPropertiesVisited, 2);
assert.equal(completion.arrayElementsVisited, 1);
assert.equal(Object.isFrozen(completion), true);
