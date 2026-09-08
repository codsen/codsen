// Preserve whitespace that terminates CSS escapes

import { strict as assert } from "node:assert";
import { crush } from "../dist/html-crush.esm.js";

const html = String.raw`<style>.\31  a{color:red}</style>`;
assert.equal(crush(html).result, html);
assert.equal(
  crush(html, { removeLineBreaks: true, breakToTheLeftOf: [] }).result,
  html,
);
