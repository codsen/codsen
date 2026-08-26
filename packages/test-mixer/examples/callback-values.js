// Preserve callback values without invoking them

import { strict as assert } from "node:assert";

import { mixer } from "../dist/test-mixer.esm.js";

let calls = 0;
const callback = () => {
  calls += 1;
};
const result = mixer({}, { enabled: true, callback });

assert.equal(calls, 0);
assert.equal(result[0].callback, callback);
assert.equal(result[1].callback, callback);
