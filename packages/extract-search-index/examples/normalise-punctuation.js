// Normalise fancy punctuation and omit digits and emoji

import { strict as assert } from "node:assert";

import { extract } from "../dist/extract-search-index.esm.js";

assert.equal(extract("Fancy “quotes” — and café 123 😊"), "fancy quotes café");
