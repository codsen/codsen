// Inspect the character and remainder after a match

import { strict as assert } from "node:assert";

import { matchRight } from "../dist/string-match-left-right.esm.js";

let context;
const result = matchRight("abcdef", 2, "de", {
  cb: (outsideCharacter, remainder, index) => {
    context = { outsideCharacter, remainder, index };
    return true;
  },
});

assert.equal(result, "de");
assert.deepEqual(context, {
  outsideCharacter: "f",
  remainder: "f",
  index: 5,
});
