import { strict as assert } from "node:assert";

import { convertOne } from "../dist/string-dashes.esm.js";

// Parsers can supply the logical character separately from their source text.
assert.deepEqual(
  convertOne("pages 1?2", {
    from: 7,
    to: 8,
    value: "-",
    convertEntities: true,
  }),
  [[7, 8, "&ndash;"]],
);
