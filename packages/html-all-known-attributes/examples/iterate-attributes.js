// Iterate through the known attributes

import { strict as assert } from "node:assert";

import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

const gathered = [];

for (const attribute of allHtmlAttribs) {
  if (gathered.length === 3) {
    break;
  }
  gathered.push(attribute);
}

assert.deepEqual(gathered, ["abbr", "accept", "accept-charset"]);
