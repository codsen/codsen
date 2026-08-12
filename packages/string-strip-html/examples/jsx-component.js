// Strip a JSX component tag from surrounding text

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml('before <Component name="demo" /> after').result,
  "before after",
);
