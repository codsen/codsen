import { strict as assert } from "node:assert";

import { convertAll } from "../dist/string-dashes.esm.js";

const source = "Read pages 10-12 - then stop.";
const result = convertAll(source, { convertDashes: false });

assert.equal(result.result, source);
assert.deepEqual(result.ranges, []);
