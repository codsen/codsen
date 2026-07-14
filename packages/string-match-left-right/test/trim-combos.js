// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  // matchLeftIncl,
  // matchRightIncl,
  matchLeft,
  // matchRight,
} from "../dist/string-match-left-right.esm.js";

// trim combos - whitespace+character
// -----------------------------------------------------------------------------

test(`01 - matchLeft()       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(matchLeft("z a", 2, [() => "EOL"]), false, "01.01");
});

test(`02 - matchLeft()       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("z a", 2, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "02.01",
  );
});

test(`03 - matchLeft()       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(matchLeft("z a", 2, ["a", () => "EOL"]), false, "03.01");
});

test(`04 - matchLeft()       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("z a", 2, ["a", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "04.01",
  );
});

test(`05 - matchLeft()       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("z a", 2, ["z", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "z",
    "05.01",
  );
});

test(`06 - matchLeft()       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("z a", 2, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "06.01",
  );
});

test(`07 - matchLeft()       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("yz a", 2, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    false,
    "07.01",
  );
});

test.run();
