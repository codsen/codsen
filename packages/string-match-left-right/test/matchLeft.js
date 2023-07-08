import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  // matchLeftIncl,
  // matchRightIncl,
  matchLeft,
  // matchRight,
} from "../dist/string-match-left-right.esm.js";

// matchLeft()
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          on a simple string`, () => {
  equal(matchLeft("abc", 2, "b"), "b", "01.01");
  equal(matchLeft("abcdefghi", 3, ["abc"]), "abc", "01.02");
  equal(
    matchLeft("abcdefghi", 3, ["c", "bc"]),
    "c", // first one matched returned, although both did match
    "01.03",
  );
  equal(matchLeft("abcdefghi", 3, ["aaa", "bc"]), "bc", "01.04");
  equal(matchLeft("abcdefghi", 3, ["aaa", "zzz"]), false, "01.05");
  equal(matchLeft("abcdefghi", 99, ["aaa", "zzz"]), false, "01.06");
  equal(matchLeft("abc", 2, "zab"), false, "01.07");
});

test(`02 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          case insensitive`, () => {
  equal(matchLeft("abc", 2, "B"), false, "02.01");
  equal(matchLeft("abc", 2, "B", { i: true }), "B", "02.02");
});

test(`03 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, three-char set`, () => {
  //
  // first char, "d" is dot
  equal(
    matchLeft("_abc.efghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false, // that's "d"
      lastMustMatch: false, // that's "b"
      hungry: false,
    }),
    false,
    "03.01",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false, // that's "d"
      lastMustMatch: false, // that's "b"
      hungry: true,
    }),
    "bcd",
    "03.02",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true, // that's "d"
      lastMustMatch: false, // that's "b"
    }),
    false, // because "d" was not matched
    "03.03",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false, // that's "d"
      lastMustMatch: true, // that's "b"
      hungry: false,
    }),
    false,
    "03.04",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false, // that's "d"
      lastMustMatch: true, // that's "b"
      hungry: true,
    }),
    "bcd",
    "03.05",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true, // that's "d"
      lastMustMatch: true, // that's "b"
    }),
    false,
    "03.06",
  );

  //
  // second char, "c" is dot
  equal(
    matchLeft("_ab.defghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false, // that's "d"
      lastMustMatch: false, // that's "b"
    }),
    "bcd",
    "03.07",
  );
  equal(
    matchLeft("_ab.defghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true, // that's "d"
      lastMustMatch: false, // that's "b"
    }),
    "bcd",
    "03.08",
  );
  equal(
    matchLeft("_ab.defghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false, // that's "d"
      lastMustMatch: true, // that's "b"
    }),
    "bcd",
    "03.09",
  );
  equal(
    matchLeft("_ab.defghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true, // that's "d"
      lastMustMatch: true, // that's "b"
    }),
    "bcd",
    "03.10",
  );

  //
  // third char, "b" is dot
  equal(
    matchLeft("_a.cdefghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false, // that's "d"
      lastMustMatch: true, // that's "b"
    }),
    false,
    "03.11",
  );
  equal(
    matchLeft("_a.cdefghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true, // that's "d"
      lastMustMatch: true, // that's "b"
    }),
    false,
    "03.12",
  );
  equal(
    matchLeft("_a.cdefghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false, // that's "d"
      lastMustMatch: false, // that's "b"
    }),
    "bcd",
    "03.13",
  );
  equal(
    matchLeft("_a.cdefghi", 5, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true, // that's "d"
      lastMustMatch: false, // that's "b"
    }),
    "bcd",
    "03.14",
  );
});

test(`04 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, two-char set`, () => {
  // lastMustMatch=false
  equal(
    matchLeft("_abc.efghi", 5, ["zc"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    false,
    "04.01",
  );
  equal(
    matchLeft("_abc.efghi", 4, ["zc"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    "zc",
    "04.02",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["cz"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    false,
    "04.03",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["cz"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
    }),
    false,
    "04.04",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["cz"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
      hungry: false,
    }),
    false,
    "04.05",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["cz"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
      hungry: true,
    }),
    "cz",
    "04.06",
  );

  // lastMustMatch=true
  equal(
    matchLeft("_abc.efghi", 5, ["zc"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    false,
    "04.07",
  );
  equal(
    matchLeft("_abc.efghi", 4, ["zc"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    false,
    "04.08",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["cz"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    false,
    "04.09",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["cz"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
    }),
    false,
    "04.10",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["cz"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
      hungry: false,
    }),
    false,
    "04.11",
  );
  equal(
    matchLeft("_abc.efghi", 5, ["cz"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
      hungry: true,
    }),
    "cz",
    "04.12",
  );
});

test(`05 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, pin the maxMismatches cut-off point, protruding value`, () => {
  //
  // firstMustMatch = true
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 1,
      firstMustMatch: true,
    }),
    false,
    "05.01",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 2,
      firstMustMatch: true,
    }),
    false,
    "05.02",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 3,
      firstMustMatch: true,
    }),
    false,
    "05.03",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 4,
      firstMustMatch: true,
    }),
    false,
    "05.04",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 5,
      firstMustMatch: true,
    }),
    ".....d",
    "05.05",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 99,
      firstMustMatch: true,
    }),
    ".....d",
    "05.06",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 0,
      firstMustMatch: true,
    }),
    false,
    "05.07",
  );

  //
  // firstMustMatch = false
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 1,
      firstMustMatch: false,
    }),
    false,
    "05.08",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 2,
      firstMustMatch: false,
    }),
    false,
    "05.09",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 3,
      firstMustMatch: false,
    }),
    false,
    "05.10",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 4,
      firstMustMatch: false,
    }),
    false,
    "05.11",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 5,
      firstMustMatch: false,
    }),
    ".....d",
    "05.12",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 99,
      firstMustMatch: false,
    }),
    ".....d",
    "05.13",
  );
  equal(
    matchLeft("_abcdef", 5, [".....d"], {
      maxMismatches: 0,
      firstMustMatch: false,
    }),
    false,
    "05.14",
  );
});

test(`06 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, pin the maxMismatches cut-off point, non-protruding value`, () => {
  equal(
    matchLeft("_abcdef", 5, ["....d"], {
      maxMismatches: 1,
      firstMustMatch: true,
    }),
    false,
    "06.01",
  );
  equal(
    matchLeft("_abcdef", 5, ["....d"], {
      maxMismatches: 2,
      firstMustMatch: true,
    }),
    false,
    "06.02",
  );
  equal(
    matchLeft("_abcdef", 5, ["....d"], {
      maxMismatches: 3,
      firstMustMatch: true,
    }),
    false,
    "06.03",
  );
  equal(
    matchLeft("_abcdef", 5, ["....d"], {
      maxMismatches: 4,
      firstMustMatch: true,
    }),
    "....d",
    "06.04",
  );
  equal(
    matchLeft("_abcdef", 5, ["....d"], {
      maxMismatches: 5,
      firstMustMatch: true,
    }),
    "....d",
    "06.05",
  );
  equal(
    matchLeft("_abcdef", 5, ["....d"], {
      maxMismatches: 99,
      firstMustMatch: true,
    }),
    "....d",
    "06.06",
  );
  equal(
    matchLeft("_abcdef", 5, ["....d"], {
      maxMismatches: 0,
      firstMustMatch: true,
    }),
    false,
    "06.07",
  );
});

test.run();
