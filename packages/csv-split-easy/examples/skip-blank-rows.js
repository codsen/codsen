import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(splitEasy("name,amount\n\n   \nAda,2\n\nGrace,3"), [
  ["name", "amount"],
  ["Ada", "2"],
  ["Grace", "3"],
]);
