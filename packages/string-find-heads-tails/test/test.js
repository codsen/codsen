import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { strFindHeadsTails } from "../dist/string-find-heads-tails.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - throws when the first argument, source string, is not a string", () => {
  throws(
    () => {
      strFindHeadsTails(1);
    },
    /THROW_ID_02/,
    "01.01",
  );
  throws(
    () => {
      strFindHeadsTails(1, "a", "b");
    },
    /THROW_ID_02/,
    "01.02",
  );
});

test("02 - throws when there's no input", () => {
  throws(
    () => {
      strFindHeadsTails();
    },
    /THROW_ID_02/,
    "02.01",
  );
});

test("03 - throws when the second argument, heads, is not a string", () => {
  throws(
    () => {
      strFindHeadsTails("a", 1, "a");
    },
    /THROW_ID_03/,
    "03.01",
  );

  throws(
    () => {
      strFindHeadsTails("a", 1, "z");
    },
    /THROW_ID_03/,
    "03.02",
  );

  throws(
    () => {
      strFindHeadsTails("a", 1, "a");
    },
    /THROW_ID_03/,
    "03.03",
  );

  throws(
    () => {
      strFindHeadsTails("a", "", "z");
    },
    /THROW_ID_04/,
    "03.04",
  );

  throws(
    () => {
      strFindHeadsTails("a", [], "z");
    },
    /THROW_ID_05/,
    "03.05",
  );

  throws(
    () => {
      strFindHeadsTails("a", ["z", 1, null], ["z"]);
    },
    /THROW_ID_06/,
    "03.06",
  );

  throws(
    () => {
      strFindHeadsTails("a", ["z", 1, undefined], "z");
    },
    /THROW_ID_06/,
    "03.07",
  );

  throws(
    () => {
      strFindHeadsTails("a", ["z", true], "z");
    },
    /THROW_ID_06/,
    "03.08",
  );

  throws(
    () => {
      strFindHeadsTails("a", ["b", ""], "c");
    },
    /THROW_ID_07/,
    "03.09",
  );
});

test("04 - throws when the third argument, tails, is not a string", () => {
  throws(
    () => {
      strFindHeadsTails("a", "a");
    },
    /THROW_ID_08/,
    "04.01",
  );

  throws(
    () => {
      strFindHeadsTails("a", "a", null);
    },
    /THROW_ID_08/,
    "04.02",
  );

  throws(
    () => {
      strFindHeadsTails("a", "a", 1);
    },
    /THROW_ID_08/,
    "04.03",
  );

  throws(
    () => {
      strFindHeadsTails("a", "a", "");
    },
    /THROW_ID_09/,
    "04.04",
  );

  throws(
    () => {
      strFindHeadsTails("a", "a", []);
    },
    /THROW_ID_10/,
    "04.05",
  );

  throws(
    () => {
      strFindHeadsTails("a", "a", ["z", 1]);
    },
    /THROW_ID_11/,
    "04.06",
  );

  throws(
    () => {
      strFindHeadsTails("a", "a", [null]);
    },
    /THROW_ID_11/,
    "04.07",
  );

  throws(
    () => {
      strFindHeadsTails("a", "a", [true]);
    },
    /THROW_ID_11/,
    "04.08",
  );

  throws(
    () => {
      strFindHeadsTails("a", "a", ["z", ""]);
    },
    /THROW_ID_12/,
    "04.09",
  );
});

test("05 - throws when the fourth argument, opts, is of a wrong type", () => {
  throws(
    () => {
      strFindHeadsTails("a", "a", "a", "a");
    },
    /THROW_ID_01/,
    "05.01",
  );

  not.throws(() => {
    strFindHeadsTails("a", "a", "a", null); // falsey is OK
  }, "05.02");
  not.throws(() => {
    strFindHeadsTails("a", "a", "a", undefined); // falsey is OK
  }, "05.03");
  not.throws(() => {
    strFindHeadsTails("a", "a", "a", { fromIndex: "1" }); // OK, will be parsed
  }, "05.04");
  not.throws(() => {
    strFindHeadsTails("a", "a", "a", { fromIndex: 1 }); // canonical
  }, "05.05");
});

test("06 - opts.fromIndex is not a natural number", () => {
  // not a natural number
  throws(
    () => {
      strFindHeadsTails("a", "a", "a", { fromIndex: 1.5 });
    },
    /THROW_ID_18/,
    "06.01",
  );
});

test("07 - opts.fromIndex is not a natural number", () => {
  // not a natural number
  throws(
    () => {
      strFindHeadsTails("a", "a", "a", { fromIndex: 1.5, source: "TEST 1.8:" });
    },
    /THROW_ID_18/,
    "07.01",
  );
});

test("08 - unmatched heads and tails", () => {
  throws(
    () => {
      strFindHeadsTails("abc%%_def_%ghi", "%%_", "_%%");
    },
    /THROW_ID_22/,
    "08.01",
  ); // sneaky - tails' second percentage char is missing, hence unrecognised and throws

  throws(
    () => {
      strFindHeadsTails("abcdef", "x", "e"); // heads not found
    },
    /THROW_ID_21/,
    "08.02",
  );

  throws(
    () => {
      strFindHeadsTails("abcdef", "x", ["e", "$"]); // heads not found
    },
    /THROW_ID_21/,
    "08.03",
  );

  throws(
    () => {
      strFindHeadsTails("abcdef", ["_", "x"], ["e", "$"]); // heads not found
    },
    /THROW_ID_21/,
    "08.04",
  );

  throws(
    () => {
      strFindHeadsTails("abcdef", ["_", "x"], ["e", "$"], {
        source: "TEST 4.2:",
      }); // heads not found
    },
    /TEST 4\.2/,
    "08.05",
  );

  throws(
    () => {
      strFindHeadsTails("abcdef", "b", "x"); // tails not found
    },
    /THROW_ID_22/,
    "08.06",
  );

  throws(
    () => {
      strFindHeadsTails("abcdef", "b", "x", { source: "TEST 5.2:" }); // tails not found
    },
    /TEST 5\.2/,
    "08.07",
  );

  throws(
    () => {
      strFindHeadsTails("abcdef", ["&", "b"], "x"); // tails not found
    },
    /THROW_ID_22/,
    "08.08",
  );

  not.throws(() => {
    strFindHeadsTails("abcdef", "x", "z"); // both heads and tails not found - OK
  }, "08.09");
});

test("09 - both heads and tails found but wrong order", () => {
  throws(
    () => {
      strFindHeadsTails("abc___def---ghi", "---", "___"); // opposite order
    },
    /THROW_ID_22/,
    "09.01",
  );

  throws(
    () => {
      strFindHeadsTails("abc___def---ghi", ["***", "---"], "___"); // opposite order
    },
    /THROW_ID_22/,
    "09.02",
  );

  throws(
    () => {
      strFindHeadsTails("abc___def---ghi", ["***", "---"], ["^^^", "___"]); // opposite order
    },
    /THROW_ID_22/,
    "09.03",
  );

  throws(
    () => {
      strFindHeadsTails("--a__bcdef**", ["--", "__"], ["**", "^^"]); // two consecutive heads
    },
    /THROW_ID_19/,
    "09.04",
  );

  throws(
    () => {
      strFindHeadsTails("--a__bcdef**", ["--", "__"], ["**", "^^"], {
        source: "TEST 4.3:",
      }); // two consecutive heads
    },
    /TEST 4\.3/,
    "09.05",
  );

  throws(
    () => {
      strFindHeadsTails("--a**bcdefghij^^", ["--", "__"], ["**", "^^"]); // two consecutive tails
    },
    /THROW_ID_21/,
    "09.06",
  );

  throws(
    () => {
      strFindHeadsTails("--a^^bc__defghij", ["--", "__"], ["**", "^^"]); // second heads unmatched
    },
    /THROW_ID_22/,
    "09.07",
  );
});

test("10 - heads of one type, tails of another", () => {
  equal(
    strFindHeadsTails(
      "some text %%_var1-%% more text %%_var2_%%",
      ["%%_", "%%-"],
      ["-%%", "_%%"],
    ),
    [
      {
        headsStartAt: 10,
        headsEndAt: 13,
        tailsStartAt: 17,
        tailsEndAt: 20,
      },
      {
        headsStartAt: 31,
        headsEndAt: 34,
        tailsStartAt: 38,
        tailsEndAt: 41,
      },
    ],
    "10.01",
  );
});

test("11 - heads of one type, tails of another", () => {
  throws(
    () => {
      strFindHeadsTails(
        "some text %%_var1-%% more text %%_var2_%%",
        ["%%_", "%%-"],
        ["_%%", "-%%"],
        {
          matchHeadsAndTailsStrictlyInPairsByTheirOrder: true,
        },
      );
    },
    /THROW_ID_20/,
    "11.01",
  );
});

test("12 - heads of one type, tails of another", () => {
  throws(
    () => {
      strFindHeadsTails(
        "some text %%_var1-%% more text %%_var2_%%",
        ["%%_", "%%-"],
        ["_%%", "-%%"],
        {
          matchHeadsAndTailsStrictlyInPairsByTheirOrder: true,
          source: "TEST 1.08:",
        },
      );
    },
    /TEST 1\.08/,
    "12.01",
  );
});

test("13 - heads of one type, tails of another", () => {
  // let's just prove that it error message is not about empty opts.source but
  // still about the same index mismatch as the tests above
  throws(
    () => {
      strFindHeadsTails(
        "some text %%_var1-%% more text %%_var2_%%",
        ["%%_", "%%-"],
        ["_%%", "-%%"],
        {
          matchHeadsAndTailsStrictlyInPairsByTheirOrder: true,
          source: "", // <------ EMPTY
        },
      );
    },
    /the tails the followed it were not of the same index/,
    "13.01",
  );
});

test("14 - sequences are treated correctly by opts.matchHeadsAndTailsStrictlyInPairsByTheirOrder", () => {
  equal(
    strFindHeadsTails(
      "some text -%%-var1-%%- more text _%%_var2_%%_ and even more -%%-var3-%%-.",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
      { matchHeadsAndTailsStrictlyInPairsByTheirOrder: false },
    ),
    [
      {
        headsStartAt: 11,
        headsEndAt: 14,
        tailsStartAt: 18,
        tailsEndAt: 21,
      },
      {
        headsStartAt: 34,
        headsEndAt: 37,
        tailsStartAt: 41,
        tailsEndAt: 44,
      },
      {
        headsStartAt: 61,
        headsEndAt: 64,
        tailsStartAt: 68,
        tailsEndAt: 71,
      },
    ],
    "14.01",
  );
  equal(
    strFindHeadsTails(
      "some text -%%-var1-%%- more text _%%_var2_%%_ and even more -%%-var3-%%-.",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
      { matchHeadsAndTailsStrictlyInPairsByTheirOrder: true },
    ),
    [
      {
        headsStartAt: 11,
        headsEndAt: 14,
        tailsStartAt: 18,
        tailsEndAt: 21,
      },
      {
        headsStartAt: 34,
        headsEndAt: 37,
        tailsStartAt: 41,
        tailsEndAt: 44,
      },
      {
        headsStartAt: 61,
        headsEndAt: 64,
        tailsStartAt: 68,
        tailsEndAt: 71,
      },
    ],
    "14.02",
  );
  equal(
    strFindHeadsTails(
      "some text _%-var1-%_ more text _%_var2_%_ and even more -%-var3-%- and -%_var4_%-.",
      ["%_", "%-"],
      ["_%", "-%"],
      { matchHeadsAndTailsStrictlyInPairsByTheirOrder: true },
    ),
    [
      {
        headsStartAt: 11,
        headsEndAt: 13,
        tailsStartAt: 17,
        tailsEndAt: 19,
      },
      {
        headsStartAt: 32,
        headsEndAt: 34,
        tailsStartAt: 38,
        tailsEndAt: 40,
      },
      {
        headsStartAt: 57,
        headsEndAt: 59,
        tailsStartAt: 63,
        tailsEndAt: 65,
      },
      {
        headsStartAt: 72,
        headsEndAt: 74,
        tailsStartAt: 78,
        tailsEndAt: 80,
      },
    ],
    "14.03",
  );
});

// -----------------------------------------------------------------------------
// 02. normal use, no third arg in the input
// -----------------------------------------------------------------------------

test("15 - single char markers", () => {
  equal(
    strFindHeadsTails("abcdef", "b", "e"),
    [
      {
        headsStartAt: 1,
        headsEndAt: 2,
        tailsStartAt: 4,
        tailsEndAt: 5,
      },
    ],
    "15.01",
  );
  equal(
    strFindHeadsTails("ab", "a", "b"),
    [
      {
        headsStartAt: 0,
        headsEndAt: 1,
        tailsStartAt: 1,
        tailsEndAt: 2,
      },
    ],
    "15.02",
  );
});

test("16 - multi-char markers", () => {
  equal(
    strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%"),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12,
      },
    ],
    "16.01",
  );
  // fromIndex prevented heads from being caught. Tails were caught, but
  // since opts.throwWhenSomethingWrongIsDetected is on, error is thrown.
  throws(
    () => {
      strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%", { fromIndex: 4 });
    },
    /THROW_ID_21/,
    "16.02",
  );

  equal(
    strFindHeadsTails("abc%%_def_%%ghi", "%%_", "_%%", {
      fromIndex: 4,
      throwWhenSomethingWrongIsDetected: false,
    }),
    [],
    "16.03",
  );
  equal(
    strFindHeadsTails("abczz-def--aghi", "zz-", "--a"),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12,
      },
    ],
    "16.04",
  );
  equal(
    strFindHeadsTails(
      "abc%%_def_%%ghi%%-jkl-%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
    ),
    [
      {
        headsStartAt: 3,
        headsEndAt: 6,
        tailsStartAt: 9,
        tailsEndAt: 12,
      },
      {
        headsStartAt: 15,
        headsEndAt: 18,
        tailsStartAt: 21,
        tailsEndAt: 24,
      },
    ],
    "16.05",
  );
});

test('17 - sneaky "casual" underscores try to blend in with legit heads/tails', () => {
  equal(
    strFindHeadsTails("aaa_%%_bbb_%%_ccc", "%%_", "_%%"),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 10,
        tailsEndAt: 13,
      },
    ],
    "17.01",
  );
});

test("18 - sneaky tails precede heads", () => {
  throws(
    () => {
      strFindHeadsTails("aaa_%%bbb%%_ccc", "%%_", "_%%");
    },
    /THROW_ID_22/,
    "18.01",
  );

  equal(
    strFindHeadsTails("aaa_%%bbb%%_ccc", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: false,
    }),
    [],
    "18.02",
  );
});

test("19 - arrays of heads and tails", () => {
  equal(
    strFindHeadsTails(
      "zzz_%%-zz_cmp_id-%%_%%-lnk_id-%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
    ),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 16,
        tailsEndAt: 19,
      },
      {
        headsStartAt: 20,
        headsEndAt: 23,
        tailsStartAt: 29,
        tailsEndAt: 32,
      },
    ],
    "19.01",
  );
});

test("20 - input is equal to heads or tails", () => {
  equal(
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: false,
    }),
    [],
    "20.01",
  );
  equal(
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true,
    }),
    [],
    "20.02",
  );
  equal(
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: true,
      allowWholeValueToBeOnlyHeadsOrTails: true,
    }),
    [],
    "20.03",
  );
  equal(
    strFindHeadsTails("%%_", "%%_", "_%%", {
      throwWhenSomethingWrongIsDetected: false,
      allowWholeValueToBeOnlyHeadsOrTails: true,
    }),
    [],
    "20.04",
  );
  // only this settings combo will cause a throw:
  throws(
    () => {
      strFindHeadsTails("%%_", "%%_", "_%%", {
        throwWhenSomethingWrongIsDetected: true,
        allowWholeValueToBeOnlyHeadsOrTails: false,
      });
    },
    /THROW_ID_16/,
    "20.05",
  );

  throws(
    () => {
      strFindHeadsTails("%%_", "%%_", "_%%", {
        throwWhenSomethingWrongIsDetected: true,
        allowWholeValueToBeOnlyHeadsOrTails: false,
        source: "TEST 1.6",
      });
    },
    /TEST 1\.6/,
    "20.06",
  );

  throws(
    () => {
      strFindHeadsTails("%%_", "%%_", "_%%", {
        throwWhenSomethingWrongIsDetected: true,
        allowWholeValueToBeOnlyHeadsOrTails: false,
        source: "someLib [CUSTOM_THROW_99]:",
      });
    },
    /CUSTOM/,
    "20.07",
  );

  // equal to tails
  throws(
    () => {
      strFindHeadsTails("_%%", "%%_", "_%%", {
        throwWhenSomethingWrongIsDetected: true,
        allowWholeValueToBeOnlyHeadsOrTails: false,
      });
    },
    /THROW_ID_17/,
    "20.08",
  );

  throws(
    () => {
      strFindHeadsTails("_%%", "%%_", "_%%", {
        throwWhenSomethingWrongIsDetected: true,
        allowWholeValueToBeOnlyHeadsOrTails: false,
        source: "TEST 3.2",
      });
    },
    /TEST 3\.2/,
    "20.09",
  );
});

test("21 - more clashing with outside characters", () => {
  equal(
    strFindHeadsTails(
      "aaa_%%-bbb-%%_%%-ccc-%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
    ),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 10,
        tailsEndAt: 13,
      },
      {
        headsStartAt: 14,
        headsEndAt: 17,
        tailsStartAt: 20,
        tailsEndAt: 23,
      },
    ],
    "21.01",
  );
  equal(
    strFindHeadsTails(
      "aaa_%%-bbb-%%_%%-ccc-%%",
      ["%%_", "%%-"],
      ["_%%", "-%%"],
      {
        relaxedAPI: true,
      },
    ),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 10,
        tailsEndAt: 13,
      },
      {
        headsStartAt: 14,
        headsEndAt: 17,
        tailsStartAt: 20,
        tailsEndAt: 23,
      },
    ],
    "21.02",
  );
});

// -----------------------------------------------------------------------------
// 03. opts.relaxedAPI
// -----------------------------------------------------------------------------

test("22 - opts.relaxedAPI - input string", () => {
  equal(
    strFindHeadsTails(undefined, "%%_", "_%%", { relaxedAPI: true }),
    [],
    "22.01",
  );
  equal(strFindHeadsTails("", "%%_", "_%%", { relaxedAPI: true }), [], "22.02");
  equal(
    strFindHeadsTails(null, "%%_", "_%%", { relaxedAPI: true }),
    [],
    "22.03",
  );
});

test("23 - opts.relaxedAPI - heads", () => {
  equal(
    strFindHeadsTails("aaa", undefined, "_%%", { relaxedAPI: true }),
    [],
    "23.01",
  );
  equal(strFindHeadsTails("aaa", "", "_%%", { relaxedAPI: true }), [], "23.02");
  equal(strFindHeadsTails("aaa", [], "_%%", { relaxedAPI: true }), [], "23.03");
  equal(
    strFindHeadsTails("aaa", [""], "_%%", { relaxedAPI: true }),
    [],
    "23.04",
  );
  equal(
    strFindHeadsTails("aaa", null, "_%%", { relaxedAPI: true }),
    [],
    "23.05",
  );
  equal(
    strFindHeadsTails("aaa", [null], "_%%", { relaxedAPI: true }),
    [],
    "23.06",
  );
  equal(
    strFindHeadsTails(
      "aaa %%_test_%% bbb",
      ["", "%%_", undefined, 1],
      ["_%%", "", null],
      { relaxedAPI: true },
    ),
    [
      {
        headsStartAt: 4,
        headsEndAt: 7,
        tailsStartAt: 11,
        tailsEndAt: 14,
      },
    ],
    "23.07",
  );
});

test("24 - opts.relaxedAPI - tails", () => {
  equal(
    strFindHeadsTails("aaa", "%%_", undefined, { relaxedAPI: true }),
    [],
    "24.01",
  );
  equal(strFindHeadsTails("aaa", "%%_", "", { relaxedAPI: true }), [], "24.02");
  equal(strFindHeadsTails("aaa", "%%_", [], { relaxedAPI: true }), [], "24.03");
  equal(
    strFindHeadsTails("aaa", "%%_", [""], { relaxedAPI: true }),
    [],
    "24.04",
  );
  equal(
    strFindHeadsTails("aaa", "%%_", null, { relaxedAPI: true }),
    [],
    "24.05",
  );
  equal(
    strFindHeadsTails("aaa", "%%_", [null, 1], { relaxedAPI: true }),
    [],
    "24.06",
  );
});

test.run();
