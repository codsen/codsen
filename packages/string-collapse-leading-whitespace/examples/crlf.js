// Preserve CRLF line endings

import { strict as assert } from "node:assert";

import { collWhitespace } from "../dist/string-collapse-leading-whitespace.esm.js";

assert.equal(
  collWhitespace("\r\n\r\n\r\ncontent\r\n\r\n\r\n", 2),
  "\r\n\r\ncontent\r\n\r\n",
);
