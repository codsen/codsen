// Normalise an HTML-encoded typographic character

import { strict as assert } from "node:assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

assert.equal(unfancy("someone&rsquo;s"), "someone's");
