// Report completion statistics

import { strict as assert } from "node:assert";

import { empty } from "../dist/ast-contains-only-empty-space.esm.js";

let completion;

assert.equal(
  empty([" ", { nested: "\n" }], {
    reportCompletionFunc: (stats) => {
      completion = stats;
    },
  }),
  true,
);
assert.equal(completion.arrayElementsVisited, 2);
assert.equal(completion.objectPropertiesVisited, 1);
assert.equal(completion.uniqueContainersVisited, 2);
assert.equal(Object.isFrozen(completion), true);
