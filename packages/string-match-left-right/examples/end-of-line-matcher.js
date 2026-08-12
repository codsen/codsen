// Match the start or end of a string

import { strict as assert } from "node:assert";

import { matchLeft, matchRight } from "../dist/string-match-left-right.esm.js";

const endOfLine = () => "EOL";

assert.equal(matchLeft("a", 0, endOfLine), "EOL");
assert.equal(matchRight("a", 0, endOfLine), "EOL");

assert.equal(
  matchLeft(" a", 1, endOfLine, { trimBeforeMatching: true }),
  "EOL",
);
