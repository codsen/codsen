// Keep CSS comments

import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const source = `<style>.used{/* reason */color:red}</style>
<body class="used"></body>`;
const result = comb(source, { removeCSSComments: false }).result;

assert.equal(result.includes("/* reason */"), true);
