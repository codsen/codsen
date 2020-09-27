/* eslint import/extensions:0 */

// Quick Take

import { strict as assert } from "assert";
import { allHtmlAttribs } from "../dist/html-all-known-attributes.esm.js";

assert.equal(allHtmlAttribs.has("href"), true);

assert.equal(allHtmlAttribs.size, 702);

// iterating:
const gathered = [];
for (const x of allHtmlAttribs) {
  // push first three
  if (gathered.length < 3) {
    gathered.push(x);
  }
}
assert.deepEqual(gathered, ["abbr", "accept", "accept-charset"]);
