// Put a retained link destination on a new paragraph

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml('<a href="https://example.com/docs">Read the docs</a>', {
    dumpLinkHrefsNearby: { enabled: true, putOnNewLine: true },
  }).result,
  "Read the docs\n\nhttps://example.com/docs",
);
