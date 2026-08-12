// Decode repeatedly encoded HTML

import { strict as assert } from "node:assert";

import { unfancy } from "../dist/string-unfancy.esm.js";

assert.equal(unfancy("it&amp;amp;rsquo;s ready"), "it's ready");
