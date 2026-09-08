// Use options created in another JavaScript realm

import { strict as assert } from "node:assert";
import { runInNewContext } from "node:vm";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

const options = runInNewContext(`({
  delimiter: ";",
  removeThousandSeparatorsFromNumbers: false,
  forceUKStyle: true
})`);

assert.deepEqual(splitEasy('item;"1 234,50"', options), [["item", "1 234.50"]]);
