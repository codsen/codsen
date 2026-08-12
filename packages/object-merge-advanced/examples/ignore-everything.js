// Keep existing values for every clash

import { strict as assert } from "node:assert";

import { mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

assert.deepEqual(
  mergeAdvanced(
    { list: ["old"], retained: true },
    { list: ["new"], added: true },
    { ignoreEverything: true },
  ),
  { list: ["old"], retained: true, added: true },
);
