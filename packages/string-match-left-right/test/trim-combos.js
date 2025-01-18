import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  // matchLeftIncl,
  // matchRightIncl,
  matchLeft,
  // matchRight,
} from "../dist/string-match-left-right.esm.js";

// trim combos - whitespace+character
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(matchLeft("z a", 2, [() => "EOL"]), false, "01.01");
});

test(`02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("z a", 2, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "02.01",
  );
});

test(`03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(matchLeft("z a", 2, ["a", () => "EOL"]), false, "03.01");
});

test(`04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("z a", 2, ["a", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "04.01",
  );
});

test(`05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("z a", 2, ["z", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "z",
    "05.01",
  );
});

test(`06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
  equal(
    matchLeft("z a", 2, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "06.01",
  );
});

test(`07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`, () => {
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
