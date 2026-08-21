// Trim selected characters from both string edges

import { strict as assert } from "node:assert";

import { trimChars } from "../dist/codsen-utils.esm.js";

assert.equal(trimChars("//article/>", "/>"), "article");
