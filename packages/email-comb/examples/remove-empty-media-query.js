// Remove media queries left empty

import { strict as assert } from "node:assert";

import { comb } from "../dist/email-comb.esm.js";

const source = `<style>@media screen {.unused{display:none}}</style>
<body></body>`;

assert.equal(comb(source).result.includes("@media"), false);
