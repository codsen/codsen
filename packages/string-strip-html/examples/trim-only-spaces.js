// Trim ordinary spaces while preserving tabs and line breaks

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml(" \t a \n ", { trimOnlySpaces: true }).result,
  "\t a \n",
);
