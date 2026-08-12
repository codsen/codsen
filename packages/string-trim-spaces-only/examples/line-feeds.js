// Include line feeds in the configured trim set

import { strict as assert } from "node:assert";

import { trimSpaces } from "../dist/string-trim-spaces-only.esm.js";

assert.equal(trimSpaces("\n  value  \n", { lf: true }).res, "value");
