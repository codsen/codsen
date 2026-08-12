// Quick Take

import { strict as assert } from "node:assert";

import { splitByW } from "../dist/string-split-by-whitespace.esm.js";

// Split on any whitespace and omit empty edge values.
assert.deepEqual(splitByW("\n     \n    a\t \nb    \n      \t"), ["a", "b"]);
