// Include hidden entries

import { strict as assert } from "node:assert";

import { glob } from "../dist/codsen-glob.esm.js";

const withoutDot = await glob("*", { onlyFiles: false });
const withDot = await glob("*", { dot: true, onlyFiles: false });

assert.equal(withoutDot.includes(".all-contributorsrc"), false);
assert.equal(withDot.includes(".all-contributorsrc"), true);
