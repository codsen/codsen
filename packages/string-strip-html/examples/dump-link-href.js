// Keep a link destination next to its label

import { strict as assert } from "node:assert";

import { stripHtml } from "../dist/string-strip-html.esm.js";

assert.equal(
  stripHtml('<a href="https://example.com/docs">Read the docs</a>', {
    dumpLinkHrefsNearby: { enabled: true },
  }).result,
  "Read the docs https://example.com/docs",
);
