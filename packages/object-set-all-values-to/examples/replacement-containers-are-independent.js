// Each replacement container is a separate object

import { strict as assert } from "node:assert";

import { setAllValuesTo } from "../dist/object-set-all-values-to.esm.js";

const result = setAllValuesTo(
  { first: { value: 1 }, second: { value: 2 } },
  { selected: false },
);

result.first.value.selected = true;

assert.equal(result.first.value.selected, true);
assert.equal(result.second.value.selected, false);
