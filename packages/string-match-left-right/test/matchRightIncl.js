import tap from "tap";
import {
  // matchLeftIncl,
  matchRightIncl,
  // matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm";

// 4. matchRightIncl()
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, non zero arg`,
  (t) => {
    t.equal(matchRightIncl("abcdef", 2, "c"), "c", "01.01");
    t.equal(matchRightIncl("abcdef", 2, "cde"), "cde", "01.02");
    t.equal(matchRightIncl("abcdef", 2, ["cde"]), "cde", "01.03");
    t.equal(matchRightIncl("abcdef", 2, ["gjd", "cde"]), "cde", "01.04");
    t.equal(matchRightIncl("abcdef", 99, ["cde"]), false, "01.05");

    t.equal(
      matchRightIncl("ab      cdef", 2, "cd", {
        trimBeforeMatching: true,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, "e");
          t.equal(theRemainderOfTheString, "ef");
          t.equal(index, 10);
          return true;
        },
      }),
      "cd",
      "01.06"
    );

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, index zero`,
  (t) => {
    t.equal(matchRightIncl("abcdef", 0, "a"), "a", "02.01");
    t.equal(matchRightIncl("abcdef", 0, "abc"), "abc", "02.02");
    t.equal(matchRightIncl("abcdef", 0, ["abc"]), "abc", "02.03");
    t.equal(
      matchRightIncl("abcdef", 0, ["fiuhjd", "gfds", "abc"]),
      "abc",
      "02.04"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, case insensitive`,
  (t) => {
    t.equal(matchRightIncl("abcdef", 2, "C"), false, "03.01");
    t.equal(matchRightIncl("abcdef", 2, "C", { i: true }), "C", "03.02");
    t.equal(matchRightIncl("abcdef", 2, ["C"], { i: true }), "C", "03.03");
    t.equal(
      matchRightIncl("abcdef", 2, ["JFHG", "URR", "C"], { i: true }),
      "C",
      "03.04"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`,
  (t) => {
    const matcher = (char, theRemainderOfTheString, index) => {
      t.equal(char, undefined);
      t.equal(theRemainderOfTheString, "");
      t.equal(index, 6);
    };

    // both functions should receive the same values in the callbacks:
    t.equal(
      matchRightIncl("abcdef", 3, ["def"], {
        cb: (...args) => {
          matcher(...args);
          return true;
        },
      }),
      "def",
      "04.01"
    );
    t.equal(
      matchRight("abcdef", 2, ["def"], {
        cb: (...args) => {
          matcher(...args);
          return true;
        },
      }),
      "def",
      "04.02"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     opts.maxMismatches - middle of the string`,
  (t) => {
    t.equal(matchRightIncl("abcdef", 2, ["cde"]), "cde", "05.01");

    // first char, "c" mismatching
    t.equal(matchRightIncl("ab.def", 2, ["cde"]), false, "05.02");
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "05.03"
    );
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "05.04"
    );
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "05.05"
    );
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cde",
      "05.06"
    );
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "05.07"
    );

    // second char, "d" mismatching
    t.equal(matchRightIncl("abc.ef", 2, ["cde"]), false, "05.08");
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "05.09"
    );
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      "cde",
      "05.10"
    );
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "cde",
      "05.11"
    );
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cde",
      "05.12"
    );
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "05.13"
    );

    // third char, "e" mismatching
    t.equal(matchRightIncl("abcd.f", 2, ["cde"]), false, "05.14");
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "05.15"
    );
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "05.16"
    );
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "cde",
      "05.17"
    );
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      false,
      "05.18"
    );
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "05.19"
    );
    t.end();
  }
);
