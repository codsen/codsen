// Keep the first occurrence of each case-insensitive word

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(extract("Alpha alpha ALPHA beta"), "alpha beta");
