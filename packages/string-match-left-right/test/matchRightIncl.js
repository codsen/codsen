import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import {
  // matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm.js";

// 4. matchRightIncl()
// -----------------------------------------------------------------------------

test(`01 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, non zero arg`, () => {
  equal(matchRightIncl("abcdef", 2, "c"), "c", "01.01");
  equal(matchRightIncl("abcdef", 2, "cde"), "cde", "01.02");
  equal(matchRightIncl("abcdef", 2, ["cde"]), "cde", "01.03");
  equal(matchRightIncl("abcdef", 2, ["gjd", "cde"]), "cde", "01.04");
  equal(matchRightIncl("abcdef", 99, ["cde"]), false, "01.05");

  equal(
    matchRightIncl("ab      cdef", 2, "cd", {
      trimBeforeMatching: true,
      cb: (characterAfter, theRemainderOfTheString, index) => {
        equal(characterAfter, "e");
        equal(theRemainderOfTheString, "ef");
        equal(index, 10);
        return true;
      },
    }),
    "cd",
    "01.06",
  );
});

test(`02 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, index zero`, () => {
  equal(matchRightIncl("abcdef", 0, "a"), "a", "02.01");
  equal(matchRightIncl("abcdef", 0, "abc"), "abc", "02.02");
  equal(matchRightIncl("abcdef", 0, ["abc"]), "abc", "02.03");
  equal(matchRightIncl("abcdef", 0, ["fiuhjd", "gfds", "abc"]), "abc", "02.04");
});

test(`03 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, case insensitive`, () => {
  equal(matchRightIncl("abcdef", 2, "C"), false, "03.01");
  equal(matchRightIncl("abcdef", 2, "C", { i: true }), "C", "03.02");
  equal(matchRightIncl("abcdef", 2, ["C"], { i: true }), "C", "03.03");
  equal(
    matchRightIncl("abcdef", 2, ["JFHG", "URR", "C"], { i: true }),
    "C",
    "03.04",
  );
});

test(`04 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`, () => {
  let matcher = (char, theRemainderOfTheString, index) => {
    equal(char, undefined);
    equal(theRemainderOfTheString, "");
    equal(index, 6);
  };

  // both functions should receive the same values in the callbacks:
  equal(
    matchRightIncl("abcdef", 3, ["def"], {
      cb: (...args) => {
        matcher(...args);
        return true;
      },
    }),
    "def",
    "04.01",
  );
  equal(
    matchRight("abcdef", 2, ["def"], {
      cb: (...args) => {
        matcher(...args);
        return true;
      },
    }),
    "def",
    "04.02",
  );
});

test(`05 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     opts.maxMismatches - middle of the string`, () => {
  equal(matchRightIncl("abcdef", 2, ["cde"]), "cde", "05.01");

  // first char, "c" mismatching
  equal(matchRightIncl("ab.def", 2, ["cde"]), false, "05.02");
  equal(
    matchRightIncl("ab.def", 2, ["cde"], { maxMismatches: 1 }),
    false,
    "05.03",
  );
  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      hungry: true,
    }),
    "cde",
    "05.04",
  );

  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
      hungry: false,
    }),
    false,
    "05.05",
  );
  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
      hungry: false,
    }),
    false,
    "05.06",
  );
  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
      hungry: false,
    }),
    false,
    "05.07",
  );
  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
      hungry: false,
    }),
    false,
    "05.08",
  );

  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
      hungry: true,
    }),
    false,
    "05.09",
  );
  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
      hungry: true,
    }),
    false,
    "05.10",
  );
  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
      hungry: true,
    }),
    "cde",
    "05.11",
  );
  equal(
    matchRightIncl("ab.def", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
      hungry: true,
    }),
    "cde",
    "05.12",
  );

  // second char, "d" mismatching
  equal(matchRightIncl("abc.ef", 2, ["cde"]), false, "05.13");
  equal(
    matchRightIncl("abc.ef", 2, ["cde"], {
      maxMismatches: 1,
    }),
    "cde",
    "05.14",
  );
  equal(
    matchRightIncl("abc.ef", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    "cde",
    "05.15",
  );
  equal(
    matchRightIncl("abc.ef", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    "cde",
    "05.16",
  );
  equal(
    matchRightIncl("abc.ef", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
    }),
    "cde",
    "05.17",
  );
  equal(
    matchRightIncl("abc.ef", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
    }),
    "cde",
    "05.18",
  );

  // third char, "e" mismatching
  equal(matchRightIncl("abcd.f", 2, ["cde"]), false, "05.19");
  equal(
    matchRightIncl("abcd.f", 2, ["cde"], {
      maxMismatches: 1,
    }),
    "cde",
    "05.20",
  );
  equal(
    matchRightIncl("abcd.f", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: true,
    }),
    false,
    "05.21",
  );
  equal(
    matchRightIncl("abcd.f", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: true,
      lastMustMatch: false,
    }),
    "cde",
    "05.22",
  );
  equal(
    matchRightIncl("abcd.f", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: true,
    }),
    false,
    "05.23",
  );
  equal(
    matchRightIncl("abcd.f", 2, ["cde"], {
      maxMismatches: 1,
      firstMustMatch: false,
      lastMustMatch: false,
    }),
    "cde",
    "05.24",
  );
});

test.run();
