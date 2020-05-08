import tap from "tap";
import {
  left,
  leftStopAtNewLines,
  right,
  rightStopAtNewLines,
  leftSeq,
  rightSeq,
  chompLeft,
  chompRight,
} from "../dist/string-left-right.esm";

// 00. EDGE CASES (there are no throws as it's an internal library)
// -----------------------------------------------------------------------------

tap.test(`01 - \u001b[${33}m${`null`}\u001b[${39}m - missing input`, (t) => {
  t.equal(left(), null, "01.01");
  t.equal(right(), null, "01.02");
  t.equal(leftSeq(), null, "01.03");
  t.equal(rightSeq(), null, "01.04");
  t.end();
});

tap.test(`02 - \u001b[${33}m${`null`}\u001b[${39}m - non-string input`, (t) => {
  t.equal(left(1), null, "02.01");
  t.equal(right(1), null, "02.02");
  t.equal(leftSeq(1, 1, "a"), null, "02.03");
  t.equal(rightSeq(1, 1, "a"), null, "02.04");
  t.end();
});

tap.test(`03 - \u001b[${33}m${`null`}\u001b[${39}m - non-string input`, (t) => {
  t.equal(left(null), null, "03.01");
  t.equal(left(null, 1), null, "03.02");
  t.equal(right(null), null, "03.03");
  t.equal(right(null, 1), null, "03.04");
  t.equal(leftSeq(null), null, "03.05");
  t.equal(leftSeq(null, 1), null, "03.06");
  t.equal(rightSeq(null), null, "03.07");
  t.equal(rightSeq(null, 1), null, "03.08");
  t.end();
});

// 01. left()
// -----------------------------------------------------------------------------

tap.test(
  `04 - \u001b[${31}m${`left`}\u001b[${39}m - null result cases`,
  (t) => {
    t.equal(left("abc"), null, "04.01 - assumed default");
    t.equal(left("abc", 0), null, "04.02 - hardcoded default");
    t.equal(left("abc", null), null, "04.03 - hardcoded default");
    t.equal(left("abc", 4), 2, "04.04 - at string.length + 1");
    t.equal(left("abc", 9), 2, "04.05 - outside of the string.length");
    t.equal(left(""), null, "04.06");
    t.equal(left("", 0), null, "04.07");
    t.equal(left("", null), null, "04.08");
    t.equal(left("", undefined), null, "04.09");
    t.equal(left("", 1), null, "04.10");
    t.end();
  }
);

tap.test(`05 - \u001b[${31}m${`left`}\u001b[${39}m - normal use`, (t) => {
  t.notOk(!!left(""), "05.01");
  t.notOk(!!left("a"), "05.02");
  t.equal(left("ab", 1), 0, "05.03");
  t.equal(left("a b", 2), 0, "05.04");
  t.equal(left("a \n\n\nb", 5), 0, "05.05");
  t.equal(left("\n\n\n\n", 4), null, "05.06");
  t.equal(left("\n\n\n\n", 3), null, "05.07");
  t.equal(left("\n\n\n\n", 2), null, "05.08");
  t.equal(left("\n\n\n\n", 1), null, "05.09");
  t.equal(left("\n\n\n\n", 0), null, "05.10");
  t.end();
});

// 02. right()
// -----------------------------------------------------------------------------

tap.test(
  `06 - \u001b[${34}m${`right`}\u001b[${39}m - calling at string length`,
  (t) => {
    t.equal(right(""), null, "06.01");
    t.equal(right("", null), null, "06.02");
    t.equal(right("", undefined), null, "06.03");
    t.equal(right("", 0), null, "06.04");
    t.equal(right("", 1), null, "06.05");
    t.equal(right("", 99), null, "06.06");
    t.equal(right("abc", 3), null, "06.07");
    t.equal(right("abc", 99), null, "06.08");
    t.end();
  }
);

tap.test(`07 - \u001b[${34}m${`right`}\u001b[${39}m - normal use`, (t) => {
  t.notOk(!!right(""), "07.01");
  t.notOk(!!right("a"), "07.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  t.equal(right("ab"), 1, "07.03");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  t.equal(right("a b"), 2, "07.04");

  t.equal(right("a \n\n\nb"), 5, "07.05");
  t.equal(right("a \n\n\n\n"), null, "07.06");
  t.end();
});

// 03. rightSeq()
// -----------------------------------------------------------------------------

tap.test(`08 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - normal use`, (t) => {
  // starts at "c":
  t.same(
    rightSeq("abcdefghijklmnop", 2, "d"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 3,
    },
    "08.01"
  );
  t.same(
    rightSeq("abcdefghijklmnop", 2, "d", "e", "f"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 5,
    },
    "08.02"
  );
  t.same(
    rightSeq("a  b  c  d  e  f  g  h  i  j  k  l", 6, "d", "e", "f"),
    {
      gaps: [
        [7, 9],
        [10, 12],
        [13, 15],
      ],
      leftmostChar: 9,
      rightmostChar: 15,
    },
    "08.03"
  );
  t.end();
});

tap.test(`09 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - no findings`, (t) => {
  t.equal(rightSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "09");
  t.end();
});

tap.test(
  `10 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - absent skips to right()`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 0, "", ""), null, "10.01");
    t.same(
      rightSeq("abcdefghijklmnop", 0, "b", ""),
      {
        gaps: [],
        leftmostChar: 1,
        rightmostChar: 1,
      },
      "10.02"
    );
    t.same(
      rightSeq("abcdefghijklmnop", 0, "", "b"),
      {
        gaps: [],
        leftmostChar: 1,
        rightmostChar: 1,
      },
      "10.03"
    );
    t.end();
  }
);

tap.test(
  `11 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - no sequence arguments - turns into right()`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 0), 1, "11.01");
    t.equal(rightSeq("abcdefghijklmnop", 1), 2, "11.02");
    t.equal(rightSeq("ab  cdefghijklmnop", 1), 4, "11.03");
    t.end();
  }
);

tap.test(
  `12 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - starting point outside of the range`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "12");
    t.end();
  }
);

tap.test(
  `13 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - optional - existing`,
  (t) => {
    t.same(
      rightSeq("abcdefghijklmnop", 2, "d?", "e?", "f"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 5,
      },
      "13"
    );
    t.end();
  }
);

tap.test(
  `14 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - 1 not existing, no whitespace`,
  (t) => {
    t.same(
      rightSeq("abcefghijklmnop", 2, "d?", "e", "f"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 4,
      },
      "14"
    );
    t.end();
  }
);

tap.test(
  `15 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - 1 not existing, with whitespace`,
  (t) => {
    t.same(
      rightSeq("abc  e   f   g   hijklmnop", 2, "d?", "e", "f"),
      {
        gaps: [
          [3, 5],
          [6, 9],
        ],
        leftmostChar: 5,
        rightmostChar: 9,
      },
      "15"
    );
    t.end();
  }
);

tap.test(
  `16 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - ends with non-existing optional`,
  (t) => {
    t.same(
      rightSeq("abc  e   f   g   hijklmnop", 2, "y?", "e", "z?"),
      {
        gaps: [[3, 5]],
        leftmostChar: 5,
        rightmostChar: 5,
      },
      "16"
    );
    t.end();
  }
);

tap.test(
  `17 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - all optional, existing`,
  (t) => {
    t.same(
      rightSeq("abcdefghijklmnop", 2, "d?", "e?", "f?"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 5,
      },
      "17"
    );
    t.end();
  }
);

tap.test(
  `18 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - all optional, not existing`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 2, "x?"), null, "18.01");
    t.equal(rightSeq("abcdefghijklmnop", 2, "x?", "y?"), null, "18.02");
    t.equal(rightSeq("abcdefghijklmnop", 2, "x?", "y?", "z?"), null, "18.03");
    t.end();
  }
);

tap.test(`19 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - no findings`, (t) => {
  t.equal(rightSeq("ABCDEFGHIJKLMNOP", 0, "b", "c", "d"), null, "19.01");
  t.same(
    rightSeq("ABCDEFGHIJKLMNOP", 0, { i: true }, "b", "c", "d"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 3,
    },
    "19.02"
  );
  t.end();
});

// 04. leftSeq()
// -----------------------------------------------------------------------------

tap.test(`20 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - normal use`, (t) => {
  // starts at "f":
  t.same(
    leftSeq("abcdefghijk", 5, "c", "d", "e"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4,
    },
    "20.01"
  );
  t.same(
    leftSeq("a  b  c  d  e  f  g  h  i  j  k", 15, "c", "d", "e"),
    {
      gaps: [
        [7, 9],
        [10, 12],
        [13, 15],
      ],
      leftmostChar: 6,
      rightmostChar: 12,
    },
    "20.02"
  );
  t.same(
    leftSeq("a  b  c  d  e  f  g  h  i  j  k", 15, "c", "d", "z?", "e"),
    {
      gaps: [
        [7, 9],
        [10, 12],
        [13, 15],
      ],
      leftmostChar: 6,
      rightmostChar: 12,
    },
    "20.03"
  );
  t.same(
    leftSeq("a  b  c  d  e  f  g  h  i  j  k", 15, "c", "d", "z?", "e", "x?"),
    {
      gaps: [
        [7, 9],
        [10, 12],
        [13, 15],
      ],
      leftmostChar: 6,
      rightmostChar: 12,
    },
    "20.04"
  );
  t.end();
});

tap.test(`21 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - no findings`, (t) => {
  t.equal(leftSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "21.01");
  t.equal(leftSeq("abcdefghijklmnop", 2, "d", "e", "f"), null, "21.02");
  t.equal(leftSeq("abcdefghijklmnop", 2, "", ""), null, "21.03");
  t.same(
    leftSeq("abcdefghijklmnop", 2, "b", ""),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "21.04"
  );
  t.same(
    leftSeq("abcdefghijklmnop", 2, "", "b"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "21.05"
  );
  t.end();
});

tap.test(
  `22 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - no sequence arguments`,
  (t) => {
    t.equal(leftSeq("abcdefghijklmnop", 0), null, "22.01");
    t.equal(leftSeq("abcdefghijklmnop", 15), 14, "22.02");
    t.same(leftSeq("abcdefghijklmn p", 15), 13, "22.03");
    t.equal(leftSeq("abcdefghijklmnop", 1), 0, "22.04");
    t.equal(leftSeq("ab  cdefghijklmnop", 4), 1, "22.05");
    t.end();
  }
);

tap.test(
  `23 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - starting point outside of the range`,
  (t) => {
    t.equal(leftSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "23");
    t.end();
  }
);

tap.test(
  `24 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - case insensitive`,
  (t) => {
    t.equal(leftSeq("abcdefghijk", 5, "C", "D", "E"), null, "24.01");
    t.same(
      leftSeq("abcdefghijk", 5, { i: true }, "C", "D", "E"),
      {
        gaps: [],
        leftmostChar: 2,
        rightmostChar: 4,
      },
      "24.02"
    );
    t.end();
  }
);

// 05. chompRight()
// -----------------------------------------------------------------------------

tap.test(
  `25 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 0`,
  (t) => {
    t.equal(chompRight("a b c d  c dx", 2, "c", "d"), 12, "25.01");
    t.equal(chompRight("a b c d  c d x", 2, "c", "d"), 12, "25.02");
    t.equal(chompRight("a b c d  c d  x", 2, "c", "d"), 13, "25.03");
    t.equal(chompRight("a b c d  c d \nx", 2, "c", "d"), 13, "25.04");
    t.equal(chompRight("a b c d  c d  \nx", 2, "c", "d"), 14, "25.05");
    // with hardcoded default opts
    const o = { mode: 0 };
    t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "25.06");
    t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "25.07");
    t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 13, "25.08");
    t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "25.09");
    t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "25.10");
    t.equal(
      chompRight("a b c d  c d  \nx", 2, { mode: "0" }, "c", "d"),
      14,
      "25.11"
    );
    t.equal(
      chompRight("a b c d  c d  \nx", 2, { mode: null }, "c", "d"),
      14,
      "25.12 - falsey values default to 0"
    );
    t.equal(
      chompRight("a b c d  c d  \nx", 2, { mode: "" }, "c", "d"),
      14,
      "25.13 - falsey values default to 0"
    );
    t.equal(
      chompRight("a b c d  c d  \nx", 2, { mode: undefined }, "c", "d"),
      14,
      "25.14 - falsey values default to 0"
    );
    t.end();
  }
);

tap.test(
  `26 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 1`,
  (t) => {
    // mode 1: stop at first space, leave the whitespace alone
    const o = { mode: 1 };
    t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "26.01");
    t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "26.02");
    t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 12, "26.03");
    t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 12, "26.04");
    t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 12, "26.05");
    t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 12, "26.06");
    t.equal(
      chompRight("a b c d  c d  \t \nx", 2, { mode: "1" }, "c", "d"),
      12,
      "26.07"
    );
    t.end();
  }
);

tap.test(
  `27 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 2`,
  (t) => {
    // mode 2: hungrily chomp all whitespace except newlines
    const o = { mode: 2 };
    t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "27.01");
    t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "27.02");
    t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "27.03");
    t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "27.04");
    t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "27.05");
    t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 16, "27.06");
    t.equal(
      chompRight("a b c d  c d  \t \nx", 2, { mode: "2" }, "c", "d"),
      16,
      "27.07"
    );
    t.end();
  }
);

tap.test(
  `28 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 3`,
  (t) => {
    // mode 3: aggressively chomp all whitespace
    const o = { mode: 3 };
    t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "28.01");
    t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "28.02");
    t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "28.03");
    t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 14, "28.04");
    t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 15, "28.05");
    t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 17, "28.06");
    t.equal(
      chompRight("a b c d  c d  \t \nx", 2, { mode: "3" }, "c", "d"),
      17,
      "28.07"
    );
    t.end();
  }
);

tap.test(
  `29 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${31}m${`not found`}\u001b[${39}m`} - all modes`,
  (t) => {
    t.equal(chompRight("a b c d  c dx", 2), null, "29.01");
    t.equal(chompRight("a b c d  c dx", 2, "z", "x"), null, "29.02");
    t.equal(
      chompRight("a b c d  c dx", 2, { mode: 0 }, "z", "x"),
      null,
      "29.03"
    );
    t.equal(
      chompRight("a b c d  c dx", 2, { mode: 1 }, "z", "x"),
      null,
      "29.04"
    );
    t.equal(
      chompRight("a b c d  c dx", 2, { mode: 2 }, "z", "x"),
      null,
      "29.05"
    );
    t.equal(
      chompRight("a b c d  c dx", 2, { mode: 3 }, "z", "x"),
      null,
      "29.06"
    );

    // idx is too high:
    t.equal(chompRight("a b c d  c dx", 99, "z", "x"), null, "29.07");
    t.equal(
      chompRight("a b c d  c dx", 99, { mode: 0 }, "z", "x"),
      null,
      "29.08"
    );
    t.equal(
      chompRight("a b c d  c dx", 99, { mode: 1 }, "z", "x"),
      null,
      "29.09"
    );
    t.equal(
      chompRight("a b c d  c dx", 99, { mode: 2 }, "z", "x"),
      null,
      "29.10"
    );
    t.equal(
      chompRight("a b c d  c dx", 99, { mode: 3 }, "z", "x"),
      null,
      "29.11"
    );

    // no args -> null:
    t.equal(chompRight("a b c d  c dx", 2), null, "29.12");
    t.equal(chompRight("a b c d  c dx", 2, { mode: 0 }), null, "29.13");
    t.equal(chompRight("a b c d  c dx", 2, { mode: 1 }), null, "29.14");
    t.equal(chompRight("a b c d  c dx", 2, { mode: 2 }), null, "29.15");
    t.equal(chompRight("a b c d  c dx", 2, { mode: 3 }), null, "29.16");

    // idx at wrong place:
    t.equal(chompRight("a b c d  c d  \nx", 0, "c", "d"), null, "29.17");

    // both args optional and don't exist
    t.equal(chompRight("a b c d  c d  \nx", 0, "m?", "n?"), null, "29.18");
    t.end();
  }
);

tap.test(
  `30 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`throws`}\u001b[${39}m`}`,
  (t) => {
    t.throws(() => {
      chompRight("a b c d  c dx", 2, { mode: "z" }, "k", "l");
    }, /THROW_ID_02/);
    t.end();
  }
);

tap.test(
  `31 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #1`,
  (t) => {
    // stop at \n
    t.equal(chompRight("a b c d  c d    \n", 2, null, "c", "d"), 16, "31");
    t.end();
  }
);

tap.test(
  `32 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #2`,
  (t) => {
    // stop at \n
    t.equal(chompRight("a", 0, null, "x"), null, "32");
    t.end();
  }
);

tap.test(
  `33 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #3`,
  (t) => {
    t.equal(chompRight(1, 0, null, "x"), null, "33");
    t.end();
  }
);

tap.test(
  `34 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #4`,
  (t) => {
    t.equal(
      chompRight("a b c d  c d    \t", 2, { mode: 0 }, "c", "d"),
      17,
      "34.01"
    );
    t.equal(
      chompRight("a b c d  c d    \t", 2, { mode: 2 }, "c", "d"),
      17,
      "34.02"
    );
    t.equal(
      chompRight("a b c d  c d    \t", 2, { mode: 3 }, "c", "d"),
      17,
      "34.03"
    );
    t.end();
  }
);

tap.test(
  `35 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${31}m${`adhoc`}\u001b[${39}m`} #5 - real life`,
  (t) => {
    t.equal(chompRight(`<a bcd="ef">`, 6, "="), null, "35.01");
    t.equal(chompRight(`<a bcd=="ef">`, 6, "="), 8, "35.02");
    t.equal(chompRight(`<a bcd==="ef">`, 6, "="), 9, "35.03");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, "="), 9, "35.04");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, "="), 10, "35.05");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, "="), 9, "35.06");
    t.equal(chompRight(`<a bcd= == "ef">`, 6, "="), 10, "35.07");

    // hardcoded defaults mode === 0
    t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 0 }, "="), null, "35.08");
    t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 0 }, "="), 8, "35.09");
    t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 0 }, "="), 9, "35.10");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 0 }, "="), 9, "35.11");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 0 }, "="), 10, "35.12");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 0 }, "="), 9, "35.13");
    t.equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 0 }, "="), 10, "35.14");

    // mode === 1
    t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 1 }, "="), null, "35.15");
    t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 1 }, "="), 8, "35.16");
    t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 1 }, "="), 9, "35.17");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 1 }, "="), 9, "35.18");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 1 }, "="), 10, "35.19");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 1 }, "="), 9, "35.20");
    t.equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 1 }, "="), 10, "35.21");

    // mode === 2
    t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 2 }, "="), null, "35.22");
    t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 2 }, "="), 8, "35.23");
    t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 2 }, "="), 9, "35.24");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 2 }, "="), 9, "35.25");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 2 }, "="), 10, "35.26");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 2 }, "="), 10, "35.27");
    t.equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 2 }, "="), 11, "35.28");

    // mode === 3
    t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 3 }, "="), null, "35.29");
    t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 3 }, "="), 8, "35.30");
    t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 3 }, "="), 9, "35.31");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 3 }, "="), 9, "35.32");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 3 }, "="), 10, "35.33");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 3 }, "="), 10, "35.34");
    t.equal(chompRight(`<a bcd= == "ef">`, 6, { mode: 3 }, "="), 11, "35.35");
    t.end();
  }
);

// 06. chompLeft()
// -----------------------------------------------------------------------------

tap.test(
  `36 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${32}m${`found`}\u001b[${39}m`} - mode: 0`,
  (t) => {
    t.equal(chompLeft("ab c b c  x y", 10, "b", "c"), 1, "36.01");
    t.equal(chompLeft("a b c b c  x y", 11, "b", "c"), 2, "36.02");
    t.equal(chompLeft("a  b c b c  x y", 12, "b", "c"), 2, "36.03");
    t.equal(chompLeft("a\n b c b c  x y", 12, "b", "c"), 2, "36.04");
    t.equal(chompLeft("a\n  b c b c  x y", 13, "b", "c"), 2, "36.05");

    // with hardcoded default opts
    const o = { mode: 0 };
    t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "36.06");
    t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 2, "36.07");
    t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 2, "36.08");
    t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 2, "36.09");
    t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 2, "36.10");
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "0" }, "b", "c"),
      2,
      "36.11"
    );
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: null }, "b", "c"),
      2,
      "36.12"
    );
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "" }, "b", "c"),
      2,
      "36.13"
    );
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: undefined }, "b", "c"),
      2,
      "36.14"
    );
    t.equal(chompLeft("a\n  b c b c  x y", 13, "b", "c", "x?"), 2, "36.15");
    t.equal(
      chompLeft("a\n  b c b c  x y", 13, "y?", "b", "c", "x?"),
      2,
      "36.16"
    );
    t.end();
  }
);

tap.test(
  `37 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${32}m${`found`}\u001b[${39}m`} - mode: 1`,
  (t) => {
    // mode 1: stop at first space, leave the whitespace alone
    const o = { mode: 1 };
    t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "37.01");
    t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 2, "37.02");
    t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 3, "37.03");
    t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 3, "37.04");
    t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 4, "37.05");
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "1" }, "b", "c"),
      4,
      "37.06"
    );
    t.end();
  }
);

tap.test(
  `38 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${32}m${`found`}\u001b[${39}m`} - mode: 2`,
  (t) => {
    // mode 2: hungrily chomp all whitespace except newlines
    const o = { mode: 2 };
    t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "38.01");
    t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 1, "38.02");
    t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 1, "38.03");
    t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 2, "38.04");
    t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 2, "38.05");
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "2" }, "b", "c"),
      2,
      "38.06"
    );
    t.end();
  }
);

tap.test(
  `39 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${32}m${`found`}\u001b[${39}m`} - mode: 3`,
  (t) => {
    // mode 3: aggressively chomp all whitespace
    const o = { mode: 3 };
    t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "39.01");
    t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 1, "39.02");
    t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 1, "39.03");
    t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 1, "39.04");
    t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 1, "39.05");
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c"),
      1,
      "39.06"
    );
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c?"),
      1,
      "39.07"
    );
    t.end();
  }
);

tap.test(
  `40 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${31}m${`not found`}\u001b[${39}m`} - all modes`,
  (t) => {
    t.equal(chompLeft("ab c b c  x y", -1), null, "40.01");
    t.equal(chompLeft("ab c b c  x y", 0), null, "40.02");
    t.equal(chompLeft("ab c b c  x y", 10), null, "40.03");
    t.equal(chompLeft("ab c b c  x y", 10, "z", "x"), null, "40.04");
    t.equal(
      chompLeft("ab c b c  x y", 10, { mode: 0 }, "z", "x"),
      null,
      "40.05"
    );
    t.equal(
      chompLeft("ab c b c  x y", 10, { mode: 1 }, "z", "x"),
      null,
      "40.06"
    );
    t.equal(
      chompLeft("ab c b c  x y", 10, { mode: 2 }, "z", "x"),
      null,
      "40.07"
    );
    t.equal(
      chompLeft("ab c b c  x y", 10, { mode: 3 }, "z", "x"),
      null,
      "40.08"
    );

    // idx is zero/negative:
    t.equal(chompLeft("a b c d  c dx", 0, "z", "x"), null, "40.09");
    t.equal(
      chompLeft("a b c d  c dx", 0, { mode: 0 }, "z", "x"),
      null,
      "40.10"
    );
    t.equal(
      chompLeft("a b c d  c dx", 0, { mode: 1 }, "z", "x"),
      null,
      "40.11"
    );
    t.equal(
      chompLeft("a b c d  c dx", 0, { mode: 2 }, "z", "x"),
      null,
      "40.12"
    );
    t.equal(
      chompLeft("a b c d  c dx", 0, { mode: 3 }, "z", "x"),
      null,
      "40.13"
    );

    t.equal(chompLeft("a b c d  c dx", 99, "z", "x"), null, "40.14");
    t.equal(
      chompLeft("a b c d  c dx", 99, { mode: 0 }, "z", "x"),
      null,
      "40.15"
    );
    t.equal(
      chompLeft("a b c d  c dx", 99, { mode: 1 }, "z", "x"),
      null,
      "40.16"
    );
    t.equal(
      chompLeft("a b c d  c dx", 99, { mode: 2 }, "z", "x"),
      null,
      "40.17"
    );
    t.equal(
      chompLeft("a b c d  c dx", 99, { mode: 3 }, "z", "x"),
      null,
      "40.18"
    );

    // no args -> null:
    t.equal(chompLeft("a b c d  c dx", 2), null, "40.19");
    t.equal(chompLeft("a b c d  c dx", 2, { mode: 0 }), null, "40.20");
    t.equal(chompLeft("a b c d  c dx", 2, { mode: 1 }), null, "40.21");
    t.equal(chompLeft("a b c d  c dx", 2, { mode: 2 }), null, "40.22");
    t.equal(chompLeft("a b c d  c dx", 2, { mode: 3 }), null, "40.23");
    t.end();
  }
);

tap.test(
  `41 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`throws`}\u001b[${39}m`}`,
  (t) => {
    t.throws(() => {
      chompLeft("a b c d  c dx", 2, { mode: "z" }, "k", "l");
    }, /THROW_ID_01/);
    t.end();
  }
);

tap.test(
  `42 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #1`,
  (t) => {
    // stop at \n
    t.equal(chompLeft(" \n  b c   b  c   x y", 17, null, "b", "c"), 2, "42");
    t.end();
  }
);

tap.test(
  `43 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #2`,
  (t) => {
    t.equal(
      chompLeft("         b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
      0,
      "43"
    );
    t.end();
  }
);

tap.test(
  `44 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #3`,
  (t) => {
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
      1,
      "44.01"
    );
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 3 }, "b", "c"),
      1,
      "44.02"
    );
    t.end();
  }
);

tap.test(
  `45 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #4`,
  (t) => {
    t.equal(chompLeft(1, 22, { mode: 2 }, "b", "c"), null, "45");
    t.end();
  }
);

tap.test(
  `46 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #5`,
  (t) => {
    t.equal(
      chompLeft("\t        b c   b  c   x y", 22, { mode: 0 }, "b", "c"),
      0,
      "46.01"
    );
    t.equal(
      chompLeft("\t        b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
      0,
      "46.02"
    );
    t.equal(
      chompLeft("\t        b c   b  c   x y", 22, { mode: 3 }, "b", "c"),
      0,
      "46.03"
    );
    t.end();
  }
);

tap.test(
  `47 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #5`,
  (t) => {
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "b", "c"),
      2,
      "47.01"
    );
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "b?", "c?"),
      2,
      "47.02"
    );
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "x?", "b", "c"),
      2,
      "47.03"
    );
    t.end();
  }
);

tap.test(
  `48 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #6 - real life`,
  (t) => {
    t.equal(chompLeft(`<a bcd="ef">`, 6, "="), null, "48.01");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, "="), 6, "48.02");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, "="), 6, "48.03");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, "="), 6, "48.04");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, "="), 6, "48.05");

    // hardcoded default, mode === 0
    t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 0 }, "="), null, "48.06");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 0 }, "="), 6, "48.07");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 0 }, "="), 6, "48.08");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 0 }, "="), 6, "48.09");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, { mode: 0 }, "="), 6, "48.10");

    // mode === 1
    t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 1 }, "="), null, "48.11");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 1 }, "="), 6, "48.12");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 1 }, "="), 6, "48.13");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 1 }, "="), 6, "48.14");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, { mode: 1 }, "="), 6, "48.15");

    // mode === 2
    t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 2 }, "="), null, "48.16");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 2 }, "="), 6, "48.17");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 2 }, "="), 6, "48.18");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 2 }, "="), 6, "48.19");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, { mode: 2 }, "="), 6, "48.20");

    // mode === 3
    t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 3 }, "="), null, "48.21");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 3 }, "="), 6, "48.22");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 3 }, "="), 6, "48.23");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 3 }, "="), 6, "48.24");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, { mode: 3 }, "="), 6, "48.25");
    t.end();
  }
);

tap.test(
  `49 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #7 - real life`,
  (t) => {
    t.equal(
      chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 20, "!"),
      1,
      "49.01"
    );
    t.equal(
      chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 19, "!"),
      1,
      "49.02"
    );
    t.equal(
      chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 18, "!"),
      1,
      "49.03"
    );
    t.equal(
      chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 17, "!"),
      1,
      "49.04"
    );
    t.end();
  }
);

tap.test(
  `50 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`hungry`}\u001b[${39}m`} sequence`,
  (t) => {
    t.equal(chompLeft(`. . . . . ....   . x`, 19, ".*"), 0, "50");
    t.end();
  }
);

tap.test(
  `51 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`hungry`}\u001b[${39}m`} sequence`,
  (t) => {
    t.equal(
      chompLeft(`<  << <  << < !! !! ! ! [[[ [ [[  [ x`, 36, "<*", "!*", "[*"),
      0,
      "51"
    );
    t.end();
  }
);

// 06. leftStopAtNewLines()
// -----------------------------------------------------------------------------

tap.test(
  `52 - \u001b[${35}m${`leftStopAtNewLines`}\u001b[${39}m - null result cases`,
  (t) => {
    t.equal(leftStopAtNewLines("abc"), null, "52.01 - assumed default");
    t.equal(leftStopAtNewLines("abc", 0), null, "52.02 - hardcoded default");
    t.equal(leftStopAtNewLines("abc", null), null, "52.03 - hardcoded default");
    t.equal(leftStopAtNewLines("abc", 4), 2, "52.04 - at string.length + 1");
    t.equal(
      leftStopAtNewLines("abc", 9),
      2,
      "52.05 - outside of the string.length"
    );
    t.equal(leftStopAtNewLines(""), null, "52.06");
    t.equal(leftStopAtNewLines("", 0), null, "52.07");
    t.equal(leftStopAtNewLines("", null), null, "52.08");
    t.equal(leftStopAtNewLines("", undefined), null, "52.09");
    t.equal(leftStopAtNewLines("", 1), null, "52.10");
    t.end();
  }
);

tap.test(
  `53 - \u001b[${35}m${`leftStopAtNewLines`}\u001b[${39}m - normal use`,
  (t) => {
    t.notOk(!!leftStopAtNewLines(""), "53.01");
    t.notOk(!!leftStopAtNewLines("a"), "53.02");
    t.equal(leftStopAtNewLines("ab", 1), 0, "53.03");
    t.equal(leftStopAtNewLines("a b", 2), 0, "53.04");

    t.equal(leftStopAtNewLines("a \n\n\nb", 5), 4, "53.05");
    t.equal(leftStopAtNewLines("a \n\n\n b", 6), 4, "53.06");
    t.equal(leftStopAtNewLines("a \r\r\r b", 6), 4, "53.07");
    t.equal(leftStopAtNewLines("a\n\rb", 3), 2, "53.08");
    t.equal(leftStopAtNewLines("a\n\r b", 4), 2, "53.09");

    t.equal(leftStopAtNewLines("\n\n\n\n", 4), 3, "53.10");
    t.equal(leftStopAtNewLines("\n\n\n\n", 3), 2, "53.11");
    t.equal(leftStopAtNewLines("\n\n\n\n", 2), 1, "53.12");
    t.equal(leftStopAtNewLines("\n\n\n\n", 1), 0, "53.13");
    t.equal(leftStopAtNewLines("\n\n\n\n", 0), null, "53.14");
    t.end();
  }
);

// 07. rightStopAtNewLines()
// -----------------------------------------------------------------------------

tap.test(
  `54 - \u001b[${36}m${`rirightStopAtNewLinesght`}\u001b[${39}m - calling at string length`,
  (t) => {
    t.equal(rightStopAtNewLines(""), null, "54.01");
    t.equal(rightStopAtNewLines("", null), null, "54.02");
    t.equal(rightStopAtNewLines("", undefined), null, "54.03");
    t.equal(rightStopAtNewLines("", 0), null, "54.04");
    t.equal(rightStopAtNewLines("", 1), null, "54.05");
    t.equal(rightStopAtNewLines("", 99), null, "54.06");
    t.equal(rightStopAtNewLines("abc", 3), null, "54.07");
    t.equal(rightStopAtNewLines("abc", 99), null, "54.08");
    t.end();
  }
);

tap.test(
  `55 - \u001b[${36}m${`rightStopAtNewLines`}\u001b[${39}m - normal use`,
  (t) => {
    t.notOk(!!rightStopAtNewLines(""), "55.01");
    t.notOk(!!rightStopAtNewLines("a"), "55.02");

    // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
    t.equal(rightStopAtNewLines("ab"), 1, "55.03");

    // 2nd input arg was omitted so starting index is zero, which is "a".
    // Now, to the right of it, there's a space, index 1, next non-whitespace char
    // is b which is index 2.
    t.equal(rightStopAtNewLines("a b"), 2, "55.04");
    t.equal(rightStopAtNewLines("a b", 0), 2, "55.05");
    t.equal(rightStopAtNewLines("a b", 1), 2, "55.06");
    t.equal(rightStopAtNewLines("a b", 2), null, "55.07");

    t.equal(rightStopAtNewLines("a \n\n\nb"), 2, "55.08");
    t.equal(rightStopAtNewLines("a \n\n\nb", 0), 2, "55.09");
    t.equal(rightStopAtNewLines("a \n\n\nb", 1), 2, "55.10");
    t.equal(rightStopAtNewLines("a \n\n\nb", 2), 3, "55.11");
    t.equal(rightStopAtNewLines("a \n\n\nb", 3), 4, "55.12");
    t.equal(rightStopAtNewLines("a \n\n\nb", 4), 5, "55.13");
    t.equal(rightStopAtNewLines("a \n\n\nb", 5), null, "55.14");
    t.equal(rightStopAtNewLines("a \n\n\n\n"), 2, "55.15");
    t.equal(rightStopAtNewLines("a  "), null, "55.16");
    t.equal(rightStopAtNewLines("a  ", 0), null, "55.17");
    t.equal(rightStopAtNewLines("a  ", 1), null, "55.18");
    t.equal(rightStopAtNewLines("a  ", 2), null, "55.19");
    t.equal(rightStopAtNewLines("a  ", 3), null, "55.20");
    t.end();
  }
);

// -----------------------------------------------------------------------------

//
//                                               ██\███/██
//                                               ███\█/███
//               ███x█x█x█x█x███████████████████|████x████O
//                       ^ bug hammer ^          ███/█\███
//                  tears of the teared bugs     ██/███\██
//
