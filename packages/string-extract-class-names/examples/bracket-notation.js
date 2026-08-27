// Extract selectors from HTML-style attribute selectors

import { strict as assert } from "node:assert";

import { extract } from "../dist/string-extract-class-names.esm.js";

const source = String.raw`td[class=" alpha \31 beta "][class~=gamma][id=_main]`;

// Attribute names use HTML's ASCII-case-insensitive matching. Exact class
// strings can contain multiple class tokens, and values can use CSS escapes.
assert.deepEqual(extract(source), {
  res: [".alpha", String.raw`.\31 beta`, ".gamma", "#_main"],
  ranges: [
    [11, 16],
    [17, 25],
    [36, 41],
    [46, 51],
  ],
});

// The synthetic dot and hash are not covered by the source ranges.
