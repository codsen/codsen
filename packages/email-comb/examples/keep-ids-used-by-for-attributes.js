import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const source = `<body><label for="email-field">Email</label>
<input id="email-field"><input id="unused-field"></body>`;
const result = comb(source).result;

assert.equal(result.includes('id="email-field"'), true);
assert.equal(result.includes("unused-field"), false);
