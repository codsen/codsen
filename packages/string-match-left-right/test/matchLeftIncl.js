import tap from "tap";
import {
  matchLeftIncl,
  // matchRightIncl,
  matchLeft,
  // matchRight,
} from "../dist/string-match-left-right.esm";

// matchLeftIncl()
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      on a simple string`,
  (t) => {
    t.equal(matchLeftIncl("abc", 2, "c"), "c", "01.01 - pointless, but still");
    t.equal(
      matchLeftIncl("zabcdefghi", 4, ["bcd"]),
      "bcd",
      "01.02 - one elem to match"
    );
    t.equal(
      matchLeftIncl("abcdefghi", 3, ["cd", "bcd"]),
      "cd", // first match
      "01.03 - multiple to match"
    );
    t.equal(matchLeftIncl("abcdefghi", 3, ["aaa", "bcd"]), "bcd", "01.04");
    t.equal(matchLeftIncl("abcdefghi", 3, ["aaa", "zzz"]), false, "01.05");
    t.equal(matchLeftIncl("abcdefghi", 99, ["aaa", "zzz"]), false, "01.06");

    t.equal(
      matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
        trimBeforeMatching: true,
      }),
      "ab",
      "01.07"
    );

    t.equal(
      matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
        trimBeforeMatching: true,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, "x");
          t.equal(theRemainderOfTheString, "zx");
          t.equal(index, 1);
          return true;
        },
      }),
      "ab",
      "01.08"
    );

    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      case insensitive`,
  (t) => {
    t.equal(matchLeftIncl("abc", 2, "C"), false, "02.01 - control");
    t.equal(matchLeftIncl("abc", 2, "C", { i: true }), "C", "02.02 - opts.i");
    t.equal(matchLeftIncl("abc", 2, "BC", { i: true }), "BC", "02.03");
    t.equal(
      matchLeftIncl("abC", 2, "c", { i: true }),
      "c",
      "02.04 - source is uppercase, needle is lowercase"
    );
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      left substring to check is longer than what's on the left`,
  (t) => {
    t.equal(
      matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"]),
      false,
      "03.01"
    );
    t.equal(
      matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"], { i: true }),
      false,
      "03.02 - opts should not affect anything here"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`,
  (t) => {
    t.equal(
      matchLeftIncl("abcdef", 3, ["abcd"], {
        cb: (char, theRemainderOfTheString, index) => {
          t.equal(char, undefined);
          t.equal(theRemainderOfTheString, "");
          t.equal(index, undefined);
          return true;
        },
      }),
      "abcd",
      "04"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      opts.maxMismatches === 1, one char`,
  (t) => {
    t.equal(matchLeftIncl("abc", 2, "c"), "c", "05.01 - control");
    t.equal(
      matchLeftIncl("abcd", 2, "c", {
        maxMismatches: 1,
      }),
      "c",
      "05.02 - matching"
    );
    t.equal(
      matchLeft("abcd", 3, "c", {
        maxMismatches: 1,
      }),
      "c",
      "05.03"
    );

    // at least something from the set must have been matched! In this case,
    // the set is one character and it was not matched, so no characters from
    // the set were matched
    t.equal(
      matchLeftIncl("abc", 2, "x", {
        maxMismatches: 1,
      }),
      false, // <-- because at least one character must have been matched (general rule)
      "05.04 - mismatching"
    );
    t.equal(
      matchLeft("abc", 2, "x", {
        maxMismatches: 1,
      }),
      false, // <-- because at least one character must have been matched (general rule)
      "05.05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char`,
  (t) => {
    t.equal(
      matchLeftIncl("_abdefghi", 3, ["bcd"], {
        maxMismatches: 1,
      }),
      "bcd",
      "06.01"
    );
    t.equal(
      matchLeft("_abdefghi", 4, ["bcd"], {
        maxMismatches: 1,
      }),
      "bcd",
      "06.02"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      opts.maxMismatches === 1, one char`,
  (t) => {
    const opts = {
      maxMismatches: 1,
    };
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], opts),
      "bcd",
      "07.01 - d mismatching"
    );
    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], opts),
      "bcd",
      "07.02 - c mismatching"
    );
    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], opts),
      "bcd",
      "07.03 - b mismatching"
    );
    t.equal(
      matchLeftIncl(".cdefghi", 2, ["bcd"], opts),
      "bcd",
      "07.04 - string starts with the value"
    );
    t.equal(
      matchLeftIncl("cdefghi", 1, ["bcd"], opts),
      "bcd",
      "07.05 - last char to match would be outside of the str"
    );
    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 99,
      }),
      "bcd",
      "07.06"
    );

    // ensure that opts object was not mutated:
    t.match(
      opts,
      {
        maxMismatches: 1,
      },
      "07.07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}          opts.maxMismatches === 1, three char set`,
  (t) => {
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "bcd",
      "08.01"
    );
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "08.02"
    );

    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "bcd",
      "08.03"
    );
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "08.04"
    );

    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "bcd",
      "08.05"
    );
    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "bcd",
      "08.06"
    );

    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "bcd",
      "08.07"
    );
    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      "bcd",
      "08.08"
    );

    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      false,
      "08.09"
    );
    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "08.10"
    );

    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "bcd",
      "08.11"
    );
    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "bcd",
      "08.12"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}          adhoc`,
  (t) => {
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "09"
    );
    t.end();
  }
);
