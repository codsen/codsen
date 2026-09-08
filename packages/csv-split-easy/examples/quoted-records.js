// Read quoted fields after record breaks

import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(splitEasy('before\r\n"""hello"\r\n""""\r\n""\r\nafter'), [
  ["before"],
  ['"hello'],
  ['"'],
  ["after"],
]);
