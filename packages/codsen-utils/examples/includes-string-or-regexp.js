// Match a string against literal and regular-expression choices

import { strict as assert } from "node:assert";

import { includes } from "../dist/codsen-utils.esm.js";

const choices = ["README.md", /\.test\.js$/];

assert.equal(includes(choices, "README.md"), true);
assert.equal(includes(choices, "main.test.js"), true);
assert.equal(includes(choices, "main.js"), false);
