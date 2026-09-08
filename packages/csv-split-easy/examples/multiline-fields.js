import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(splitEasy('id,notes\r\n1,"hello\r\nworld"'), [
  ["id", "notes"],
  ["1", "hello\r\nworld"],
]);
