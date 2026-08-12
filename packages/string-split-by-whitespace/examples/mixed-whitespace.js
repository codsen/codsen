// Split on line breaks, tabs, and repeated spaces

import { strict as assert } from "node:assert";

import { splitByW } from "../dist/string-split-by-whitespace.esm.js";

assert.deepEqual(splitByW("one\n\ttwo   three"), ["one", "two", "three"]);
