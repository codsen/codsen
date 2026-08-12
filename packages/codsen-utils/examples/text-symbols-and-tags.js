// Reuse shared text symbols and HTML tag sets

import { strict as assert } from "node:assert";

import {
  ellipsis,
  inlineTags,
  multiplicationSign,
  punctuationChars,
  rightSingleQuote,
  voidTags,
} from "../dist/codsen-utils.esm.js";

assert.equal(`that${rightSingleQuote}s`, "that’s");
assert.equal(`Wait${ellipsis}`, "Wait…");
assert.equal(`3 ${multiplicationSign} 4`, "3 × 4");
assert.equal(punctuationChars.includes("?"), true);
assert.equal(voidTags.includes("img"), true);
assert.equal(inlineTags.has("span"), true);
