import tap from "tap";
import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm";

// EOL matching
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(matchLeft("a", 0, "EOL"), false, "01");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchLeft("a", 0, () => "EOL"),
      "EOL",
      "02"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - cb blocking result`,
  (t) => {
    t.equal(
      matchLeft("a", 0, () => "EOL", {
        cb: () => {
          return false;
        },
      }),
      false,
      "03"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`,
  (t) => {
    t.equal(
      matchLeft("a", 0, () => "EOL", {
        cb: () => {
          return true;
        },
      }),
      "EOL",
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`,
  (t) => {
    matchLeft("a", 0, () => "EOL", {
      cb: (...args) => {
        t.same(
          args,
          [undefined, "", undefined] // because there's nothing outside-left of index 0
        );
        return true;
      },
    });
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  (t) => {
    // whitespace trims:
    t.equal(
      matchLeft(" a", 1, () => "EOL"),
      false,
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - CHEEKY!!!`,
  (t) => {
    t.equal(
      matchLeft("EOLa", 3, () => "EOL"),
      false,
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - !!!`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, "EOL"), "EOL", "08");
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, () => "EOL", {
        trimBeforeMatching: true,
      }),
      "EOL",
      "09"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  (t) => {
    // character trims:
    t.equal(
      matchLeft("za", 1, () => "EOL"),
      false,
      "10"
    );
    t.end();
  }
);

tap.test(
  `11 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  (t) => {
    t.equal(
      matchLeft("za", 1, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "11"
    );
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  (t) => {
    // trim combos - whitespace+character:
    t.equal(
      matchLeft("z a", 2, () => "EOL"),
      false,
      "12"
    );
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  (t) => {
    t.equal(
      matchLeft("z a", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "13"
    );
    t.end();
  }
);

// EOL mixed with strings
// -----------------------------------------------------------------------------

tap.test(
  `14 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, ["EOL"]), false, "14");
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, ["EOL", "a"]), false, "15");
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, ["EOL", "z"]), false, "16");
    t.end();
  }
);

tap.test(
  `17 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, ["EOL", () => "EOL"]), "EOL", "17");
    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, [() => "EOL"]), "EOL", "18");
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m whitespace trims - whitespace trim opts control - one special`,
  (t) => {
    t.equal(matchLeft(" a", 1, [() => "EOL"]), false, "19");
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", () => "EOL"]),
      false,
      "20 - whitespace trim opts control - two specials"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", "EOL"]),
      false,
      "21 - whitespace trim opts control - special mixed with cheeky"
    );
    t.end();
  }
);

tap.test(
  `22 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, ["EOL"]),
      false,
      "22 - whitespace trim opts control - cheeky only"
    );
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, [() => "EOL"]), false, "23 - CHEEKY!!!");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, ["EOL"]), "EOL", "24");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, ["a", () => "EOL"]), false, "25 - CHEEKY!!!");
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, ["a", "EOL"]), "EOL", "26");
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "27 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, ["a", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "28 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "29 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", "a", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "30 - whitespace trim opt on"
    );
    t.end();
  }
);

// 15. futile matching - matchLeftIncl() from zero to the left
// ------------------------------------------------------------------------------

tap.test(
  `31 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(matchLeftIncl("a", 0, "EOL"), false, "31");
    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL"),
      false,
      "32"
    );
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL", {
        cb: () => {
          return false;
        },
      }),
      false,
      "33 - cb blocking result"
    );
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL", {
        cb: () => {
          return true;
        },
      }),
      false,
      "34 - useless cb"
    );
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchLeftIncl(" a", 1, () => "EOL"),
      false,
      "35 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchLeftIncl("EOLa", 3, () => "EOLa"),
      false,
      "36.01"
    );
    t.equal(matchLeftIncl("EOLa", 3, "EOL"), false, "36.02");
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchLeftIncl(" a", 1, () => "EOL", {
        trimBeforeMatching: true,
      }),
      false,
      "37 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchLeftIncl("za", 1, () => "EOL"),
      false,
      "38 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchLeftIncl("za", 1, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
      }),
      false,
      "39 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    // trim combos - whitespace+character:
    t.equal(
      matchLeftIncl("z a", 2, () => "EOL"),
      false,
      "40 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    t.equal(
      matchLeftIncl("z a", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      false,
      "41 - whitespace trim opt on"
    );
    t.end();
  }
);

// 16. matchRight
// -----------------------------------------------------------------------------

tap.test(
  `42 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(matchRight("a", 0, "EOL"), false, "42");
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRight("a", 0, () => "EOL"),
      "EOL",
      "43"
    );
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRight("a", 0, () => "EOL", {
        cb: () => {
          return false;
        },
      }),
      false,
      "44 - cb blocking result"
    );
    t.end();
  }
);

tap.test(
  `45 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRight("a", 0, () => "EOL", {
        cb: () => {
          return true;
        },
      }),
      "EOL",
      "45 - useless cb, just confirms the incoming truthy result"
    );
    t.end();
  }
);

tap.test(
  `46 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    matchRight("a", 0, () => "EOL", {
      cb: (...args) => {
        t.same(args, [undefined, "", undefined], "10.04.05 - useless cb");
        return true;
      },
    });
    t.end();
  }
);

tap.test(
  `47 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, () => "EOL"),
      false,
      "47-1"
    );
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 1, () => "EOL"),
      "EOL",
      "48-2"
    );
    t.end();
  }
);

tap.test(
  `49 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("aEOL", 0, () => "EOL"),
      false,
      "49 - CHEEKY!!!"
    );
    t.end();
  }
);

tap.test(
  `50 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, "EOL"), "EOL", "50 - !!!");
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, () => "EOL", {
        trimBeforeMatching: true,
      }),
      "EOL",
      "51 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `52 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, () => "EOL"),
      false,
      "52 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "53 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    // trim combos - whitespace+character:
    t.equal(
      matchRight("a z", 0, () => "EOL"),
      false,
      "54 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `55 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "55 - whitespace trim opt on"
    );
    t.end();
  }
);

// 17. matchRight() - EOL mixed with strings
// -----------------------------------------------------------------------------

tap.test(
  `56 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, ["EOL"]), false, "56");
    t.end();
  }
);

tap.test(
  `57 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, ["EOL", "a"]), false, "57");
    t.end();
  }
);

tap.test(
  `58 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, ["EOL", "z"]), false, "58");
    t.end();
  }
);

tap.test(
  `59 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, ["EOL", () => "EOL"]), "EOL", "59"); // latter, function was matched
    t.end();
  }
);

tap.test(
  `60 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, [() => "EOL"]), "EOL", "60");
    t.end();
  }
);

tap.test(
  `61 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL"]),
      false,
      "61 - whitespace trim opts control - one special"
    );
    t.end();
  }
);

tap.test(
  `62 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", () => "EOL"]),
      false,
      "62 - whitespace trim opts control - two specials"
    );
    t.end();
  }
);

tap.test(
  `63 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", "EOL"]),
      false,
      "63 - whitespace trim opts control - special mixed with cheeky"
    );
    t.end();
  }
);

tap.test(
  `64 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, ["EOL"]),
      false,
      "64 - whitespace trim opts control - cheeky only"
    );
    t.end();
  }
);

tap.test(
  `65 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, [() => "EOL"]), false, "65 - CHEEKY!!!");
    t.end();
  }
);

tap.test(
  `66 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, ["EOL"]), "EOL", "66");
    t.end();
  }
);

tap.test(
  `67 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, ["z", () => "EOL"]), false, "67 - CHEEKY!!!");
    t.end();
  }
);

tap.test(
  `68 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, ["z", "EOL"]), "EOL", "68");
    t.end();
  }
);

tap.test(
  `69 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "69 - array"
    );
    t.end();
  }
);

tap.test(
  `70 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, ["x", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "70 - other values to match"
    );
    t.end();
  }
);

tap.test(
  `71 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "71 - two identical arrow functions in array, both positive"
    );
    t.end();
  }
);

tap.test(
  `72 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", "z", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "72 - two arrow f's in arrray + non-found"
    );
    t.end();
  }
);

tap.test(
  `73 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(matchRight("az", 0, [() => "EOL"]), false, "73 - trim off");
    t.end();
  }
);

tap.test(
  `74 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "74 - character trim opt on"
    );
    t.end();
  }
);

tap.test(
  `75 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, ["x", () => "EOL"]),
      false,
      "75 - wrong character to trim"
    );
    t.end();
  }
);

tap.test(
  `76 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, ["z", () => "EOL"]),
      "z",
      "76 - z caught first, before EOL"
    );
    t.end();
  }
);

tap.test(
  `77 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, ["a", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "77 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `78 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    // trim combos - whitespace+character:
    t.equal(
      matchRight("a z", 0, [() => "EOL"]),
      false,
      "78 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `79 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "79 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `80 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"]),
      false,
      "80 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `81 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "81 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `82 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, ["z", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "z",
      "82 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `83 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "83 - unused char to trim"
    );
    t.end();
  }
);

tap.test(
  `84 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a zy", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      false,
      "84 - y stands in the way"
    );
    t.end();
  }
);

// EOL can never be found using matchRightIncl() or matchLeftIncl() because
// "inclusive" in the name means current character is included in the query to
// match, either in the beginning of it ("matchRightIncl") or end of it
// ("matchLeftIncl"). Since current character can't be EOL, result of both
// matchRightIncl() and matchLeftIncl() that search for EOL will always be "false".

tap.test(
  `85 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(matchRightIncl("a", 0, "EOL"), false, "85");
    t.end();
  }
);

tap.test(
  `86 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL"),
      false,
      "86"
    );
    t.end();
  }
);

tap.test(
  `87 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL", {
        cb: () => {
          return false;
        },
      }),
      false,
      "87 - cb blocking, but still useless, result was false before cb kicked in"
    );
    t.end();
  }
);

tap.test(
  `88 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL", {
        cb: () => {
          return true;
        },
      }),
      false,
      "88 - useless cb"
    );
    t.end();
  }
);

tap.test(
  `89 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRightIncl("a ", 0, () => "EOL"),
      false,
      "89 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `90 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRightIncl("aEOL", 0, () => "aEOL"),
      false,
      "90"
    );
    t.end();
  }
);

tap.test(
  `91 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(matchRightIncl("aEOL", 0, "EOL"), false, "91");
    t.end();
  }
);

tap.test(
  `92 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRightIncl("a ", 0, () => "EOL", {
        trimBeforeMatching: true,
      }),
      false,
      "92 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `93 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchRightIncl("az", 0, () => "EOL"),
      false,
      "93 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `94 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchRightIncl("az", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
      }),
      false,
      "94 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `95 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    // whitespace+character:
    t.equal(
      matchRightIncl("a z", 0, () => "EOL"),
      false,
      "95 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `96 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    t.equal(
      matchRightIncl("a z", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      false,
      "96 - whitespace trim + character trim"
    );
    t.end();
  }
);
