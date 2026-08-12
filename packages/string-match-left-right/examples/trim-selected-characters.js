// Skip selected characters before matching

import { strict as assert } from "node:assert";

import { matchRight } from "../dist/string-match-left-right.esm.js";

assert.equal(matchRight("</div>", 0, "div"), false);
assert.equal(
  matchRight("</div>", 0, "div", { trimCharsBeforeMatching: "/" }),
  "div",
);
