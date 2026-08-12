// Include carriage returns in the configured trim set

import { strict as assert } from "node:assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.equal(trimSpaces("\r  value  \r", { cr: true }).res, "value");
