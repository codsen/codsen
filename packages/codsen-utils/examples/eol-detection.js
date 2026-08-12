// Detect and resolve line endings

import { strict as assert } from "node:assert";

import { detectEol, resolveEolSetting } from "../dist/codsen-utils.esm.js";

assert.equal(detectEol("first\r\nsecond"), "\r\n");
assert.equal(resolveEolSetting("first\rsecond", undefined), "\r");
assert.equal(resolveEolSetting("first\rsecond", "lf"), "\n");
assert.equal(resolveEolSetting("no breaks", undefined, "\r\n"), "\r\n");
