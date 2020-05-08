import tap from "tap";
import {
  matchLeftIncl,
  matchRightIncl,
  matchLeft,
  matchRight,
} from "../dist/string-match-left-right.esm";

// 1. Input arg validation
// -----------------------------------------------------------------------------

tap.test("01 - throws", (t) => {
  // no third arg
  t.throws(() => {
    matchLeftIncl("zzz", 1);
  }, /THROW_ID_08/);

  t.throws(() => {
    matchRightIncl("zzz", 1);
  }, /THROW_ID_08/);

  // third arg being wrong

  t.throws(() => {
    matchRightIncl("zzz", 1, 1);
  }, /THROW_ID_05/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", 1);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", "");
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", [""]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", "aaa", ["", ""]);
  }, /THROW_ID_03/);

  // no second arg

  t.throws(() => {
    matchLeftIncl("zzz", null, ["aaa"]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, ["aaa"]);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, []);
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz", null, "");
  }, /THROW_ID_03/);

  // second arg completely missing onwards

  t.throws(() => {
    matchLeftIncl("zzz");
  }, /THROW_ID_03/);

  t.throws(() => {
    matchRightIncl("zzz");
  }, /THROW_ID_03/);

  // fourth arg not a plain object
  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], true);
  }, /THROW_ID_06/);

  // opts.trimBeforeMatching wrong type
  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: "z",
    });
  }, /THROW_ID_09/);

  t.throws(() => {
    matchRightIncl("zzz", 1, ["aaa"], {
      trimBeforeMatching: [],
    });
  }, /trimCharsBeforeMatching/);

  t.end();
});

// 2. matchLeftIncl()
// -----------------------------------------------------------------------------

tap.test(
  `02 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      on a simple string`,
  (t) => {
    t.equal(matchLeftIncl("abc", 2, "c"), "c", "02.01 - pointless, but still");
    t.equal(
      matchLeftIncl("zabcdefghi", 4, ["bcd"]),
      "bcd",
      "02.02 - one elem to match"
    );
    t.equal(
      matchLeftIncl("abcdefghi", 3, ["cd", "bcd"]),
      "cd", // first match
      "02.03 - multiple to match"
    );
    t.equal(matchLeftIncl("abcdefghi", 3, ["aaa", "bcd"]), "bcd", "02.04");
    t.equal(matchLeftIncl("abcdefghi", 3, ["aaa", "zzz"]), false, "02.05");
    t.equal(matchLeftIncl("abcdefghi", 99, ["aaa", "zzz"]), false, "02.06");

    t.equal(
      matchLeftIncl("zxab      cdef", 9, ["zz", "ab"], {
        trimBeforeMatching: true,
      }),
      "ab",
      "02.07"
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
      "02.08"
    );

    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      case insensitive`,
  (t) => {
    t.equal(matchLeftIncl("abc", 2, "C"), false, "03.01 - control");
    t.equal(matchLeftIncl("abc", 2, "C", { i: true }), "C", "03.02 - opts.i");
    t.equal(matchLeftIncl("abc", 2, "BC", { i: true }), "BC", "03.03");
    t.equal(
      matchLeftIncl("abC", 2, "c", { i: true }),
      "c",
      "03.04 - source is uppercase, needle is lowercase"
    );
    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      left substring to check is longer than what's on the left`,
  (t) => {
    t.equal(
      matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"]),
      false,
      "04.01"
    );
    t.equal(
      matchLeftIncl("abc", 2, ["cjsldfdjshfjkdfhgkdkgfhkd"], { i: true }),
      false,
      "04.02 - opts should not affect anything here"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`,
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
      "05"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      opts.maxMismatches === 1, one char`,
  (t) => {
    t.equal(matchLeftIncl("abc", 2, "c"), "c", "06.01 - control");
    t.equal(
      matchLeftIncl("abcd", 2, "c", {
        maxMismatches: 1,
      }),
      "c",
      "06.02 - matching"
    );
    t.equal(
      matchLeft("abcd", 3, "c", {
        maxMismatches: 1,
      }),
      "c",
      "06.03"
    );

    // at least something from the set must have been matched! In this case,
    // the set is one character and it was not matched, so no characters from
    // the set were matched
    t.equal(
      matchLeftIncl("abc", 2, "x", {
        maxMismatches: 1,
      }),
      false, // <-- because at least one character must have been matched (general rule)
      "06.04 - mismatching"
    );
    t.equal(
      matchLeft("abc", 2, "x", {
        maxMismatches: 1,
      }),
      false, // <-- because at least one character must have been matched (general rule)
      "06.05"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char`,
  (t) => {
    t.equal(
      matchLeftIncl("_abdefghi", 3, ["bcd"], {
        maxMismatches: 1,
      }),
      "bcd",
      "07.01"
    );
    t.equal(
      matchLeft("_abdefghi", 4, ["bcd"], {
        maxMismatches: 1,
      }),
      "bcd",
      "07.02"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}      opts.maxMismatches === 1, one char`,
  (t) => {
    const opts = {
      maxMismatches: 1,
    };
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], opts),
      "bcd",
      "08.01 - d mismatching"
    );
    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], opts),
      "bcd",
      "08.02 - c mismatching"
    );
    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], opts),
      "bcd",
      "08.03 - b mismatching"
    );
    t.equal(
      matchLeftIncl(".cdefghi", 2, ["bcd"], opts),
      "bcd",
      "08.04 - string starts with the value"
    );
    t.equal(
      matchLeftIncl("cdefghi", 1, ["bcd"], opts),
      "bcd",
      "08.05 - last char to match would be outside of the str"
    );
    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 99,
      }),
      "bcd",
      "08.06"
    );

    // ensure that opts object was not mutated:
    t.match(
      opts,
      {
        maxMismatches: 1,
      },
      "08.07"
    );
    t.end();
  }
);

tap.test(
  `09 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}          opts.maxMismatches === 1, three char set`,
  (t) => {
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "bcd",
      "09.01"
    );
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "09.02"
    );

    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "bcd",
      "09.03"
    );
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "09.04"
    );

    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "bcd",
      "09.05"
    );
    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "bcd",
      "09.06"
    );

    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "bcd",
      "09.07"
    );
    t.equal(
      matchLeftIncl("_ab.defghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      "bcd",
      "09.08"
    );

    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      false,
      "09.09"
    );
    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "09.10"
    );

    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "bcd",
      "09.11"
    );
    t.equal(
      matchLeftIncl("_a.cdefghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "bcd",
      "09.12"
    );
    t.end();
  }
);

tap.test(
  `10 - ${`\u001b[${33}m${"matchLeftIncl()"}\u001b[${39}m`}          adhoc`,
  (t) => {
    t.equal(
      matchLeftIncl("_abc.efghi", 4, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "10"
    );
    t.end();
  }
);

// 3. matchLeft()
// -----------------------------------------------------------------------------

tap.test(
  `11 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          on a simple string`,
  (t) => {
    t.equal(matchLeft("abc", 2, "b"), "b", "11.01");
    t.equal(
      matchLeft("abcdefghi", 3, ["abc"]),
      "abc",
      "11.02 - one elem to match"
    );
    t.equal(
      matchLeft("abcdefghi", 3, ["c", "bc"]),
      "c", // first one matched returned, although both did match
      "11.03 - multiple to match"
    );
    t.equal(matchLeft("abcdefghi", 3, ["aaa", "bc"]), "bc", "11.04");
    t.equal(matchLeft("abcdefghi", 3, ["aaa", "zzz"]), false, "11.05");
    t.equal(matchLeft("abcdefghi", 99, ["aaa", "zzz"]), false, "11.06");
    t.equal(matchLeft("abc", 2, "zab"), false, "11.07");
    t.end();
  }
);

tap.test(
  `12 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          case insensitive`,
  (t) => {
    t.equal(matchLeft("abc", 2, "B"), false, "12.01 - control");
    t.equal(matchLeft("abc", 2, "B", { i: true }), "B", "12.02 - opts.i");
    t.end();
  }
);

tap.test(
  `13 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, three-char set`,
  (t) => {
    //
    // first char, "d" is dot
    t.equal(
      matchLeft("_abc.efghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      "bcd",
      "13.01"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      false, // because "d" was not matched
      "13.02"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      "bcd",
      "13.03"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      false,
      "13.04"
    );

    //
    // second char, "c" is dot
    t.equal(
      matchLeft("_ab.defghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      "bcd",
      "13.05"
    );
    t.equal(
      matchLeft("_ab.defghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      "bcd",
      "13.06"
    );
    t.equal(
      matchLeft("_ab.defghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      "bcd",
      "13.07"
    );
    t.equal(
      matchLeft("_ab.defghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      "bcd",
      "13.08"
    );

    //
    // third char, "b" is dot
    t.equal(
      matchLeft("_a.cdefghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      false,
      "13.09"
    );
    t.equal(
      matchLeft("_a.cdefghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      false,
      "13.10"
    );
    t.equal(
      matchLeft("_a.cdefghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      "bcd",
      "13.11"
    );
    t.equal(
      matchLeft("_a.cdefghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      "bcd",
      "13.12"
    );

    t.end();
  }
);

tap.test(
  `14 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, two-char set`,
  (t) => {
    // lastMustMatch=false
    t.equal(
      matchLeft("_abc.efghi", 5, ["zc"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "14.01"
    );
    t.equal(
      matchLeft("_abc.efghi", 4, ["zc"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "zc",
      "14.02"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["cz"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "14.03"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["cz"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cz",
      "14.04"
    );

    // lastMustMatch=true
    t.equal(
      matchLeft("_abc.efghi", 5, ["zc"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "14.05"
    );
    t.equal(
      matchLeft("_abc.efghi", 4, ["zc"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "14.06"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["cz"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "14.07"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["cz"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cz",
      "14.08"
    );
    t.end();
  }
);

tap.test(
  `15 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, pin the maxMismatches cut-off point, protruding value`,
  (t) => {
    //
    // firstMustMatch = true
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 1,
        firstMustMatch: true,
      }),
      false,
      "15.01"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 2,
        firstMustMatch: true,
      }),
      false,
      "15.02"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 3,
        firstMustMatch: true,
      }),
      false,
      "15.03"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 4,
        firstMustMatch: true,
      }),
      false,
      "15.04"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 5,
        firstMustMatch: true,
      }),
      ".....d",
      "15.05"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 99,
        firstMustMatch: true,
      }),
      ".....d",
      "15.06"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 0,
        firstMustMatch: true,
      }),
      false,
      "15.07"
    );

    //
    // firstMustMatch = false
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 1,
        firstMustMatch: false,
      }),
      false,
      "15.08"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 2,
        firstMustMatch: false,
      }),
      false,
      "15.09"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 3,
        firstMustMatch: false,
      }),
      false,
      "15.10"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 4,
        firstMustMatch: false,
      }),
      false,
      "15.11"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 5,
        firstMustMatch: false,
      }),
      ".....d",
      "15.12"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 99,
        firstMustMatch: false,
      }),
      ".....d",
      "15.13"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 0,
        firstMustMatch: false,
      }),
      false,
      "15.14"
    );
    t.end();
  }
);

tap.test(
  `16 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, pin the maxMismatches cut-off point, non-protruding value`,
  (t) => {
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 1,
        firstMustMatch: true,
      }),
      false,
      "16.01"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 2,
        firstMustMatch: true,
      }),
      false,
      "16.02"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 3,
        firstMustMatch: true,
      }),
      false,
      "16.03"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 4,
        firstMustMatch: true,
      }),
      "....d",
      "16.04"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 5,
        firstMustMatch: true,
      }),
      "....d",
      "16.05"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 99,
        firstMustMatch: true,
      }),
      "....d",
      "16.06"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 0,
        firstMustMatch: true,
      }),
      false,
      "16.07"
    );
    t.end();
  }
);

// 4. matchRightIncl()
// -----------------------------------------------------------------------------

tap.test(
  `17 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, non zero arg`,
  (t) => {
    t.equal(matchRightIncl("abcdef", 2, "c"), "c", "17.01");
    t.equal(matchRightIncl("abcdef", 2, "cde"), "cde", "17.02");
    t.equal(matchRightIncl("abcdef", 2, ["cde"]), "cde", "17.03");
    t.equal(matchRightIncl("abcdef", 2, ["gjd", "cde"]), "cde", "17.04");
    t.equal(matchRightIncl("abcdef", 99, ["cde"]), false, "17.05");

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
      "17.06"
    );

    t.end();
  }
);

tap.test(
  `18 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, index zero`,
  (t) => {
    t.equal(matchRightIncl("abcdef", 0, "a"), "a", "18.01");
    t.equal(matchRightIncl("abcdef", 0, "abc"), "abc", "18.02");
    t.equal(matchRightIncl("abcdef", 0, ["abc"]), "abc", "18.03");
    t.equal(
      matchRightIncl("abcdef", 0, ["fiuhjd", "gfds", "abc"]),
      "abc",
      "18.04"
    );
    t.end();
  }
);

tap.test(
  `19 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     on a simple string, case insensitive`,
  (t) => {
    t.equal(matchRightIncl("abcdef", 2, "C"), false, "19.01");
    t.equal(matchRightIncl("abcdef", 2, "C", { i: true }), "C", "19.02");
    t.equal(matchRightIncl("abcdef", 2, ["C"], { i: true }), "C", "19.03");
    t.equal(
      matchRightIncl("abcdef", 2, ["JFHG", "URR", "C"], { i: true }),
      "C",
      "19.04"
    );
    t.end();
  }
);

tap.test(
  `20 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     cb gives outside index which is outside of string length`,
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
      "20.01"
    );
    t.equal(
      matchRight("abcdef", 2, ["def"], {
        cb: (...args) => {
          matcher(...args);
          return true;
        },
      }),
      "def",
      "20.02"
    );
    t.end();
  }
);

tap.test(
  `21 - ${`\u001b[${35}m${"matchRightIncl()"}\u001b[${39}m`}     opts.maxMismatches - middle of the string`,
  (t) => {
    t.equal(matchRightIncl("abcdef", 2, ["cde"]), "cde", "21.01");

    // first char, "c" mismatching
    t.equal(matchRightIncl("ab.def", 2, ["cde"]), false, "21.02");
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "21.03"
    );
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "21.04"
    );
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "21.05"
    );
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cde",
      "21.06"
    );
    t.equal(
      matchRightIncl("ab.def", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "21.07"
    );

    // second char, "d" mismatching
    t.equal(matchRightIncl("abc.ef", 2, ["cde"]), false, "21.08");
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "21.09"
    );
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      "cde",
      "21.10"
    );
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "cde",
      "21.11"
    );
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cde",
      "21.12"
    );
    t.equal(
      matchRightIncl("abc.ef", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "21.13"
    );

    // third char, "e" mismatching
    t.equal(matchRightIncl("abcd.f", 2, ["cde"]), false, "21.14");
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "21.15"
    );
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "21.16"
    );
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "cde",
      "21.17"
    );
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      false,
      "21.18"
    );
    t.equal(
      matchRightIncl("abcd.f", 2, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "21.19"
    );
    t.end();
  }
);

// 5. matchRight()
// -----------------------------------------------------------------------------

tap.test(
  `22 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`,
  (t) => {
    t.equal(matchRight("abcdef", 2, "d"), "d", "22.01");
    t.equal(matchRight("abcdef", 2, ["d"]), "d", "22.02");
    t.equal(matchRight("abcdef", 2, "def"), "def", "22.03");
    t.equal(matchRight("abcdef", 2, ["def"]), "def", "22.04");
    t.equal(matchRight("abcdef", 2, ["defg"]), false, "22.05");

    t.equal(matchRight("abcdef", 99, ["defg"]), false, "22.06");

    t.equal(
      matchRight("ab      cdef", 1, "cd", { trimBeforeMatching: true }),
      "cd",
      "22.07"
    );

    matchRight("ab      cdef", 1, "cd", {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        t.equal(char, "e");
        t.equal(theRemainderOfTheString, "ef");
        t.equal(index, 10);
      },
    });
    t.end();
  }
);

tap.test(
  `23 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, non zero arg`,
  (t) => {
    t.equal(matchRight("abcdef", 0, "b"), "b", "23.01");
    t.equal(matchRight("abcdef", 0, ["b"]), "b", "23.02");
    t.equal(matchRight("abcdef", 0, ["bc"]), "bc", "23.03");
    t.equal(matchRight("abcdef", 0, ["hfd", "ghja", "bc"]), "bc", "23.04");
    t.end();
  }
);

tap.test(
  `24 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         on a simple string, case insensitive`,
  (t) => {
    t.equal(matchRight("abcdef", 2, "D"), false, "24.01");
    t.equal(matchRight("abcdef", 2, "D", { i: true }), "D", "24.02");
    t.equal(matchRight("abcdef", 2, ["D"], { i: true }), "D", "24.03");
    t.equal(matchRight("abcdef", 2, ["gDSS", "D"], { i: true }), "D", "24.04");
    t.end();
  }
);

tap.test(
  `25 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}         adhoc test #1`,
  (t) => {
    t.equal(
      matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 13, ">"),
      ">",
      "25.01"
    );
    t.equal(
      matchRight("aaaa<<<<<<div>>>>something</div>bbbbb", 10, ">"),
      false,
      "25.02"
    );
    t.end();
  }
);

tap.test(
  `26 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char`,
  (t) => {
    t.equal(
      matchRight("a<!->z", 0, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, "z");
          t.equal(theRemainderOfTheString, "z");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "26.01"
    );
    t.equal(
      matchRightIncl("a<!->z", 1, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, "z");
          t.equal(theRemainderOfTheString, "z");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "26.02"
    );
    t.end();
  }
);

tap.test(
  `27 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char, space follows`,
  (t) => {
    t.equal(
      matchRight("a<!-> ", 0, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, " ");
          t.equal(theRemainderOfTheString, " ");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "27.01"
    );
    t.equal(
      matchRightIncl("a<!-> ", 1, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, " ");
          t.equal(theRemainderOfTheString, " ");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "27.02"
    );
    t.end();
  }
);

tap.test(
  `28 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, omitted char, EOF follows`,
  (t) => {
    t.equal(
      matchRight("a<!->", 0, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, undefined);
          t.equal(theRemainderOfTheString, "");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "28.01"
    );
    t.equal(
      matchRightIncl("a<!->", 1, ["<!-->"], {
        maxMismatches: 1,
        cb: (characterAfter, theRemainderOfTheString, index) => {
          t.equal(characterAfter, undefined);
          t.equal(theRemainderOfTheString, "");
          t.equal(index, 5);
          return true;
        },
      }),
      "<!-->",
      "28.02"
    );
    t.end();
  }
);

tap.test(
  `29 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, fail`,
  (t) => {
    t.equal(
      matchRight("a<--b", 1, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
      }),
      "!--",
      "29"
    );
    t.end();
  }
);

tap.test(
  `30 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, pass`,
  (t) => {
    // enforcing the exclamation mark:
    t.equal(
      matchRight("a<--b", 1, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
        firstMustMatch: true,
      }),
      false,
      "30"
    );

    t.end();
  }
);

tap.test(
  `31 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, first char enforced, succeed`,
  (t) => {
    t.equal(
      matchRight("a<!-b", 1, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
      }),
      "!--",
      "31.01"
    );

    // enforcing the exclamation mark:
    t.equal(
      matchRight("a<!-b", 1, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
        firstMustMatch: true,
      }),
      "!--",
      "31.02"
    );

    // now matchRightIncl():

    t.equal(
      matchRightIncl("a<!-b", 2, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
      }),
      "!--",
      "31.03"
    );

    // enforcing the exclamation mark:
    t.equal(
      matchRightIncl("a<!-b", 2, ["!--"], {
        maxMismatches: 1,
        trimBeforeMatching: true,
        firstMustMatch: true,
      }),
      "!--",
      "31.04"
    );

    t.end();
  }
);

tap.test(
  `32 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, false`,
  (t) => {
    t.equal(
      matchRight(`a<!--[if gte mso 9]>x<![endif]-->z`, 1, ["![cdata"], {
        i: true,
        maxMismatches: 1,
        trimBeforeMatching: true,
      }),
      false,
      "32"
    );
    t.end();
  }
);

tap.test(
  `33 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1, adhoc 1`,
  (t) => {
    t.equal(
      matchRight(`a<!--[if gte mso 9]>x<![endif]-->z`, 19, ["<!-->"], {
        trimBeforeMatching: true,
        maxMismatches: 1,
      }),
      false,
      "33"
    );
    t.end();
  }
);

tap.test(
  `34 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, one mismatch`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<1[endif]-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      "![endif]",
      "34"
    );
    t.end();
  }
);

tap.test(
  `35 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<1[endf]-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      "![endif]",
      "35"
    );
    t.end();
  }
);

tap.test(
  `36 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<[endif]-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      "![endif]",
      "36"
    );
    t.end();
  }
);

tap.test(
  `37 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, two mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<endif]-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      "![endif]",
      "37"
    );
    t.end();
  }
);

tap.test(
  `38 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<endif-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      false,
      "38"
    );
    t.end();
  }
);

tap.test(
  `39 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<ndif]-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      false,
      "39"
    );
    t.end();
  }
);

tap.test(
  `40 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(`<!--[if gte mso 9]>x<[ndif-->`, 20, ["![endif]"], {
        i: true,
        maxMismatches: 2,
        trimBeforeMatching: true,
      }),
      false,
      "40"
    );
    t.end();
  }
);

tap.test(
  `41 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(`abc<!--[if gte mso 9]><xml>`, 3, ["!--"], {
        maxMismatches: 1,
        firstMustMatch: true,
        trimBeforeMatching: true,
      }),
      "!--",
      "41"
    );
    t.end();
  }
);

tap.test(
  `42 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}     opts.maxMismatches - 3-char string`,
  (t) => {
    t.equal(matchRight("abcdef", 1, ["cde"]), "cde", "42.01");

    // first char, "c" mismatching
    t.equal(matchRight("ab.def", 1, ["cde"]), false, "42.02");
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "42.03"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "42.04"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "42.05"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cde",
      "42.06"
    );
    t.equal(
      matchRight("ab.def", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "42.07"
    );

    // second char, "d" mismatching
    t.equal(matchRight("abc.ef", 1, ["cde"]), false, "42.08");
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "42.09"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      "cde",
      "42.10"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "cde",
      "42.11"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cde",
      "42.12"
    );
    t.equal(
      matchRight("abc.ef", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "42.13"
    );

    // third char, "e" mismatching
    t.equal(matchRight("abcd.f", 1, ["cde"]), false, "42.14");
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
      }),
      "cde",
      "42.15"
    );
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "42.16"
    );
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "cde",
      "42.17"
    );
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      false,
      "42.18"
    );
    t.equal(
      matchRight("abcd.f", 1, ["cde"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cde",
      "42.19"
    );
    t.end();
  }
);

tap.test(
  `43 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 1 + lastMustMatch`,
  (t) => {
    t.equal(
      matchRight(`><!--z>`, 0, ["<!-->"], {
        trimBeforeMatching: true,
        maxMismatches: 1,
        lastMustMatch: true,
      }),
      "<!-->",
      "43"
    );
    t.end();
  }
);

tap.test(
  `44 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      opts.maxMismatches === 2, three mismatches`,
  (t) => {
    t.equal(
      matchRight(
        `a<!--[if]><z>
<AAAch>>
</o:Offict`,
        1,
        ["![cdata"],
        {
          i: true,
          maxMismatches: 1,
          trimBeforeMatching: true,
        }
      ),
      false,
      "44"
    );
    t.end();
  }
);

// 6. opts.cb callbacks
// -----------------------------------------------------------------------------

tap.test(
  `45 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called back. haha!`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(
      matchLeft('<a class="something">', 8, "class", { cb: isSpace }),
      "class",
      "45.01"
    );
    t.equal(
      matchLeft('<a superclass="something">', 13, "class", { cb: isSpace }),
      false,
      "45.02"
    );
    t.equal(
      matchLeftIncl('<a class="something">', 8, "class=", { cb: isSpace }),
      "class=",
      "45.03"
    );
    t.equal(
      matchLeftIncl('<a superclass="something">', 13, "class=", {
        cb: isSpace,
      }),
      false,
      "45.04"
    );
    t.equal(matchLeftIncl("a", 13, "class=", { cb: isSpace }), false, "45.05");

    // PART 1. CONTROL.
    // the first part (string matching) is true, "b" is to the left of the character at index #2.
    // the second part of result calculation (callback against outside character) is true too.
    t.equal(matchLeft(" bc", 2, "b", { cb: isSpace }), "b", "45.06");

    // PART 2. LET'S MAKE VERSION OF '06.01.06' FAIL BECAUSE OF THE CALLBACK.
    t.equal(matchLeft("abc", 2, "b", { cb: isSpace }), false, "45.07");
    // observe that "a" does not satisfy the callback's requirement to be a space thus the
    // main result is false.
    // Now, let's test trimming:

    // PART 3.
    // character at index #5 is "c".
    // We're checking is "b" to the left of it, plus, is there a space to the left of "b".
    // Answer is no, because there are bunch of line breaks to the left of "c".
    t.equal(matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace }), false, "45.08");

    // PART 4.
    // Now let's enable the opts.trimBeforeMatching:
    t.equal(
      matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      "b",
      "45.09"
    );
    // Answer is now true, because character at index #5 is "c", we look to the left of it, skip
    // all trimmable characters and encounter "b". And then, there's a space to the left of it to
    // satisfy the callback.

    // PART 5.
    // Now let's prove callback is still working.
    // Let's make it fail because of a callback.
    // Replacing space to the left of "b" with "a".
    t.equal(
      matchLeft("ab\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      false,
      "45.10"
    );
    t.end();
  }
);

tap.test(
  `46 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            opts.matchLeft() - various combos`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(
      matchLeft("ab\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      false,
      "46.01"
    );
    t.equal(
      matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace, trimBeforeMatching: true }),
      "b",
      "46.02"
    );
    t.equal(matchLeft(" b\n\n\nc", 5, "b", { cb: isSpace }), false, "46.03");
    t.equal(
      matchLeft("ab\n\n\nc", 5, "B", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      false,
      "46.04"
    );
    t.equal(
      matchLeft(" b\n\n\nc", 5, "B", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "B",
      "46.05"
    );
    t.equal(
      matchLeft(" b\n\n\nc", 5, "B", { cb: isSpace, i: true }),
      false,
      "46.06"
    );
    t.end();
  }
);

tap.test(
  `47 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            opts.matchLeftIncl() - callback and trimming`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    function isA(char) {
      return char === "a";
    }
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "bc", { cb: isSpace }),
      false,
      "47.01"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "bc", {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      "bc",
      "47.02"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      false,
      "47.03"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", {
        cb: isA,
        trimBeforeMatching: true,
      }),
      "bc",
      "47.04"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "bc", { trimBeforeMatching: true }),
      "bc",
      "47.05"
    );

    // opts.i
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "BC", { cb: isSpace, i: true }),
      false,
      "47.06"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, "BC", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "47.07"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, ["BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "47.08"
    );
    t.equal(
      matchLeftIncl(" bc\n\n\n", 5, ["AAA", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "47.09"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "BC", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      false,
      "47.10"
    );
    t.equal(
      matchLeftIncl("abc\n\n\n", 5, "BC", {
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "47.11"
    );
    t.end();
  }
);

tap.test(
  `48 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called back, pt.1`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    t.equal(matchRight('<a class="something"> text', 19, ">"), ">", "48.01");
    t.equal(
      // we will catch closing double quote, index #19 and check does closing bracket follow
      // if and also does the space follow after it
      matchRight('<a class="something"> text', 19, ">", { cb: isSpace }),
      ">",
      "48.02"
    );
    t.equal(
      matchRight('<a class="something">text', 19, ">", { cb: isSpace }),
      false,
      "48.03"
    );
    t.equal(matchRight('<a class="something"> text', 18, '">'), '">', "48.04");
    t.equal(
      matchRightIncl('<a class="something"> text', 19, '">'),
      '">',
      "48.05"
    );
    t.equal(
      matchRightIncl('<a class="something"> text', 19, '">', { cb: isSpace }),
      '">',
      "48.06"
    );
    t.equal(
      matchRightIncl('<a class="something">text', 19, '">', { cb: isSpace }),
      false,
      "48.07"
    );
    t.end();
  }
);

tap.test(
  `49 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            callback is called, pt.2`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    // control
    t.equal(matchRight("b\n\n\nc z", 0, "c", { cb: isSpace }), false, "49.01");
    t.equal(
      matchRight("b\n\n\nc z", 0, "c", {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      "c",
      "49.02"
    );
    t.equal(
      matchRight("b\n\n\ncz", 0, "c", {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      false,
      "49.03"
    );
    t.equal(
      matchRight("b\n\n\nc z", 0, "C", { cb: isSpace, i: true }),
      false,
      "49.04"
    );
    t.equal(
      matchRight("b\n\n\nc z", 0, "C", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "C",
      "49.05"
    );
    t.equal(
      matchRight("b\n\n\ncz", 0, "C", {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      false,
      "49.06"
    );

    // control
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["aa", "bc"], { cb: isSpace }),
      false,
      "49.07"
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["aa", "bc"], {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      "bc",
      "49.08"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["aa", "bc"], {
        cb: isSpace,
        trimBeforeMatching: true,
      }),
      false,
      "49.09"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["aa", "bc"], {
        trimBeforeMatching: true,
      }),
      "bc",
      "49.10"
    );

    // opts.i
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["ZZ", "BC"], { cb: isSpace, i: true }),
      false,
      "49.11"
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["ZZ", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "49.12"
    );
    t.equal(
      matchRightIncl("\n\n\nbc z", 0, ["KJG", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "49.13"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], {
        cb: isSpace,
        trimBeforeMatching: true,
        i: true,
      }),
      false,
      "49.14"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], {
        trimBeforeMatching: true,
        i: true,
      }),
      "BC",
      "49.15"
    );
    t.equal(
      matchRightIncl("\n\n\nbcz", 0, ["ZZ", "BC"], { i: true }),
      false,
      "49.16"
    );
    t.end();
  }
);

// new in v2.1.0
tap.test(
  `50 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            matchRight - third callback argument (index)`,
  (t) => {
    const inputStr = "some text and some more text";
    function testMe(char, theRemainderOfTheString, index) {
      t.equal(char, "r");
      t.equal(theRemainderOfTheString, "re text");
      t.equal(index, 21);
    }
    matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });
    matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });
    matchRight(inputStr, 18, ["z", "mo"], { cb: testMe });

    matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
    matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
    matchRight(inputStr, 18, ["z", "mo"], { i: true, cb: testMe });
    t.end();
  }
);

tap.test(
  `51 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}            matchLeft -  third callback argument (index)`,
  (t) => {
    const inputStr = "some text and some more text";
    function testMe1(char) {
      t.equal(char, "o");
    }
    function testMe2(char, theRemainderOfTheString) {
      t.equal(theRemainderOfTheString, "some text and so");
    }
    function testMe3(char, theRemainderOfTheString, index) {
      t.equal(index, 15);
    }
    matchLeft(inputStr, 18, ["z", "me"], { cb: testMe1 });
    matchLeft(inputStr, 18, ["z", "me"], { cb: testMe2 });
    matchLeft(inputStr, 18, ["z", "me"], { cb: testMe3 });

    matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe1 });
    matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe2 });
    matchLeft(inputStr, 18, ["z", "me"], { i: true, cb: testMe3 });

    t.end();
  }
);

// 7. opts.trimCharsBeforeMatching
// -----------------------------------------------------------------------------

tap.test(
  `52 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.1`,
  (t) => {
    function isSpace(char) {
      return typeof char === "string" && char.trim() === "";
    }
    // control
    t.equal(matchRight("</div>", 0, ["div"]), false, "52.01");
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", " "] }),
      "div",
      "52.02"
    );
    // two character-long opts.trimCharsBeforeMatching
    t.throws(() => {
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/ "] });
    }, "52.03");
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        trimCharsBeforeMatching: ["/", " "],
      }),
      "div",
      "52.04"
    );
    t.equal(
      matchRight("< / div>", 0, ["hgfdf", "hkjh", "div", "00"], {
        trimCharsBeforeMatching: ["/", " "],
      }),
      "div",
      "52.05"
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
      false,
      "52.06"
    );

    // opts.cb
    t.equal(
      matchRight("</div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "],
      }),
      false,
      "52.07"
    );
    t.equal(
      matchRight("< / div>", 0, ["zzzz", "div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "],
      }),
      false,
      "52.08"
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/", " "],
      }),
      false,
      "52.09"
    );
    t.equal(
      matchRight("< / div>", 0, ["div"], {
        cb: isSpace,
        trimCharsBeforeMatching: ["/"],
      }),
      false,
      "52.10"
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/", 1] }),
      "div",
      "52.11"
    );
    t.end();
  }
);

tap.test(
  `53 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       pt.2`,
  (t) => {
    // matchRight
    t.equal(matchRight("</div>", 0, ["div"]), false, "53.01");
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: "/" }),
      "div",
      "53.02 - opts.trimCharsBeforeMatching given as string"
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["/"] }),
      "div",
      "53.03 - opts.trimCharsBeforeMatching given within array"
    );
    t.equal(
      matchRight("</div>", 0, ["div"], { trimCharsBeforeMatching: ["a", "/"] }),
      "div",
      "53.04 - opts.trimCharsBeforeMatching given within array"
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], { trimCharsBeforeMatching: "A" }),
      false,
      "53.05"
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], {
        i: false,
        trimCharsBeforeMatching: "A",
      }),
      false,
      "53.06"
    );
    t.equal(
      matchRight("<adiv>", 0, ["div"], {
        i: true,
        trimCharsBeforeMatching: "A",
      }),
      "div",
      "53.07 - case insensitive affects trimCharsBeforeMatching too and yields results"
    );
    t.equal(
      matchRight("<adiv>", 0, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["1", "A"],
      }),
      "dIv",
      "53.08"
    );
    // matchRightIncl
    t.equal(matchRightIncl("</div>", 0, ["div"]), false, "53.09");
    t.equal(
      matchRightIncl("</div>", 0, ["div"], { trimCharsBeforeMatching: "<" }),
      false,
      "53.10"
    );
    t.equal(
      matchRightIncl("</div>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["<", "/"],
      }),
      "div",
      "53.11"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["c", "a", "b"],
      }),
      "div",
      "53.12"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        trimCharsBeforeMatching: ["C", "A", "B"],
      }),
      false,
      "53.13"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "div"], {
        i: true,
        trimCharsBeforeMatching: ["C", "A", "B"],
      }),
      "div",
      "53.14"
    );
    t.equal(
      matchRightIncl("abdiv>", 0, ["yo", "dIv"], {
        i: true,
        trimCharsBeforeMatching: ["C", "A", "B"],
      }),
      "dIv",
      "53.15"
    );
    // matchLeft
    t.equal(matchLeft("</divz>", 6, ["div"]), false, "53.16");
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
      "div",
      "53.17"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["z"] }),
      "div",
      "53.18"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], { trimCharsBeforeMatching: ["Z"] }),
      false,
      "53.19"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], {
        i: false,
        trimCharsBeforeMatching: ["Z"],
      }),
      false,
      "53.20"
    );
    t.equal(
      matchLeft("</divz>", 6, ["div"], {
        i: true,
        trimCharsBeforeMatching: ["Z"],
      }),
      "div",
      "53.21"
    );
    t.equal(
      matchLeft("</divz>", 6, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["Z"],
      }),
      "dIv",
      "53.22"
    );
    // matchLeftIncl
    t.equal(matchLeftIncl("</divz>", 6, ["div"]), false, "53.23");
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], { trimCharsBeforeMatching: "z" }),
      false,
      "53.24"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["z", ">"],
      }),
      "div",
      "53.25"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["a", "z", ">"],
      }),
      "div",
      "53.26"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        trimCharsBeforeMatching: ["Z", ">"],
      }),
      false,
      "53.27"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        i: false,
        trimCharsBeforeMatching: ["a", "Z", ">"],
      }),
      false,
      "53.28"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["div"], {
        i: true,
        trimCharsBeforeMatching: ["a", "Z", ">"],
      }),
      "div",
      "53.29"
    );
    t.equal(
      matchLeftIncl("</divz>", 6, ["dIv"], {
        i: true,
        trimCharsBeforeMatching: ["a", "Z", ">"],
      }),
      "dIv",
      "53.30"
    );
    t.end();
  }
);

tap.test(
  `54 - ${`\u001b[${34}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}       throws`,
  (t) => {
    t.equal(
      matchRight("</div>", 0, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"],
      }),
      "div",
      "54.01"
    );
    t.throws(() => {
      matchRight("</div>", 0, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
      });
    }, "54.02");

    t.equal(
      matchLeft("</div>", 5, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"],
      }),
      "div",
      "54.03"
    );
    t.throws(() => {
      matchLeft("</div>", 5, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
      });
    }, "54.04");

    t.equal(
      matchRightIncl("</div>", 1, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"],
      }),
      "div",
      "54.05"
    );
    t.throws(() => {
      matchRightIncl("</div>", 1, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
      });
    }, "54.06");

    t.equal(
      matchLeftIncl("</div>", 4, ["zz", "div"], {
        trimCharsBeforeMatching: ["/", "<"],
      }),
      "div",
      "54.07"
    );
    t.throws(() => {
      matchLeftIncl("</div>", 4, ["zz", "div"], {
        trimCharsBeforeMatching: ["/<"], // <--- has to be character-by-character
      });
    }, "54.08");
    t.end();
  }
);

// 8. opts.cb and opts.cb callbacks
// -----------------------------------------------------------------------------

tap.test(
  `55 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchRight()`,
  (t) => {
    function hasEmptyClassRightAfterTheTagName(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.trim().startsWith('class=""');
    }
    function hasEmptyClassRightAfterTheTagName2(
      firstCharacter,
      wholeSubstring,
      indexOfFirstChar
    ) {
      t.equal(firstCharacter, " ");
      t.equal(wholeSubstring, ' class="">');
      t.equal(indexOfFirstChar, 5);
    }

    const input = '</div class="">';
    t.equal(
      matchRight(input, 0, ["hello", "div"], {
        cb: hasEmptyClassRightAfterTheTagName,
      }),
      false, // because slash hasn't been accounted for, it's to the right of index 0 character, "<".
      "55.01"
    );
    t.equal(
      matchRight(input, 0, ["hello", "div"], {
        cb: hasEmptyClassRightAfterTheTagName,
        trimCharsBeforeMatching: ["/", " "],
      }),
      "div", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "55.02"
    );
    t.equal(
      matchRight(input, 0, ["hello", "div"], {
        cb: hasEmptyClassRightAfterTheTagName,
        trimCharsBeforeMatching: ["/", " "],
      }),
      "div", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "55.03"
    );

    matchRight(input, 0, ["zz", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2,
    });
    matchRight(input, 0, ["zz", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "],
    });
    matchRight(input, 0, ["ghjs", "div"], {
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "],
    });
    matchRight(input, 0, ["zz", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2,
    });
    matchRight(input, 0, ["zz", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "],
    });
    matchRight(input, 0, ["ghjs", "div"], {
      i: true,
      cb: hasEmptyClassRightAfterTheTagName2,
      trimCharsBeforeMatching: ["/", " "],
    });
    t.end();
  }
);

tap.test(
  `56 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchRightIncl()`,
  (t) => {
    function hasEmptyClassRightAfterTheTagName(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.trim().startsWith('class=""');
    }
    function startsWithDiv(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.startsWith("div");
    }
    function startsWithDivWithTrim(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.trim().startsWith("div");
    }

    t.equal(
      matchRightIncl('</div class="">', 0, ["</", "Khg"]),
      "</", // base from where we start
      "56.01"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["</"], {
        cb: hasEmptyClassRightAfterTheTagName,
      }),
      false, // wrong callback function
      "56.02"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["</", ">"], { cb: startsWithDiv }),
      "</", // succeeds because div follows "</"
      "56.03"
    );
    t.equal(
      matchRightIncl('</ div class="">', 0, ["</"], { cb: startsWithDiv }),
      false, // fails because space (before "class") is not accounted for
      "56.04"
    );
    t.equal(
      matchRightIncl('</div class="">', 0, ["yo", "</"], {
        cb: startsWithDivWithTrim,
      }),
      "</", // trims slash, finds div, calls the callback with args, they trim and check for "class".
      "56.05"
    );
    t.end();
  }
);

tap.test(
  `57 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchLeft()`,
  (t) => {
    function startsWithZ(firstCharacterOutside, wholeSubstringOutside = "") {
      return wholeSubstringOutside.startsWith("z");
    }

    t.equal(
      matchLeft("<div><b>aaa</b></div>", 5, ["<article>", "<div>"]),
      "<div>", // 5th index is left bracket of <b>. Yes, <div> is on the left.
      "57.01"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["<div>"]),
      false, // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "57.02"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["<b", "<div"], {
        trimCharsBeforeMatching: [">", " "],
      }),
      "<div", // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "57.03"
    );
    t.equal(
      matchLeft("z<div ><b>aaa</b></div>", 7, ["yo yo yo", "<div", "gkhjg"], {
        cb: startsWithZ,
        trimCharsBeforeMatching: [">", " "],
      }),
      "<div", // 7th index is left bracket of <b>. Yes, <div> is on the left.
      "57.04"
    );
    t.equal(
      matchLeft("<div ><b>aaa</b></div>", 6, ["<div"], {
        cb: startsWithZ,
        trimCharsBeforeMatching: [" ", ">"],
      }),
      false, // cheeky - deliberately making the second arg of cb to be blank and fail startsWithZ
      "57.05"
    );
    t.end();
  }
);

tap.test(
  `58 - new in v1.5.0 - ${`\u001b[${33}m${"second arg in callback"}\u001b[${39}m`} - matchLeftIncl()`,
  (t) => {
    function startsWithZ(firstCharacter, wholeSubstring) {
      // console.log(`firstCharacter = ${JSON.stringify(firstCharacter, null, 4)}`)
      // console.log(`wholeSubstring = ${JSON.stringify(wholeSubstring, null, 4)}`)
      return wholeSubstring.startsWith("z");
    }

    t.equal(
      matchLeftIncl("<div><b>aaa</b></div>", 4, ["<div>", "and this"]),
      "<div>", // 4th index is right bracket of <div>, but it's inclusive so it will get included.
      // not inclusive would give "<div" by the way, that is, given index would not
      // be included in the slice.
      "58.01"
    );
    t.equal(
      matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["<div>"]),
      false,
      "58.02"
    );
    t.equal(
      matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["111", "<div >"]),
      "<div >",
      "58.03"
    );
    t.equal(
      matchLeftIncl("z<div ><b>aaa</b></div>", 6, ["222", "<div >"], {
        cb: startsWithZ,
      }),
      "<div >",
      "58.04"
    );
    t.equal(
      matchLeftIncl("zxy<div ><b>aaa</b></div>", 8, ["krbd", "<div >"], {
        cb: startsWithZ,
      }),
      "<div >",
      "58.05"
    );
    t.equal(
      matchLeftIncl("<div ><b>aaa</b></div>", 0, ["krbd", "<div >"], {
        cb: startsWithZ,
      }),
      false,
      "58.06 - cheeky - nothing for callback to hang onto"
    );
    t.end();
  }
);

// 9. Relying only on callback to calculate result - empty input is passed
// -----------------------------------------------------------------------------

tap.test(
  `59 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()`,
  (t) => {
    t.ok(
      matchLeft("abc", 1, null, {
        i: true,
        cb: (char) => char === "a",
      }),
      "59.01"
    );
    t.false(
      matchLeft("abc", 1, null, {
        i: true,
        cb: (char) => char === "c",
      }),
      "59.02"
    );
    t.throws(() => {
      matchLeft("abc", 1, null, {
        i: true,
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `60 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()`,
  (t) => {
    t.false(
      matchLeftIncl("abc", 1, "", {
        i: true,
        cb: (char) => char === "a",
      }),
      "60.01"
    );
    t.ok(
      matchLeftIncl("abc", 1, "", {
        i: true,
        cb: (char) => char === "b",
      }),
      "60.02"
    );
    t.throws(() => {
      matchLeftIncl("abc", 1, "", {
        i: true,
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `61 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()`,
  (t) => {
    t.ok(
      matchRight("abc", 1, "", {
        i: true,
        cb: (char) => char === "c",
      }),
      "61.01"
    );
    t.false(
      matchRight("abc", 1, "", {
        i: true,
        cb: (char) => char === "a",
      }),
      "61.02"
    );
    t.throws(() => {
      matchRight("abc", 1, "", {
        i: true,
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `62 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl()`,
  (t) => {
    t.false(
      matchRightIncl("abc", 1, "", {
        i: true,
        cb: (char) => char === "c",
      }),
      "62.01"
    );
    t.ok(
      matchRightIncl("abc", 1, "", {
        i: true,
        cb: (char) => char === "b",
      }),
      "62.02"
    );
    t.throws(() => {
      matchRightIncl("abc", 1, "", {
        i: true,
      });
    }, /THROW_ID_08/);
    t.end();
  }
);

tap.test(
  `63 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight() other cb args`,
  (t) => {
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: (char) => char === "d",
      }),
      "63.01"
    );
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: (char, rest) => rest === "def",
      }),
      "63.02"
    );
    t.ok(
      matchRight("abcdef", 2, "", {
        i: true,
        cb: (char, rest, index) => index === 3,
      }),
      "63.03"
    );
    t.end();
  }
);

tap.test(
  `64 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchRight("abc   def", 2, "", {
        cb: (char) => char === "d",
      }),
      "64.01"
    );
    t.false(
      matchRight("abc   def", 2, "", {
        cb: (char, rest) => rest === "def",
      }),
      "64.02"
    );
    t.false(
      matchRight("abc   def", 2, "", {
        cb: (char, rest, index) => index === 6, // "d" is at index 6
      }),
      "64.03"
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: (char) => char === "d",
      }),
      "64.04"
    );
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "def",
      }),
      "64.05"
    );
    t.ok(
      matchRight("abc   def", 2, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 6, // "d" is at index 6
      }),
      "64.06"
    );
    t.end();
  }
);

tap.test(
  `65 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl() + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: (char) => char === "d",
      }),
      "65.01"
    );
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: (char, rest) => rest === "def",
      }),
      "65.02"
    );
    t.false(
      matchRightIncl("abc   def", 3, "", {
        cb: (char, rest, index) => index === 6, // "d" is at index 6
      }),
      "65.03"
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: (char) => char === "d",
      }),
      "65.04"
    );
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "def",
      }),
      "65.05"
    );
    t.ok(
      matchRightIncl("abc   def", 3, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 6, // "d" is at index 6
      }),
      "65.06"
    );
    t.end();
  }
);

tap.test(
  `66 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchLeft(
        "abc   def",
        6, // <--- location of "d"
        "",
        {
          cb: (char) => char === "c",
        }
      ),
      "66.01"
    );
    t.false(
      matchLeft("abc   def", 6, "", {
        cb: (char, rest) => rest === "abc",
      }),
      "66.02"
    );
    t.false(
      matchLeft("abc   def", 6, "", {
        cb: (char, rest, index) => index === 2, // "c" is at index 2
      }),
      "66.03"
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchLeft(
        "abc   def",
        6, // <--- location of "d"
        "",
        {
          trimBeforeMatching: true,
          cb: (char) => char === "c",
        }
      ),
      "66.04"
    );
    t.ok(
      matchLeft("abc   def", 6, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "abc",
      }),
      "66.05"
    );
    t.ok(
      matchLeft("abc   def", 6, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 2, // "c" is at index 2
      }),
      "66.06"
    );
    t.end();
  }
);

tap.test(
  `67 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchLeftIncl(
        "abc   def",
        5, // <--- location of "d"
        "",
        {
          cb: (char) => char === "c",
        }
      ),
      "67.01"
    );
    t.false(
      matchLeftIncl("abc   def", 5, "", {
        cb: (char, rest) => rest === "abc",
      }),
      "67.02"
    );
    t.false(
      matchLeftIncl("abc   def", 5, "", {
        cb: (char, rest, index) => index === 2, // "c" is at index 2
      }),
      "67.03"
    );

    // with opts.trimBeforeMatching
    t.ok(
      matchLeftIncl(
        "abc   def",
        5, // <--- location of "d"
        "",
        {
          trimBeforeMatching: true,
          cb: (char) => char === "c",
        }
      ),
      "67.04"
    );
    t.ok(
      matchLeftIncl("abc   def", 5, "", {
        trimBeforeMatching: true,
        cb: (char, rest) => rest === "abc",
      }),
      "67.05"
    );
    t.ok(
      matchLeftIncl("abc   def", 5, "", {
        trimBeforeMatching: true,
        cb: (char, rest, index) => index === 2, // "c" is at index 2
      }),
      "67.06"
    );
    t.end();
  }
);

// The following test is an edge case but nonetheless it's an interesting-one.
// We test, what happens when the decision is driven by a callback and opts
// trimming is on, and because of trimming, string is skipped up to the ending,
// with nothing left to check against.
tap.test(
  `68 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${33}m${"opts.trimBeforeMatching"}\u001b[${39}m - trims to nothing`}`,
  (t) => {
    // In this case, callback always yields "true", no matter what. Input string
    // traversal starts on index 5, which is space to the left of "a". Since the
    // trimming is off, iteration stops at it, calls callback, returns its true.
    t.ok(
      matchLeftIncl(
        "      abc",
        5, // <--- location of space to the left of "a"
        "",
        {
          cb: () => true,
        }
      ),
      "68.01"
    );
    // Now, even the callback yields "true" in all cases, opts.trimBeforeMatching
    // is on too, which means, starting at index 5 and marching left it encounters
    // only spaces and reaches the end of the string. There's nothing left to give to
    // the callback, so even before calling the callback it terminates with "false".
    t.false(
      matchLeftIncl(
        "      abc",
        5, // <--- location of space to the left of "a"
        "",
        {
          trimBeforeMatching: true,
          cb: () => true, // <---- notice it's yielding "true" for all the cases
        }
      ),
      "68.02"
    );
    t.end();
  }
);

tap.test(
  `69 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeftIncl()  + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchLeftIncl(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          cb: (char) => char === "_",
        }
      ),
      "69.01"
    );
    t.ok(
      matchLeftIncl(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          trimCharsBeforeMatching: ["b", "c"],
          cb: (char) => char === "_",
        }
      ),
      "69.02"
    );
    t.end();
  }
);

tap.test(
  `70 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRightIncl() + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchRightIncl("_bcbcbcbc+", 1, "", {
        cb: (char) => char === "+",
      }),
      "70.01"
    );
    t.ok(
      matchRightIncl("_bcbcbcbc+", 1, "", {
        trimCharsBeforeMatching: ["b", "c"],
        cb: (char) => char === "+",
      }),
      "70.02"
    );
    t.end();
  }
);

tap.test(
  `71 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchLeft()      + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchLeft(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          cb: (char) => char === "_",
        }
      ),
      "71.01"
    );
    t.ok(
      matchLeft(
        "_bcbcbcbc+",
        8, // <--- to the left of "+"
        "",
        {
          trimCharsBeforeMatching: ["b", "c"],
          cb: (char) => char === "_",
        }
      ),
      "71.02"
    );
    t.end();
  }
);

tap.test(
  `72 - ${`\u001b[${36}m${"opts.cb()"}\u001b[${39}m`}   ${`\u001b[${32}m${"callback only"}\u001b[${39}m`} - matchRight()     + ${`\u001b[${35}m${"opts.trimCharsBeforeMatching"}\u001b[${39}m`}`,
  (t) => {
    // control
    t.false(
      matchRight("_bcbcbcbc+", 1, "", {
        cb: (char) => char === "+",
      }),
      "72.01"
    );
    t.ok(
      matchRight("_bcbcbcbc+", 1, "", {
        trimCharsBeforeMatching: ["b", "c"],
        cb: (char) => char === "+",
      }),
      "72.02"
    );
    t.end();
  }
);

// 10. EOL matching
// -----------------------------------------------------------------------------

tap.test(
  `73 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(matchLeft("a", 0, "EOL"), false, "73");
    t.end();
  }
);

tap.test(
  `74 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchLeft("a", 0, () => "EOL"),
      "EOL",
      "74"
    );
    t.end();
  }
);

tap.test(
  `75 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - cb blocking result`,
  (t) => {
    t.equal(
      matchLeft("a", 0, () => "EOL", {
        cb: () => {
          return false;
        },
      }),
      false,
      "75"
    );
    t.end();
  }
);

tap.test(
  `76 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`,
  (t) => {
    t.equal(
      matchLeft("a", 0, () => "EOL", {
        cb: () => {
          return true;
        },
      }),
      "EOL",
      "76"
    );
    t.end();
  }
);

tap.test(
  `77 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - useless cb`,
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
  `78 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  (t) => {
    // whitespace trims:
    t.equal(
      matchLeft(" a", 1, () => "EOL"),
      false,
      "78"
    );
    t.end();
  }
);

tap.test(
  `79 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - CHEEKY!!!`,
  (t) => {
    t.equal(
      matchLeft("EOLa", 3, () => "EOL"),
      false,
      "79"
    );
    t.end();
  }
);

tap.test(
  `80 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - !!!`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, "EOL"), "EOL", "80");
    t.end();
  }
);

tap.test(
  `81 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, () => "EOL", {
        trimBeforeMatching: true,
      }),
      "EOL",
      "81"
    );
    t.end();
  }
);

tap.test(
  `82 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  (t) => {
    // character trims:
    t.equal(
      matchLeft("za", 1, () => "EOL"),
      false,
      "82"
    );
    t.end();
  }
);

tap.test(
  `83 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  (t) => {
    t.equal(
      matchLeft("za", 1, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "83"
    );
    t.end();
  }
);

tap.test(
  `84 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opts control`,
  (t) => {
    // trim combos - whitespace+character:
    t.equal(
      matchLeft("z a", 2, () => "EOL"),
      false,
      "84"
    );
    t.end();
  }
);

tap.test(
  `85 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL\u001b[${39}m matching - whitespace trim opt on`,
  (t) => {
    t.equal(
      matchLeft("z a", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "85"
    );
    t.end();
  }
);

// 11. EOL mixed with strings
// -----------------------------------------------------------------------------

tap.test(
  `86 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, ["EOL"]), false, "86");
    t.end();
  }
);

tap.test(
  `87 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, ["EOL", "a"]), false, "87");
    t.end();
  }
);

tap.test(
  `88 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, ["EOL", "z"]), false, "88");
    t.end();
  }
);

tap.test(
  `89 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, ["EOL", () => "EOL"]), "EOL", "89");
    t.end();
  }
);

tap.test(
  `90 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("a", 0, [() => "EOL"]), "EOL", "90");
    t.end();
  }
);

tap.test(
  `91 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mEOL mixed with strings\u001b[${39}m whitespace trims - whitespace trim opts control - one special`,
  (t) => {
    t.equal(matchLeft(" a", 1, [() => "EOL"]), false, "91");
    t.end();
  }
);

// 12. whitespace trims
// -----------------------------------------------------------------------------

tap.test(
  `92 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", () => "EOL"]),
      false,
      "92 - whitespace trim opts control - two specials"
    );
    t.end();
  }
);

tap.test(
  `93 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", "EOL"]),
      false,
      "93 - whitespace trim opts control - special mixed with cheeky"
    );
    t.end();
  }
);

tap.test(
  `94 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, ["EOL"]),
      false,
      "94 - whitespace trim opts control - cheeky only"
    );
    t.end();
  }
);

tap.test(
  `95 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, [() => "EOL"]), false, "95 - CHEEKY!!!");
    t.end();
  }
);

tap.test(
  `96 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, ["EOL"]), "EOL", "96");
    t.end();
  }
);

tap.test(
  `97 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, ["a", () => "EOL"]), false, "97 - CHEEKY!!!");
    t.end();
  }
);

tap.test(
  `98 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("EOLa", 3, ["a", "EOL"]), "EOL", "98");
    t.end();
  }
);

tap.test(
  `99 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "99 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `100 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, ["a", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "100 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `101 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "101 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `102 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mwhitespace trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft(" a", 1, [() => "EOL", "a", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "102 - whitespace trim opt on"
    );
    t.end();
  }
);

// 13. character trims
// -----------------------------------------------------------------------------

tap.test(
  `103 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("za", 1, [() => "EOL"]),
      false,
      "103 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `104 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("za", 1, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "104 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `105 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("za", 1, ["a", () => "EOL"]),
      false,
      "105 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `106 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(matchLeft("za", 1, ["z", () => "EOL"]), "z", "106 - z caught");
    t.end();
  }
);

tap.test(
  `107 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mcharacter trims\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("za", 1, ["a", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "107 - whitespace trim opt on"
    );
    t.end();
  }
);

// 14. trim combos - whitespace+character
// -----------------------------------------------------------------------------

tap.test(
  `108 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("z a", 2, [() => "EOL"]),
      false,
      "108 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `109 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("z a", 2, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "109 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `110 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("z a", 2, ["a", () => "EOL"]),
      false,
      "110 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `111 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("z a", 2, ["a", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "111 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `112 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("z a", 2, ["z", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "z",
      "112 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `113 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("z a", 2, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "113 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `114 - ${`\u001b[${32}m${"matchLeft()"}\u001b[${39}m`}       \u001b[${33}mtrim combos\u001b[${39}m`,
  (t) => {
    t.equal(
      matchLeft("yz a", 2, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      false,
      "114"
    );
    t.end();
  }
);

// 15. futile matching - matchLeftIncl() from zero to the left
// ------------------------------------------------------------------------------

tap.test(
  `115 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(matchLeftIncl("a", 0, "EOL"), false, "115");
    t.end();
  }
);

tap.test(
  `116 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL"),
      false,
      "116"
    );
    t.end();
  }
);

tap.test(
  `117 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL", {
        cb: () => {
          return false;
        },
      }),
      false,
      "117 - cb blocking result"
    );
    t.end();
  }
);

tap.test(
  `118 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchLeftIncl("a", 0, () => "EOL", {
        cb: () => {
          return true;
        },
      }),
      false,
      "118 - useless cb"
    );
    t.end();
  }
);

tap.test(
  `119 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchLeftIncl(" a", 1, () => "EOL"),
      false,
      "119 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `120 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchLeftIncl("EOLa", 3, () => "EOLa"),
      false,
      "120.01"
    );
    t.equal(matchLeftIncl("EOLa", 3, "EOL"), false, "120.02");
    t.end();
  }
);

tap.test(
  `121 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchLeftIncl(" a", 1, () => "EOL", {
        trimBeforeMatching: true,
      }),
      false,
      "121 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `122 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchLeftIncl("za", 1, () => "EOL"),
      false,
      "122 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `123 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchLeftIncl("za", 1, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
      }),
      false,
      "123 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `124 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    // trim combos - whitespace+character:
    t.equal(
      matchLeftIncl("z a", 2, () => "EOL"),
      false,
      "124 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `125 - ${`\u001b[${32}m${"matchLeftIncl()"}\u001b[${39}m`}   \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    t.equal(
      matchLeftIncl("z a", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      false,
      "125 - whitespace trim opt on"
    );
    t.end();
  }
);

// 16. matchRight
// -----------------------------------------------------------------------------

tap.test(
  `126 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(matchRight("a", 0, "EOL"), false, "126");
    t.end();
  }
);

tap.test(
  `127 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRight("a", 0, () => "EOL"),
      "EOL",
      "127"
    );
    t.end();
  }
);

tap.test(
  `128 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRight("a", 0, () => "EOL", {
        cb: () => {
          return false;
        },
      }),
      false,
      "128 - cb blocking result"
    );
    t.end();
  }
);

tap.test(
  `129 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRight("a", 0, () => "EOL", {
        cb: () => {
          return true;
        },
      }),
      "EOL",
      "129 - useless cb, just confirms the incoming truthy result"
    );
    t.end();
  }
);

tap.test(
  `130 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching`,
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
  `131 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, () => "EOL"),
      false,
      "131-1"
    );
    t.end();
  }
);

tap.test(
  `132 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 1, () => "EOL"),
      "EOL",
      "132-2"
    );
    t.end();
  }
);

tap.test(
  `133 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("aEOL", 0, () => "EOL"),
      false,
      "133 - CHEEKY!!!"
    );
    t.end();
  }
);

tap.test(
  `134 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, "EOL"), "EOL", "134 - !!!");
    t.end();
  }
);

tap.test(
  `135 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, () => "EOL", {
        trimBeforeMatching: true,
      }),
      "EOL",
      "135 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `136 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, () => "EOL"),
      false,
      "136 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `137 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "137 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `138 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    // trim combos - whitespace+character:
    t.equal(
      matchRight("a z", 0, () => "EOL"),
      false,
      "138 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `139 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 2, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "139 - whitespace trim opt on"
    );
    t.end();
  }
);

// 17. matchRight() - EOL mixed with strings
// -----------------------------------------------------------------------------

tap.test(
  `140 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, ["EOL"]), false, "140");
    t.end();
  }
);

tap.test(
  `141 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, ["EOL", "a"]), false, "141");
    t.end();
  }
);

tap.test(
  `142 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, ["EOL", "z"]), false, "142");
    t.end();
  }
);

tap.test(
  `143 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, ["EOL", () => "EOL"]), "EOL", "143"); // latter, function was matched
    t.end();
  }
);

tap.test(
  `144 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings`,
  (t) => {
    t.equal(matchRight("a", 0, [() => "EOL"]), "EOL", "144");
    t.end();
  }
);

tap.test(
  `145 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL"]),
      false,
      "145 - whitespace trim opts control - one special"
    );
    t.end();
  }
);

tap.test(
  `146 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", () => "EOL"]),
      false,
      "146 - whitespace trim opts control - two specials"
    );
    t.end();
  }
);

tap.test(
  `147 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", "EOL"]),
      false,
      "147 - whitespace trim opts control - special mixed with cheeky"
    );
    t.end();
  }
);

tap.test(
  `148 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, ["EOL"]),
      false,
      "148 - whitespace trim opts control - cheeky only"
    );
    t.end();
  }
);

tap.test(
  `149 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, [() => "EOL"]), false, "149 - CHEEKY!!!");
    t.end();
  }
);

tap.test(
  `150 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, ["EOL"]), "EOL", "150");
    t.end();
  }
);

tap.test(
  `151 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("aEOL", 0, ["z", () => "EOL"]),
      false,
      "151 - CHEEKY!!!"
    );
    t.end();
  }
);

tap.test(
  `152 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(matchRight("aEOL", 0, ["z", "EOL"]), "EOL", "152");
    t.end();
  }
);

tap.test(
  `153 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "153 - array"
    );
    t.end();
  }
);

tap.test(
  `154 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, ["x", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "154 - other values to match"
    );
    t.end();
  }
);

tap.test(
  `155 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "155 - two identical arrow functions in array, both positive"
    );
    t.end();
  }
);

tap.test(
  `156 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - whitespace trims`,
  (t) => {
    t.equal(
      matchRight("a ", 0, [() => "EOL", "z", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "EOL",
      "156 - two arrow f's in arrray + non-found"
    );
    t.end();
  }
);

tap.test(
  `157 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(matchRight("az", 0, [() => "EOL"]), false, "157 - trim off");
    t.end();
  }
);

tap.test(
  `158 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "158 - character trim opt on"
    );
    t.end();
  }
);

tap.test(
  `159 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, ["x", () => "EOL"]),
      false,
      "159 - wrong character to trim"
    );
    t.end();
  }
);

tap.test(
  `160 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, ["z", () => "EOL"]),
      "z",
      "160 - z caught first, before EOL"
    );
    t.end();
  }
);

tap.test(
  `161 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - character trims`,
  (t) => {
    t.equal(
      matchRight("az", 0, ["a", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
      }),
      "EOL",
      "161 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `162 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    // trim combos - whitespace+character:
    t.equal(
      matchRight("a z", 0, [() => "EOL"]),
      false,
      "162 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `163 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, [() => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "163 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `164 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"]),
      false,
      "164 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `165 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "165 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `166 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, ["z", () => "EOL"], {
        trimBeforeMatching: true,
      }),
      "z",
      "166 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `167 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a z", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      "EOL",
      "167 - unused char to trim"
    );
    t.end();
  }
);

tap.test(
  `168 - ${`\u001b[${32}m${"matchRight()"}\u001b[${39}m`}      \u001b[${33}mEOL\u001b[${39}m EOL mixed with strings - trim combos`,
  (t) => {
    t.equal(
      matchRight("a zy", 0, ["x", () => "EOL"], {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      false,
      "168 - y stands in the way"
    );
    t.end();
  }
);

// 18.

// EOL can never be found using matchRightIncl() or matchLeftIncl() because
// "inclusive" in the name means current character is included in the query to
// match, either in the beginning of it ("matchRightIncl") or end of it
// ("matchLeftIncl"). Since current character can't be EOL, result of both
// matchRightIncl() and matchLeftIncl() that search for EOL will always be "false".

tap.test(
  `169 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(matchRightIncl("a", 0, "EOL"), false, "169");
    t.end();
  }
);

tap.test(
  `170 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL"),
      false,
      "170"
    );
    t.end();
  }
);

tap.test(
  `171 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL", {
        cb: () => {
          return false;
        },
      }),
      false,
      "171 - cb blocking, but still useless, result was false before cb kicked in"
    );
    t.end();
  }
);

tap.test(
  `172 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching`,
  (t) => {
    t.equal(
      matchRightIncl("a", 0, () => "EOL", {
        cb: () => {
          return true;
        },
      }),
      false,
      "172 - useless cb"
    );
    t.end();
  }
);

tap.test(
  `173 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRightIncl("a ", 0, () => "EOL"),
      false,
      "173 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `174 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRightIncl("aEOL", 0, () => "aEOL"),
      false,
      "174"
    );
    t.end();
  }
);

tap.test(
  `175 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(matchRightIncl("aEOL", 0, "EOL"), false, "175");
    t.end();
  }
);

tap.test(
  `176 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - whitespace trims`,
  (t) => {
    t.equal(
      matchRightIncl("a ", 0, () => "EOL", {
        trimBeforeMatching: true,
      }),
      false,
      "176 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `177 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchRightIncl("az", 0, () => "EOL"),
      false,
      "177 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `178 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - character trims`,
  (t) => {
    t.equal(
      matchRightIncl("az", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
      }),
      false,
      "178 - whitespace trim opt on"
    );
    t.end();
  }
);

tap.test(
  `179 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    // whitespace+character:
    t.equal(
      matchRightIncl("a z", 0, () => "EOL"),
      false,
      "179 - whitespace trim opts control"
    );
    t.end();
  }
);

tap.test(
  `180 - ${`\u001b[${32}m${"matchRightIncl()"}\u001b[${39}m`}  \u001b[${33}mEOL\u001b[${39}m matching - trim combos`,
  (t) => {
    t.equal(
      matchRightIncl("a z", 0, () => "EOL", {
        trimCharsBeforeMatching: ["z"],
        trimBeforeMatching: true,
      }),
      false,
      "180 - whitespace trim + character trim"
    );
    t.end();
  }
);

// 13. Ad-hoc
// -----------------------------------------------------------------------------

tap.test(
  `181 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(matchRight('<a class="something"> text', 19, ">"), ">", "181");
    t.end();
  }
);

tap.test(
  `182 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRight('<a class="something"> text', 19, ">", {
        cb: (char) => typeof char === "string" && char.trim() === "",
      }),
      ">",
      "182"
    );
    t.end();
  }
);

tap.test(
  `183 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRightIncl('<a class="something"> text', 20, "> t"),
      "> t",
      "183"
    );
    t.end();
  }
);

tap.test(
  `184 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(matchRight('<a class="something"> text', 19, "> t"), "> t", "184");
    t.end();
  }
);

tap.test(
  `185 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRight("ab      cdef", 1, "cde", { trimBeforeMatching: true }),
      "cde",
      "185"
    );
    t.end();
  }
);

tap.test(
  `186 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRight('<a class="something"> text', 19, ">", {
        cb: (char) => char === " ",
      }),
      ">",
      "186"
    );
    t.end();
  }
);

tap.test(
  `187 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    t.equal(
      matchRight("ab      cdef", 1, "cde", {
        cb: (char) => char === "f",
        trimBeforeMatching: true,
      }),
      "cde",
      "187"
    );
    t.end();
  }
);

tap.test(
  `188 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, tests set #01`,
  (t) => {
    matchRight("ab      cdef", 1, "cd", {
      trimBeforeMatching: true,
      cb: (char, theRemainderOfTheString, index) => {
        t.equal(char, "e");
        t.equal(theRemainderOfTheString, "ef");
        t.equal(index, 10);
      },
    });
    t.end();
  }
);

tap.test(`189 - ${`\u001b[${35}m${"ADHOC"}\u001b[${39}m`}, set #02`, (t) => {
  t.equal(
    matchRight("a<!DOCTYPE html>b", 1, ["!--", "doctype", "xml", "cdata"], {
      i: true,
      trimCharsBeforeMatching: ["?", "!", "[", " ", "-"],
    }),
    "doctype",
    "189"
  );
  t.end();
});
