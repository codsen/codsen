// Normalize typography and surrounding spaces in alt text

import { strict as assert } from "node:assert";

import { alts } from "../dist/html-img-alt.esm.js";

assert.equal(
  alts('<img alt=" The new offer — 50% discount " >'),
  '<img alt="The new offer - 50% discount" >',
);
