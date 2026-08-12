// Reject a character that is not a digit

import { strict as assert } from "node:assert";

import { isNumberChar } from "../dist/codsen-utils.esm.js";

assert.equal(isNumberChar("z"), false);
