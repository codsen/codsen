// Whitelist a selector from removal

import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const source = `<style>.dynamic{color:red}.unused{color:blue}</style>
<body></body>`;
const result = comb(source, { whitelist: ".dynamic" }).result;

assert.equal(result.includes(".dynamic{color:red}"), true);
assert.equal(result.includes(".unused"), false);
