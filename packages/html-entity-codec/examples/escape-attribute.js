// Escape a quoted attribute value
import assert from "node:assert/strict";
import { escapeAttribute } from "../dist/html-entity-codec.esm.js";

assert.equal(
  escapeAttribute('A "quote" & more'),
  "A &quot;quote&quot; &amp; more",
);
