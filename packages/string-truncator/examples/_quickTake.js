// Quick Take

import { strict as assert } from "assert";

import { truncate } from "../dist/string-truncator.esm.js";

// maxLen setting means limit length to equivalent of 10
// longest letter lengths (font "Outfit" letter lengths are used)
// and you can override those references with your font-specific lengths
assert.deepEqual(truncate("Supermotodelicious", { maxLen: 10 }), {
  result: "Supermotodelic",
  addEllipsis: true,
});

assert.deepEqual(
  truncate(
    "the quick brown fox jumps over the lazy dog and then bites him in the tail and runs away",
    {
      maxLen: 10,
      maxLines: 2,
    }
  ),
  {
    result: "the quick brown fox jumps over",
    addEllipsis: true,
  }
);
