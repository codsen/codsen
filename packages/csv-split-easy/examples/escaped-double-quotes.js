// Unescape doubled-up double quotes

import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(splitEasy('name,note\nAda,"She said ""hello"""'), [
  ["name", "note"],
  ["Ada", 'She said "hello"'],
]);
