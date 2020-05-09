import tap from "tap";
import {
  // matchLeftIncl,
  // matchRightIncl,
  matchLeft,
  // matchRight,
} from "../dist/string-match-left-right.esm";

// matchLeft()
// -----------------------------------------------------------------------------

tap.test(
  `01 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          on a simple string`,
  (t) => {
    t.equal(matchLeft("abc", 2, "b"), "b", "01.01");
    t.equal(
      matchLeft("abcdefghi", 3, ["abc"]),
      "abc",
      "01.02 - one elem to match"
    );
    t.equal(
      matchLeft("abcdefghi", 3, ["c", "bc"]),
      "c", // first one matched returned, although both did match
      "01.03 - multiple to match"
    );
    t.equal(matchLeft("abcdefghi", 3, ["aaa", "bc"]), "bc", "01.04");
    t.equal(matchLeft("abcdefghi", 3, ["aaa", "zzz"]), false, "01.05");
    t.equal(matchLeft("abcdefghi", 99, ["aaa", "zzz"]), false, "01.06");
    t.equal(matchLeft("abc", 2, "zab"), false, "01.07");
    t.end();
  }
);

tap.test(
  `02 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          case insensitive`,
  (t) => {
    t.equal(matchLeft("abc", 2, "B"), false, "02.01 - control");
    t.equal(matchLeft("abc", 2, "B", { i: true }), "B", "02.02 - opts.i");
    t.end();
  }
);

tap.test(
  `03 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, three-char set`,
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
      "03.01"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      false, // because "d" was not matched
      "03.02"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      "bcd",
      "03.03"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      false,
      "03.04"
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
      "03.05"
    );
    t.equal(
      matchLeft("_ab.defghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      "bcd",
      "03.06"
    );
    t.equal(
      matchLeft("_ab.defghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      "bcd",
      "03.07"
    );
    t.equal(
      matchLeft("_ab.defghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      "bcd",
      "03.08"
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
      "03.09"
    );
    t.equal(
      matchLeft("_a.cdefghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: true, // that's "b"
      }),
      false,
      "03.10"
    );
    t.equal(
      matchLeft("_a.cdefghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: false, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      "bcd",
      "03.11"
    );
    t.equal(
      matchLeft("_a.cdefghi", 5, ["bcd"], {
        maxMismatches: 1,
        firstMustMatch: true, // that's "d"
        lastMustMatch: false, // that's "b"
      }),
      "bcd",
      "03.12"
    );

    t.end();
  }
);

tap.test(
  `04 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, two-char set`,
  (t) => {
    // lastMustMatch=false
    t.equal(
      matchLeft("_abc.efghi", 5, ["zc"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "04.01"
    );
    t.equal(
      matchLeft("_abc.efghi", 4, ["zc"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      "zc",
      "04.02"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["cz"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: false,
      }),
      false,
      "04.03"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["cz"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: false,
      }),
      "cz",
      "04.04"
    );

    // lastMustMatch=true
    t.equal(
      matchLeft("_abc.efghi", 5, ["zc"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "04.05"
    );
    t.equal(
      matchLeft("_abc.efghi", 4, ["zc"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "04.06"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["cz"], {
        maxMismatches: 1,
        firstMustMatch: true,
        lastMustMatch: true,
      }),
      false,
      "04.07"
    );
    t.equal(
      matchLeft("_abc.efghi", 5, ["cz"], {
        maxMismatches: 1,
        firstMustMatch: false,
        lastMustMatch: true,
      }),
      "cz",
      "04.08"
    );
    t.end();
  }
);

tap.test(
  `05 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, pin the maxMismatches cut-off point, protruding value`,
  (t) => {
    //
    // firstMustMatch = true
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 1,
        firstMustMatch: true,
      }),
      false,
      "05.01"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 2,
        firstMustMatch: true,
      }),
      false,
      "05.02"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 3,
        firstMustMatch: true,
      }),
      false,
      "05.03"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 4,
        firstMustMatch: true,
      }),
      false,
      "05.04"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 5,
        firstMustMatch: true,
      }),
      ".....d",
      "05.05"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 99,
        firstMustMatch: true,
      }),
      ".....d",
      "05.06"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 0,
        firstMustMatch: true,
      }),
      false,
      "05.07"
    );

    //
    // firstMustMatch = false
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 1,
        firstMustMatch: false,
      }),
      false,
      "05.08"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 2,
        firstMustMatch: false,
      }),
      false,
      "05.09"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 3,
        firstMustMatch: false,
      }),
      false,
      "05.10"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 4,
        firstMustMatch: false,
      }),
      false,
      "05.11"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 5,
        firstMustMatch: false,
      }),
      ".....d",
      "05.12"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 99,
        firstMustMatch: false,
      }),
      ".....d",
      "05.13"
    );
    t.equal(
      matchLeft("_abcdef", 5, [".....d"], {
        maxMismatches: 0,
        firstMustMatch: false,
      }),
      false,
      "05.14"
    );
    t.end();
  }
);

tap.test(
  `06 - ${`\u001b[${31}m${"matchLeft()"}\u001b[${39}m`}          opts.maxMismatches === 1, pin the maxMismatches cut-off point, non-protruding value`,
  (t) => {
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 1,
        firstMustMatch: true,
      }),
      false,
      "06.01"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 2,
        firstMustMatch: true,
      }),
      false,
      "06.02"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 3,
        firstMustMatch: true,
      }),
      false,
      "06.03"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 4,
        firstMustMatch: true,
      }),
      "....d",
      "06.04"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 5,
        firstMustMatch: true,
      }),
      "....d",
      "06.05"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 99,
        firstMustMatch: true,
      }),
      "....d",
      "06.06"
    );
    t.equal(
      matchLeft("_abcdef", 5, ["....d"], {
        maxMismatches: 0,
        firstMustMatch: true,
      }),
      false,
      "06.07"
    );
    t.end();
  }
);
