// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import {
  // matchRightIncl,
  matchLeft,
  matchLeftIncl,
  // matchRight,
} from "../dist/string-match-left-right.esm.js";

// matchLeftIncl()
// -----------------------------------------------------------------------------

test(`01 - matchLeftIncl()      on a simple string`, () => {
  equal(matchLeftIncl("abc", 2, "c"), "c", "01.01");
  equal(matchLeftIncl("zabcdefghi", 4, ["bcd"]), "bcd", "01.02");
  equal(
    matchLeftIncl("abcdefghi", 3, ["cd", "bcd"]),
    "cd", // first match
    "01.03",
  );
  equal(matchLeftIncl("abcdefghi", 3, ["aaa", "bcd"]), "bcd", "01.04");
  equal(matchLeftIncl("abcdefghi", 3, ["aaa", "zzz"]), false, "01.05");
  equal(matchLeftIncl("abcdefghi", 99, ["aaa", "zzz"]), false, "01.06");

  equal(
    matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
      trimBeforeMatching: true,
    }),
    "ab",
    "01.07",
  );

  equal(
    matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
      trimBeforeMatching: true,
      cb: (characterAfter, theRemainderOfTheString, index) => {
        equal(characterAfter, "x", "01.09");
        equal(theRemainderOfTheString, "zx", "01.10");
        equal(index, 1, "01.11");
        return true;
      },
    }),
    "ab",
    "01.08",
  );
});

test(`02 - matchLeftIncl()      case insensitive`, () => {
  equal(matchLeftIncl("abc", 2, "C"), false, "02.01");
  equal(matchLeftIncl("abc", 2, "C", { i: true }), "C", "02.02");
  equal(matchLeftIncl("abc", 2, "BC", { i: true }), "BC", "02.03");
  equal(matchLeftIncl("abC", 2, "c", { i: true }), "c", "02.04");
});

test(`03 - matchLeftIncl()      left substring to check is longer than what's on the left`, () => {
  equal(matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"]), false, "03.01");
  equal(
    matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"], { i: true }),
    false,
    "03.02",
  );
});

test(`04 - matchLeftIncl()     cb gives outside index which is outside of string length`, () => {
  equal(
    matchLeftIncl("abcdef", 3, ["abcd"], {
      cb: (char, theRemainderOfTheString, index) => {
        equal(char, undefined, "04.02");
        equal(theRemainderOfTheString, "", "04.03");
        equal(index, undefined, "04.04");
        return true;
      },
    }),
    "abcd",
    "04.01",
  );
});

test(`05 - matchLeftIncl()      opts.maxMismatches === 1, one char`, () => {
  equal(matchLeftIncl("abc", 2, "c"), "c", "05.01");
  equal(
    matchLeftIncl("abcd", 2, "c", {
      maxMismatches: 1,
    }),
    "c",
    "05.02",
  );
  equal(
    matchLeft("abcd", 3, "c", {
      maxMismatches: 1,
    }),
    "c",
    "05.03",
  );

  // at least something from the set must have been matched! In this case,
  // the set is one character and it was not matched, so no characters from
  // the set were matched
  equal(
    matchLeftIncl("abc", 2, "x", {
      maxMismatches: 1,
    }),
    false, // <-- because at least one character must have been matched (general rule)
    "05.04",
  );
  equal(
    matchLeft("abc", 2, "x", {
      maxMismatches: 1,
    }),
    false, // <-- because at least one character must have been matched (general rule)
    "05.05",
  );
});

test(`06 - matchLeftIncl()      opts.maxMismatches === 1, omitted char`, () => {
  equal(
    matchLeftIncl("_abdefghi", 3, ["bcd"], {
      maxMismatches: 1,
    }),
    "bcd",
    "06.01",
  );
  equal(
    matchLeft("_abdefghi", 4, ["bcd"], {
      maxMismatches: 1,
    }),
    "bcd",
    "06.02",
  );
});

test(`07 - matchLeftIncl()      opts.maxMismatches === 1, one char`, () => {
  // hungry=false

  equal(
    matchLeftIncl("_abc.efghi", 4, ["bcd"], {
      maxMismatches: 1,
      hungry: false,
    }),
    false,
    "07.01",
  );
  equal(
    matchLeftIncl("_ab.defghi", 4, ["bcd"], {
      maxMismatches: 1,
      hungry: false,
    }),
    "bcd",
    "07.02",
  );
  equal(
    matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
      maxMismatches: 1,
      hungry: false,
    }),
    "bcd",
    "07.03",
  );
  equal(
    matchLeftIncl(".cdefghi", 2, ["bcd"], {
      maxMismatches: 1,
      hungry: false,
    }),
    "bcd",
    "07.04",
  );
  equal(
    matchLeftIncl("cdefghi", 1, ["bcd"], {
      maxMismatches: 1,
      hungry: false,
    }),
    "bcd",
    "07.05",
  );
  equal(
    matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
      maxMismatches: 99,
      hungry: false,
    }),
    "bcd",
    "07.06",
  );

  // hungry=true

  equal(
    matchLeftIncl("_abc.efghi", 4, ["bcd"], {
      maxMismatches: 1,
      hungry: true,
    }),
    "bcd",
    "07.07",
  );
  equal(
    matchLeftIncl("_ab.defghi", 4, ["bcd"], {
      maxMismatches: 1,
      hungry: true,
    }),
    "bcd",
    "07.08",
  );
  equal(
    matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
      maxMismatches: 1,
      hungry: true,
    }),
    "bcd",
    "07.09",
  );
  equal(
    matchLeftIncl(".cdefghi", 2, ["bcd"], {
      maxMismatches: 1,
      hungry: true,
    }),
    "bcd",
    "07.10",
  );
  equal(
    matchLeftIncl("cdefghi", 1, ["bcd"], {
      maxMismatches: 1,
      hungry: true,
    }),
    "bcd",
    "07.11",
  );
  equal(
    matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
      maxMismatches: 99,
      hungry: true,
    }),
    "bcd",
    "07.12",
  );
});

test(`08 - matchLeftIncl()          opts.maxMismatches === 1, three char set`, () => {
  equal(
    matchLeftIncl("_abc.efghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
      hungry: true,
    }),
    "bcd",
    "08.01",
  );
  equal(
    matchLeftIncl("_abc.efghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    false,
    "08.02",
  );

  equal(
    matchLeftIncl("_abc.efghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
      hungry: true,
    }),
    "bcd",
    "08.03",
  );
  equal(
    matchLeftIncl("_abc.efghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    false,
    "08.04",
  );

  equal(
    matchLeftIncl("_ab.defghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
    }),
    "bcd",
    "08.05",
  );
  equal(
    matchLeftIncl("_ab.defghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    "bcd",
    "08.06",
  );

  equal(
    matchLeftIncl("_ab.defghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
    }),
    "bcd",
    "08.07",
  );
  equal(
    matchLeftIncl("_ab.defghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    "bcd",
    "08.08",
  );

  equal(
    matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
    }),
    false,
    "08.09",
  );
  equal(
    matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    false,
    "08.10",
  );

  equal(
    matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
    }),
    "bcd",
    "08.11",
  );
  equal(
    matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    "bcd",
    "08.12",
  );
});

test(`09 - matchLeftIncl()          adhoc`, () => {
  equal(
    matchLeftIncl("_abc.efghi", 4, ["bcd"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    false,
    "09.01",
  );
});

test.run();
