// Add an alt attribute while preserving XHTML closing syntax

import { strict as assert } from "node:assert";

import { alts } from "../dist/html-img-alt.esm.js";

assert.equal(
  alts('<img src="spacer.gif"/>'),
  '<img src="spacer.gif" alt="" />',
);
