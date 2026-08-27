// Isolate a selector prelude before extraction

import { strict as assert } from "node:assert";

import { extract } from "../dist/string-extract-class-names.esm.js";

const cssRule =
  '.real { color: #fff; background: url("/icons/icon.svg#mark"); content: ".not-a-selector"; }';

// In production, let a CSS parser isolate the selector prelude. This slice keeps
// the example short; passing the complete rule would also match declaration data.
const selectorPrelude = cssRule.slice(0, cssRule.indexOf("{"));

assert.deepEqual(extract(selectorPrelude).res, [".real"]);

// HTML character references belong to the HTML parser and must be decoded there
// before selector input is constructed. extract() handles CSS escapes instead;
// it does not decode a literal spelling such as &copy;.
