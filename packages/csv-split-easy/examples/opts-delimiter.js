// `opts.delimiter`

import { strict as assert } from "node:assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

assert.deepEqual(splitEasy("name;amount\nJane;1000", { delimiter: ";" }), [
  ["name", "amount"],
  ["Jane", "1000"],
]);
