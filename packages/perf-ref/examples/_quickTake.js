// Quick Take

import { strict as assert } from "assert";
import { perfRef, opsPerSec } from "../perf-ref.esm.js";

assert.equal(perfRef(), "182014283915");
assert.equal(opsPerSec, 182);
