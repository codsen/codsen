import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

// EOL matching
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(matchLeft("a", 0, "EOL"), false, "01");
});

test(`02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchLeft("a", 0, () => "EOL"),
    "EOL",
    "02"
  );
});

test(`03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - cb blocking result`, () => {
  equal(
    matchLeft("a", 0, () => "EOL", {
      cb: () => {
        return false;
      },
    }),
    false,
    "03"
  );
});

test(`04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`, () => {
  equal(
    matchLeft("a", 0, () => "EOL", {
      cb: () => {
        return true;
      },
    }),
    "EOL",
    "04"
  );
});

test(`05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`, () => {
  matchLeft("a", 0, () => "EOL", {
    cb: (...args) => {
      equal(
        args,
        [undefined, "", undefined] // because there's nothing outside-left of index 0
      );
      return true;
    },
  });
});

test(`06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`, () => {
  // whitespace trims:
  equal(
    matchLeft(" a", 1, () => "EOL"),
    false,
    "06"
  );
});

test(`07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - CHEEKY!!!`, () => {
  equal(
    matchLeft("EOLa", 3, () => "EOL"),
    false,
    "07"
  );
});

test(`08 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - !!!`, () => {
  equal(matchLeft("EOLa", 3, "EOL"), "EOL", "08");
});

test(`09 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`, () => {
  equal(
    matchLeft(" a", 1, () => "EOL", {
      trimBeforeMatching: true,
    }),
    "EOL",
    "09"
  );
});

test(`10 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`, () => {
  // character trims:
  equal(
    matchLeft("za", 1, () => "EOL"),
    false,
    "10"
  );
});

test(`11 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`, () => {
  equal(
    matchLeft("za", 1, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
    }),
    "EOL",
    "11"
  );
});

test(`12 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`, () => {
  // trim combos - whitespace+character:
  equal(
    matchLeft("z a", 2, () => "EOL"),
    false,
    "12"
  );
});

test(`13 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`, () => {
  equal(
    matchLeft("z a", 2, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "13"
  );
});

// EOL mixed with strings
// -----------------------------------------------------------------------------

test(`14 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, () => {
  equal(matchLeft("a", 0, ["EOL"]), false, "14");
});

test(`15 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, () => {
  equal(matchLeft("a", 0, ["EOL", "a"]), false, "15");
});

test(`16 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, () => {
  equal(matchLeft("a", 0, ["EOL", "z"]), false, "16");
});

test(`17 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, () => {
  equal(matchLeft("a", 0, ["EOL", () => "EOL"]), "EOL", "17");
});

test(`18 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`, () => {
  equal(matchLeft("a", 0, [() => "EOL"]), "EOL", "18");
});

test(`19 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m whitespace trims - whitespace trim opts control - one special`, () => {
  equal(matchLeft(" a", 1, [() => "EOL"]), false, "19");
});

test(`20 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(
    matchLeft(" a", 1, [() => "EOL", () => "EOL"]),
    false,
    "20 - whitespace trim opts control - two specials"
  );
});

test(`21 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(
    matchLeft(" a", 1, [() => "EOL", "EOL"]),
    false,
    "21 - whitespace trim opts control - special mixed with cheeky"
  );
});

test(`22 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(
    matchLeft(" a", 1, ["EOL"]),
    false,
    "22 - whitespace trim opts control - cheeky only"
  );
});

test(`23 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(matchLeft("EOLa", 3, [() => "EOL"]), false, "23 - CHEEKY!!!");
});

test(`24 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(matchLeft("EOLa", 3, ["EOL"]), "EOL", "24");
});

test(`25 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(matchLeft("EOLa", 3, ["a", () => "EOL"]), false, "25 - CHEEKY!!!");
});

test(`26 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(matchLeft("EOLa", 3, ["a", "EOL"]), "EOL", "26");
});

test(`27 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(
    matchLeft(" a", 1, [() => "EOL"], {
      trimBeforeMatching: true,
    }),
    "EOL",
    "27 - whitespace trim opt on"
  );
});

test(`28 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(
    matchLeft(" a", 1, ["a", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "EOL",
    "28 - whitespace trim opt on"
  );
});

test(`29 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(
    matchLeft(" a", 1, [() => "EOL", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "EOL",
    "29 - whitespace trim opt on"
  );
});

test(`30 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`, () => {
  equal(
    matchLeft(" a", 1, [() => "EOL", "a", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "EOL",
    "30 - whitespace trim opt on"
  );
});

// 15. futile matching - matchLeftIncl() from zero to the left
// ------------------------------------------------------------------------------

test(`31 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(matchLeftIncl("a", 0, "EOL"), false, "31");
});

test(`32 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchLeftIncl("a", 0, () => "EOL"),
    false,
    "32"
  );
});

test(`33 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchLeftIncl("a", 0, () => "EOL", {
      cb: () => {
        return false;
      },
    }),
    false,
    "33 - cb blocking result"
  );
});

test(`34 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchLeftIncl("a", 0, () => "EOL", {
      cb: () => {
        return true;
      },
    }),
    false,
    "34 - useless cb"
  );
});

test(`35 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchLeftIncl(" a", 1, () => "EOL"),
    false,
    "35 - whitespace trim opts control"
  );
});

test(`36 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchLeftIncl("EOLa", 3, () => "EOLa"),
    false,
    "36.01"
  );
  equal(matchLeftIncl("EOLa", 3, "EOL"), false, "36.02");
});

test(`37 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchLeftIncl(" a", 1, () => "EOL", {
      trimBeforeMatching: true,
    }),
    false,
    "37 - whitespace trim opt on"
  );
});

test(`38 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`, () => {
  equal(
    matchLeftIncl("za", 1, () => "EOL"),
    false,
    "38 - whitespace trim opts control"
  );
});

test(`39 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`, () => {
  equal(
    matchLeftIncl("za", 1, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
    }),
    false,
    "39 - whitespace trim opt on"
  );
});

test(`40 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, () => {
  // trim combos - whitespace+character:
  equal(
    matchLeftIncl("z a", 2, () => "EOL"),
    false,
    "40 - whitespace trim opts control"
  );
});

test(`41 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, () => {
  equal(
    matchLeftIncl("z a", 2, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    false,
    "41 - whitespace trim opt on"
  );
});

// 16. matchRight
// -----------------------------------------------------------------------------

test(`42 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(matchRight("a", 0, "EOL"), false, "42");
});

test(`43 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchRight("a", 0, () => "EOL"),
    "EOL",
    "43"
  );
});

test(`44 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchRight("a", 0, () => "EOL", {
      cb: () => {
        return false;
      },
    }),
    false,
    "44 - cb blocking result"
  );
});

test(`45 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchRight("a", 0, () => "EOL", {
      cb: () => {
        return true;
      },
    }),
    "EOL",
    "45 - useless cb, just confirms the incoming truthy result"
  );
});

test(`46 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  matchRight("a", 0, () => "EOL", {
    cb: (...args) => {
      equal(args, [undefined, "", undefined], "10.04.05 - useless cb");
      return true;
    },
  });
});

test(`47 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, () => "EOL"),
    false,
    "47-1"
  );
});

test(`48 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchRight("a ", 1, () => "EOL"),
    "EOL",
    "48-2"
  );
});

test(`49 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchRight("aEOL", 0, () => "EOL"),
    false,
    "49 - CHEEKY!!!"
  );
});

test(`50 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(matchRight("aEOL", 0, "EOL"), "EOL", "50 - !!!");
});

test(`51 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, () => "EOL", {
      trimBeforeMatching: true,
    }),
    "EOL",
    "51 - whitespace trim opt on"
  );
});

test(`52 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`, () => {
  equal(
    matchRight("az", 0, () => "EOL"),
    false,
    "52 - whitespace trim opts control"
  );
});

test(`53 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`, () => {
  equal(
    matchRight("az", 0, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
    }),
    "EOL",
    "53 - whitespace trim opt on"
  );
});

test(`54 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, () => {
  // trim combos - whitespace+character:
  equal(
    matchRight("a z", 0, () => "EOL"),
    false,
    "54 - whitespace trim opts control"
  );
});

test(`55 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, () => {
  equal(
    matchRight("a z", 2, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "55 - whitespace trim opt on"
  );
});

// 17. matchRight() - EOL mixed with strings
// -----------------------------------------------------------------------------

test(`56 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, () => {
  equal(matchRight("a", 0, ["EOL"]), false, "56");
});

test(`57 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, () => {
  equal(matchRight("a", 0, ["EOL", "a"]), false, "57");
});

test(`58 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, () => {
  equal(matchRight("a", 0, ["EOL", "z"]), false, "58");
});

test(`59 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, () => {
  equal(matchRight("a", 0, ["EOL", () => "EOL"]), "EOL", "59"); // latter, function was matched
});

test(`60 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`, () => {
  equal(matchRight("a", 0, [() => "EOL"]), "EOL", "60");
});

test(`61 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, [() => "EOL"]),
    false,
    "61 - whitespace trim opts control - one special"
  );
});

test(`62 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, [() => "EOL", () => "EOL"]),
    false,
    "62 - whitespace trim opts control - two specials"
  );
});

test(`63 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, [() => "EOL", "EOL"]),
    false,
    "63 - whitespace trim opts control - special mixed with cheeky"
  );
});

test(`64 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, ["EOL"]),
    false,
    "64 - whitespace trim opts control - cheeky only"
  );
});

test(`65 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(matchRight("aEOL", 0, [() => "EOL"]), false, "65 - CHEEKY!!!");
});

test(`66 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(matchRight("aEOL", 0, ["EOL"]), "EOL", "66");
});

test(`67 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(matchRight("aEOL", 0, ["z", () => "EOL"]), false, "67 - CHEEKY!!!");
});

test(`68 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(matchRight("aEOL", 0, ["z", "EOL"]), "EOL", "68");
});

test(`69 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, [() => "EOL"], {
      trimBeforeMatching: true,
    }),
    "EOL",
    "69 - array"
  );
});

test(`70 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, ["x", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "EOL",
    "70 - other values to match"
  );
});

test(`71 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, [() => "EOL", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "EOL",
    "71 - two identical arrow functions in array, both positive"
  );
});

test(`72 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`, () => {
  equal(
    matchRight("a ", 0, [() => "EOL", "z", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "EOL",
    "72 - two arrow f's in arrray + non-found"
  );
});

test(`73 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, () => {
  equal(matchRight("az", 0, [() => "EOL"]), false, "73 - trim off");
});

test(`74 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, () => {
  equal(
    matchRight("az", 0, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"],
    }),
    "EOL",
    "74 - character trim opt on"
  );
});

test(`75 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, () => {
  equal(
    matchRight("az", 0, ["x", () => "EOL"]),
    false,
    "75 - wrong character to trim"
  );
});

test(`76 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, () => {
  equal(
    matchRight("az", 0, ["z", () => "EOL"]),
    "z",
    "76 - z caught first, before EOL"
  );
});

test(`77 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`, () => {
  equal(
    matchRight("az", 0, ["a", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
    }),
    "EOL",
    "77 - whitespace trim opt on"
  );
});

test(`78 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, () => {
  // trim combos - whitespace+character:
  equal(
    matchRight("a z", 0, [() => "EOL"]),
    false,
    "78 - whitespace trim opts control"
  );
});

test(`79 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, () => {
  equal(
    matchRight("a z", 0, [() => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "79 - whitespace trim opt on"
  );
});

test(`80 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, () => {
  equal(
    matchRight("a z", 0, ["x", () => "EOL"]),
    false,
    "80 - whitespace trim opts control"
  );
});

test(`81 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, () => {
  equal(
    matchRight("a z", 0, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "81 - whitespace trim opt on"
  );
});

test(`82 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, () => {
  equal(
    matchRight("a z", 0, ["z", () => "EOL"], {
      trimBeforeMatching: true,
    }),
    "z",
    "82 - whitespace trim opts control"
  );
});

test(`83 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, () => {
  equal(
    matchRight("a z", 0, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    "EOL",
    "83 - unused char to trim"
  );
});

test(`84 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`, () => {
  equal(
    matchRight("a zy", 0, ["x", () => "EOL"], {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    false,
    "84 - y stands in the way"
  );
});

// EOL can never be found using matchRightIncl() or matchLeftIncl() because
// "inclusive" in the name means current character is included in the query to
// match, either in the beginning of it ("matchRightIncl") or end of it
// ("matchLeftIncl"). Since current character can't be EOL, result of both
// matchRightIncl() and matchLeftIncl() that search for EOL will always be "false".

test(`85 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(matchRightIncl("a", 0, "EOL"), false, "85");
});

test(`86 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchRightIncl("a", 0, () => "EOL"),
    false,
    "86"
  );
});

test(`87 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchRightIncl("a", 0, () => "EOL", {
      cb: () => {
        return false;
      },
    }),
    false,
    "87 - cb blocking, but still useless, result was false before cb kicked in"
  );
});

test(`88 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`, () => {
  equal(
    matchRightIncl("a", 0, () => "EOL", {
      cb: () => {
        return true;
      },
    }),
    false,
    "88 - useless cb"
  );
});

test(`89 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchRightIncl("a ", 0, () => "EOL"),
    false,
    "89 - whitespace trim opts control"
  );
});

test(`90 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchRightIncl("aEOL", 0, () => "aEOL"),
    false,
    "90"
  );
});

test(`91 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(matchRightIncl("aEOL", 0, "EOL"), false, "91");
});

test(`92 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`, () => {
  equal(
    matchRightIncl("a ", 0, () => "EOL", {
      trimBeforeMatching: true,
    }),
    false,
    "92 - whitespace trim opt on"
  );
});

test(`93 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`, () => {
  equal(
    matchRightIncl("az", 0, () => "EOL"),
    false,
    "93 - whitespace trim opts control"
  );
});

test(`94 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`, () => {
  equal(
    matchRightIncl("az", 0, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
    }),
    false,
    "94 - whitespace trim opt on"
  );
});

test(`95 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, () => {
  // whitespace+character:
  equal(
    matchRightIncl("a z", 0, () => "EOL"),
    false,
    "95 - whitespace trim opts control"
  );
});

test(`96 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`, () => {
  equal(
    matchRightIncl("a z", 0, () => "EOL", {
      trimCharsBeforeMatching: ["z"],
      trimBeforeMatching: true,
    }),
    false,
    "96 - whitespace trim + character trim"
  );
});

test.run();
