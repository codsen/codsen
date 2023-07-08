// Empty Strings

import { strict as assert } from "assert";

import { overlap } from "../dist/string-overlap-one-on-another.esm.js";

assert.equal(
  overlap("", "456", { offset: 99, offsetFillerCharacter: "zzzz" }),
  "456",
);
// even though offset is long enough to warrant the filler, no characters
// are added to the "456" because the first argument string is empty.
