// Include raw non-breaking spaces in the configured trim set

import { strict as assert } from "node:assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.equal(trimSpaces("\u00a0  value  \u00a0", { nbsp: true }).res, "value");
