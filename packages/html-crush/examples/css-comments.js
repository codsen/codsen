// Configure CSS comment removal

import { strict as assert } from "node:assert";

import { crush } from "../dist/html-crush.esm.js";

const source = "<style>/* note */ .a { color: red; }</style>";

assert.equal(crush(source).result, "<style>.a { color: red; }</style>");
assert.equal(
  crush(source, { removeCSSComments: false }).result,
  "<style>/* note */ .a { color: red; }</style>",
);
