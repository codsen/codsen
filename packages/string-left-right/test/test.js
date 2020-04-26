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

tap.test(`00.01 - \u001b[${33}m${`null`}\u001b[${39}m - missing input`, (t) => {
  t.equal(left(), null, "00.01.01");
  t.equal(right(), null, "00.01.02");
  t.equal(leftSeq(), null, "00.01.03");
  t.equal(rightSeq(), null, "00.01.04");
  t.end();
});

tap.test(
  `00.02 - \u001b[${33}m${`null`}\u001b[${39}m - non-string input`,
  (t) => {
    t.equal(left(1), null, "00.02.01");
    t.equal(right(1), null, "00.02.02");
    t.equal(leftSeq(1, 1, "a"), null, "00.02.03");
    t.equal(rightSeq(1, 1, "a"), null, "00.02.04");
    t.end();
  }
);

tap.test(
  `00.03 - \u001b[${33}m${`null`}\u001b[${39}m - non-string input`,
  (t) => {
    t.equal(left(null), null, "00.03.01");
    t.equal(left(null, 1), null, "00.03.02");
    t.equal(right(null), null, "00.03.03");
    t.equal(right(null, 1), null, "00.03.04");
    t.equal(leftSeq(null), null, "00.03.05");
    t.equal(leftSeq(null, 1), null, "00.03.06");
    t.equal(rightSeq(null), null, "00.03.07");
    t.equal(rightSeq(null, 1), null, "00.03.08");
    t.end();
  }
);

// 01. left()
// -----------------------------------------------------------------------------

tap.test(
  `01.01 - \u001b[${31}m${`left`}\u001b[${39}m - null result cases`,
  (t) => {
    t.equal(left("abc"), null, "01.01.01 - assumed default");
    t.equal(left("abc", 0), null, "01.01.02 - hardcoded default");
    t.equal(left("abc", null), null, "01.01.03 - hardcoded default");
    t.equal(left("abc", 4), 2, "01.01.04 - at string.length + 1");
    t.equal(left("abc", 9), 2, "01.01.05 - outside of the string.length");
    t.equal(left(""), null, "01.01.06");
    t.equal(left("", 0), null, "01.01.07");
    t.equal(left("", null), null, "01.01.08");
    t.equal(left("", undefined), null, "01.01.09");
    t.equal(left("", 1), null, "01.01.10");
    t.end();
  }
);

tap.test(`01.02 - \u001b[${31}m${`left`}\u001b[${39}m - normal use`, (t) => {
  t.notOk(!!left(""), "01.02.01");
  t.notOk(!!left("a"), "01.02.02");
  t.equal(left("ab", 1), 0, "01.02.03");
  t.equal(left("a b", 2), 0, "01.02.04");
  t.equal(left("a \n\n\nb", 5), 0, "01.02.05");
  t.equal(left("\n\n\n\n", 4), null, "01.02.06");
  t.equal(left("\n\n\n\n", 3), null, "01.02.07");
  t.equal(left("\n\n\n\n", 2), null, "01.02.08");
  t.equal(left("\n\n\n\n", 1), null, "01.02.09");
  t.equal(left("\n\n\n\n", 0), null, "01.02.10");
  t.end();
});

// 02. right()
// -----------------------------------------------------------------------------

tap.test(
  `02.01 - \u001b[${34}m${`right`}\u001b[${39}m - calling at string length`,
  (t) => {
    t.equal(right(""), null, "02.01.01");
    t.equal(right("", null), null, "02.01.02");
    t.equal(right("", undefined), null, "02.01.03");
    t.equal(right("", 0), null, "02.01.04");
    t.equal(right("", 1), null, "02.01.05");
    t.equal(right("", 99), null, "02.01.06");
    t.equal(right("abc", 3), null, "02.01.07");
    t.equal(right("abc", 99), null, "02.01.08");
    t.end();
  }
);

tap.test(`02.02 - \u001b[${34}m${`right`}\u001b[${39}m - normal use`, (t) => {
  t.notOk(!!right(""), "02.02.01");
  t.notOk(!!right("a"), "02.02.02");

  // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
  t.equal(right("ab"), 1, "02.02.03");

  // 2nd input arg was omitted so starting index is zero, which is "a".
  // Now, to the right of it, there's a space, index 1, next non-whitespace char
  // is b which is index 2.
  t.equal(right("a b"), 2, "02.02.04");

  t.equal(right("a \n\n\nb"), 5, "02.02.05");
  t.equal(right("a \n\n\n\n"), null, "02.02.06");
  t.end();
});

// 03. rightSeq()
// -----------------------------------------------------------------------------

tap.test(
  `03.01 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - normal use`,
  (t) => {
    // starts at "c":
    t.same(
      rightSeq("abcdefghijklmnop", 2, "d"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 3,
      },
      "03.01.01"
    );
    t.same(
      rightSeq("abcdefghijklmnop", 2, "d", "e", "f"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 5,
      },
      "03.01.02"
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
      "03.01.03"
    );
    t.end();
  }
);

tap.test(
  `03.02 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - no findings`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "03.02.01");
    t.end();
  }
);

tap.test(
  `03.03 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - absent skips to right()`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 0, "", ""), null, "03.03.01");
    t.same(
      rightSeq("abcdefghijklmnop", 0, "b", ""),
      {
        gaps: [],
        leftmostChar: 1,
        rightmostChar: 1,
      },
      "03.03.02"
    );
    t.same(
      rightSeq("abcdefghijklmnop", 0, "", "b"),
      {
        gaps: [],
        leftmostChar: 1,
        rightmostChar: 1,
      },
      "03.03.03"
    );
    t.end();
  }
);

tap.test(
  `03.04 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - no sequence arguments - turns into right()`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 0), 1, "03.04.01");
    t.equal(rightSeq("abcdefghijklmnop", 1), 2, "03.04.02");
    t.equal(rightSeq("ab  cdefghijklmnop", 1), 4, "03.04.03");
    t.end();
  }
);

tap.test(
  `03.05 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - starting point outside of the range`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "03.05");
    t.end();
  }
);

tap.test(
  `03.06 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - optional - existing`,
  (t) => {
    t.same(
      rightSeq("abcdefghijklmnop", 2, "d?", "e?", "f"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 5,
      },
      "03.06"
    );
    t.end();
  }
);

tap.test(
  `03.07 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - 1 not existing, no whitespace`,
  (t) => {
    t.same(
      rightSeq("abcefghijklmnop", 2, "d?", "e", "f"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 4,
      },
      "03.07"
    );
    t.end();
  }
);

tap.test(
  `03.08 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - 1 not existing, with whitespace`,
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
      "03.08"
    );
    t.end();
  }
);

tap.test(
  `03.09 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - ends with non-existing optional`,
  (t) => {
    t.same(
      rightSeq("abc  e   f   g   hijklmnop", 2, "y?", "e", "z?"),
      {
        gaps: [[3, 5]],
        leftmostChar: 5,
        rightmostChar: 5,
      },
      "03.09"
    );
    t.end();
  }
);

tap.test(
  `03.10 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - all optional, existing`,
  (t) => {
    t.same(
      rightSeq("abcdefghijklmnop", 2, "d?", "e?", "f?"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 5,
      },
      "03.10"
    );
    t.end();
  }
);

tap.test(
  `03.11 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - all optional, not existing`,
  (t) => {
    t.equal(rightSeq("abcdefghijklmnop", 2, "x?"), null, "03.11.01");
    t.equal(rightSeq("abcdefghijklmnop", 2, "x?", "y?"), null, "03.11.02");
    t.equal(
      rightSeq("abcdefghijklmnop", 2, "x?", "y?", "z?"),
      null,
      "03.11.03"
    );
    t.end();
  }
);

tap.test(
  `03.12 - \u001b[${35}m${`rightSeq`}\u001b[${39}m - no findings`,
  (t) => {
    t.equal(rightSeq("ABCDEFGHIJKLMNOP", 0, "b", "c", "d"), null, "03.12");
    t.same(
      rightSeq("ABCDEFGHIJKLMNOP", 0, { i: true }, "b", "c", "d"),
      {
        gaps: [],
        leftmostChar: 1,
        rightmostChar: 3,
      },
      "03.12"
    );
    t.end();
  }
);

// 04. leftSeq()
// -----------------------------------------------------------------------------

tap.test(`04.01 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - normal use`, (t) => {
  // starts at "f":
  t.same(
    leftSeq("abcdefghijk", 5, "c", "d", "e"),
    {
      gaps: [],
      leftmostChar: 2,
      rightmostChar: 4,
    },
    "04.01.01"
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
    "04.01.02"
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
    "04.01.03"
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
    "04.01.04"
  );
  t.end();
});

tap.test(
  `04.02 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - no findings`,
  (t) => {
    t.equal(leftSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "04.02.01");
    t.equal(leftSeq("abcdefghijklmnop", 2, "d", "e", "f"), null, "04.02.02");
    t.equal(leftSeq("abcdefghijklmnop", 2, "", ""), null, "04.02.03");
    t.same(
      leftSeq("abcdefghijklmnop", 2, "b", ""),
      {
        gaps: [],
        leftmostChar: 1,
        rightmostChar: 1,
      },
      "04.02.04"
    );
    t.same(
      leftSeq("abcdefghijklmnop", 2, "", "b"),
      {
        gaps: [],
        leftmostChar: 1,
        rightmostChar: 1,
      },
      "04.02.05"
    );
    t.end();
  }
);

tap.test(
  `04.03 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - no sequence arguments`,
  (t) => {
    t.equal(leftSeq("abcdefghijklmnop", 0), null, "04.03.01");
    t.equal(leftSeq("abcdefghijklmnop", 15), 14, "04.03.02");
    t.same(leftSeq("abcdefghijklmn p", 15), 13, "04.03.03");
    t.equal(leftSeq("abcdefghijklmnop", 1), 0, "04.03.04");
    t.equal(leftSeq("ab  cdefghijklmnop", 4), 1, "04.03.05");
    t.end();
  }
);

tap.test(
  `04.04 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - starting point outside of the range`,
  (t) => {
    t.equal(leftSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "04.04");
    t.end();
  }
);

tap.test(
  `04.05 - \u001b[${36}m${`leftSeq`}\u001b[${39}m - case insensitive`,
  (t) => {
    t.equal(leftSeq("abcdefghijk", 5, "C", "D", "E"), null, "04.05.01");
    t.same(
      leftSeq("abcdefghijk", 5, { i: true }, "C", "D", "E"),
      {
        gaps: [],
        leftmostChar: 2,
        rightmostChar: 4,
      },
      "04.05.02"
    );
    t.end();
  }
);

// 05. chompRight()
// -----------------------------------------------------------------------------

tap.test(
  `05.01 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 0`,
  (t) => {
    t.equal(chompRight("a b c d  c dx", 2, "c", "d"), 12, "05.01.01");
    t.equal(chompRight("a b c d  c d x", 2, "c", "d"), 12, "05.01.02");
    t.equal(chompRight("a b c d  c d  x", 2, "c", "d"), 13, "05.01.03");
    t.equal(chompRight("a b c d  c d \nx", 2, "c", "d"), 13, "05.01.04");
    t.equal(chompRight("a b c d  c d  \nx", 2, "c", "d"), 14, "05.01.05");
    // with hardcoded default opts
    const o = { mode: 0 };
    t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "05.01.06");
    t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "05.01.07");
    t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 13, "05.01.08");
    t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "05.01.09");
    t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "05.01.10");
    t.equal(
      chompRight("a b c d  c d  \nx", 2, { mode: "0" }, "c", "d"),
      14,
      "05.01.11"
    );
    t.equal(
      chompRight("a b c d  c d  \nx", 2, { mode: null }, "c", "d"),
      14,
      "05.01.12 - falsey values default to 0"
    );
    t.equal(
      chompRight("a b c d  c d  \nx", 2, { mode: "" }, "c", "d"),
      14,
      "05.01.13 - falsey values default to 0"
    );
    t.equal(
      chompRight("a b c d  c d  \nx", 2, { mode: undefined }, "c", "d"),
      14,
      "05.01.14 - falsey values default to 0"
    );
    t.end();
  }
);

tap.test(
  `05.02 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 1`,
  (t) => {
    // mode 1: stop at first space, leave the whitespace alone
    const o = { mode: 1 };
    t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "05.02.01");
    t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 12, "05.02.02");
    t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 12, "05.02.03");
    t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 12, "05.02.04");
    t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 12, "05.02.05");
    t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 12, "05.02.06");
    t.equal(
      chompRight("a b c d  c d  \t \nx", 2, { mode: "1" }, "c", "d"),
      12,
      "05.02.07"
    );
    t.end();
  }
);

tap.test(
  `05.03 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 2`,
  (t) => {
    // mode 2: hungrily chomp all whitespace except newlines
    const o = { mode: 2 };
    t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "05.03.01");
    t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "05.03.02");
    t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "05.03.03");
    t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 13, "05.03.04");
    t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 14, "05.03.05");
    t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 16, "05.03.06");
    t.equal(
      chompRight("a b c d  c d  \t \nx", 2, { mode: "2" }, "c", "d"),
      16,
      "05.03.07"
    );
    t.end();
  }
);

tap.test(
  `05.04 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${34}m${`found`}\u001b[${39}m`} - mode: 3`,
  (t) => {
    // mode 3: aggressively chomp all whitespace
    const o = { mode: 3 };
    t.equal(chompRight("a b c d  c dx", 2, o, "c", "d"), 12, "05.04.01");
    t.equal(chompRight("a b c d  c d x", 2, o, "c", "d"), 13, "05.04.02");
    t.equal(chompRight("a b c d  c d  x", 2, o, "c", "d"), 14, "05.04.03");
    t.equal(chompRight("a b c d  c d \nx", 2, o, "c", "d"), 14, "05.04.04");
    t.equal(chompRight("a b c d  c d  \nx", 2, o, "c", "d"), 15, "05.04.05");
    t.equal(chompRight("a b c d  c d  \t \nx", 2, o, "c", "d"), 17, "05.04.06");
    t.equal(
      chompRight("a b c d  c d  \t \nx", 2, { mode: "3" }, "c", "d"),
      17,
      "05.04.07"
    );
    t.end();
  }
);

tap.test(
  `05.05 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${31}m${`not found`}\u001b[${39}m`} - all modes`,
  (t) => {
    t.equal(chompRight("a b c d  c dx", 2), null, "05.05.00");
    t.equal(chompRight("a b c d  c dx", 2, "z", "x"), null, "05.05.01");
    t.equal(
      chompRight("a b c d  c dx", 2, { mode: 0 }, "z", "x"),
      null,
      "05.05.02"
    );
    t.equal(
      chompRight("a b c d  c dx", 2, { mode: 1 }, "z", "x"),
      null,
      "05.05.03"
    );
    t.equal(
      chompRight("a b c d  c dx", 2, { mode: 2 }, "z", "x"),
      null,
      "05.05.04"
    );
    t.equal(
      chompRight("a b c d  c dx", 2, { mode: 3 }, "z", "x"),
      null,
      "05.05.05"
    );

    // idx is too high:
    t.equal(chompRight("a b c d  c dx", 99, "z", "x"), null, "05.05.06");
    t.equal(
      chompRight("a b c d  c dx", 99, { mode: 0 }, "z", "x"),
      null,
      "05.05.07"
    );
    t.equal(
      chompRight("a b c d  c dx", 99, { mode: 1 }, "z", "x"),
      null,
      "05.05.08"
    );
    t.equal(
      chompRight("a b c d  c dx", 99, { mode: 2 }, "z", "x"),
      null,
      "05.05.09"
    );
    t.equal(
      chompRight("a b c d  c dx", 99, { mode: 3 }, "z", "x"),
      null,
      "05.05.10"
    );

    // no args -> null:
    t.equal(chompRight("a b c d  c dx", 2), null, "05.05.11");
    t.equal(chompRight("a b c d  c dx", 2, { mode: 0 }), null, "05.05.12");
    t.equal(chompRight("a b c d  c dx", 2, { mode: 1 }), null, "05.05.13");
    t.equal(chompRight("a b c d  c dx", 2, { mode: 2 }), null, "05.05.14");
    t.equal(chompRight("a b c d  c dx", 2, { mode: 3 }), null, "05.05.15");

    // idx at wrong place:
    t.equal(chompRight("a b c d  c d  \nx", 0, "c", "d"), null, "05.05.16");

    // both args optional and don't exist
    t.equal(chompRight("a b c d  c d  \nx", 0, "m?", "n?"), null, "05.05.17");
    t.end();
  }
);

tap.test(
  `05.06 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`throws`}\u001b[${39}m`}`,
  (t) => {
    t.throws(() => {
      chompRight("a b c d  c dx", 2, { mode: "z" }, "k", "l");
    }, /THROW_ID_02/);
    t.end();
  }
);

tap.test(
  `05.07 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #1`,
  (t) => {
    // stop at \n
    t.equal(chompRight("a b c d  c d    \n", 2, null, "c", "d"), 16, "05.07");
    t.end();
  }
);

tap.test(
  `05.08 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #2`,
  (t) => {
    // stop at \n
    t.equal(chompRight("a", 0, null, "x"), null, "05.08");
    t.end();
  }
);

tap.test(
  `05.09 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #3`,
  (t) => {
    t.equal(chompRight(1, 0, null, "x"), null, "05.09");
    t.end();
  }
);

tap.test(
  `05.10 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #4`,
  (t) => {
    t.equal(
      chompRight("a b c d  c d    \t", 2, { mode: 0 }, "c", "d"),
      17,
      "05.10.01"
    );
    t.equal(
      chompRight("a b c d  c d    \t", 2, { mode: 2 }, "c", "d"),
      17,
      "05.10.02"
    );
    t.equal(
      chompRight("a b c d  c d    \t", 2, { mode: 3 }, "c", "d"),
      17,
      "05.10.03"
    );
    t.end();
  }
);

tap.test(
  `05.11 - \u001b[${32}m${`chompRight`}\u001b[${39}m - ${`\u001b[${31}m${`adhoc`}\u001b[${39}m`} #5 - real life`,
  (t) => {
    t.equal(chompRight(`<a bcd="ef">`, 6, "="), null, "05.11.01");
    t.equal(chompRight(`<a bcd=="ef">`, 6, "="), 8, "05.11.02");
    t.equal(chompRight(`<a bcd==="ef">`, 6, "="), 9, "05.11.03");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, "="), 9, "05.11.04");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, "="), 10, "05.11.05");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, "="), 9, "05.11.06");
    t.equal(chompRight(`<a bcd= == "ef">`, 6, "="), 10, "05.11.07");

    // hardcoded defaults mode === 0
    t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 0 }, "="), null, "05.11.08");
    t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 0 }, "="), 8, "05.11.09");
    t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 0 }, "="), 9, "05.11.10");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 0 }, "="), 9, "05.11.11");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 0 }, "="), 10, "05.11.12");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 0 }, "="), 9, "05.11.13");
    t.equal(
      chompRight(`<a bcd= == "ef">`, 6, { mode: 0 }, "="),
      10,
      "05.11.14"
    );

    // mode === 1
    t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 1 }, "="), null, "05.11.15");
    t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 1 }, "="), 8, "05.11.16");
    t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 1 }, "="), 9, "05.11.17");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 1 }, "="), 9, "05.11.18");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 1 }, "="), 10, "05.11.19");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 1 }, "="), 9, "05.11.20");
    t.equal(
      chompRight(`<a bcd= == "ef">`, 6, { mode: 1 }, "="),
      10,
      "05.11.21"
    );

    // mode === 2
    t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 2 }, "="), null, "05.11.22");
    t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 2 }, "="), 8, "05.11.23");
    t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 2 }, "="), 9, "05.11.24");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 2 }, "="), 9, "05.11.25");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 2 }, "="), 10, "05.11.26");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 2 }, "="), 10, "05.11.27");
    t.equal(
      chompRight(`<a bcd= == "ef">`, 6, { mode: 2 }, "="),
      11,
      "05.11.28"
    );

    // mode === 3
    t.equal(chompRight(`<a bcd="ef">`, 6, { mode: 3 }, "="), null, "05.11.29");
    t.equal(chompRight(`<a bcd=="ef">`, 6, { mode: 3 }, "="), 8, "05.11.30");
    t.equal(chompRight(`<a bcd==="ef">`, 6, { mode: 3 }, "="), 9, "05.11.31");
    t.equal(chompRight(`<a bcd= ="ef">`, 6, { mode: 3 }, "="), 9, "05.11.32");
    t.equal(chompRight(`<a bcd= =="ef">`, 6, { mode: 3 }, "="), 10, "05.11.33");
    t.equal(chompRight(`<a bcd= = "ef">`, 6, { mode: 3 }, "="), 10, "05.11.34");
    t.equal(
      chompRight(`<a bcd= == "ef">`, 6, { mode: 3 }, "="),
      11,
      "05.11.35"
    );
    t.end();
  }
);

// 06. chompLeft()
// -----------------------------------------------------------------------------

tap.test(
  `06.01 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${32}m${`found`}\u001b[${39}m`} - mode: 0`,
  (t) => {
    t.equal(chompLeft("ab c b c  x y", 10, "b", "c"), 1, "06.01.01");
    t.equal(chompLeft("a b c b c  x y", 11, "b", "c"), 2, "06.01.02");
    t.equal(chompLeft("a  b c b c  x y", 12, "b", "c"), 2, "06.01.03");
    t.equal(chompLeft("a\n b c b c  x y", 12, "b", "c"), 2, "06.01.04");
    t.equal(chompLeft("a\n  b c b c  x y", 13, "b", "c"), 2, "06.01.05");

    // with hardcoded default opts
    const o = { mode: 0 };
    t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "06.01.06");
    t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 2, "06.01.07");
    t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 2, "06.01.08");
    t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 2, "06.01.09");
    t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 2, "06.01.10");
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "0" }, "b", "c"),
      2,
      "06.01.11"
    );
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: null }, "b", "c"),
      2,
      "06.01.12"
    );
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "" }, "b", "c"),
      2,
      "06.01.13"
    );
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: undefined }, "b", "c"),
      2,
      "06.01.14"
    );
    t.equal(chompLeft("a\n  b c b c  x y", 13, "b", "c", "x?"), 2, "06.01.15");
    t.equal(
      chompLeft("a\n  b c b c  x y", 13, "y?", "b", "c", "x?"),
      2,
      "06.01.16"
    );
    t.end();
  }
);

tap.test(
  `06.02 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${32}m${`found`}\u001b[${39}m`} - mode: 1`,
  (t) => {
    // mode 1: stop at first space, leave the whitespace alone
    const o = { mode: 1 };
    t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "06.02.06");
    t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 2, "06.02.07");
    t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 3, "06.02.08");
    t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 3, "06.02.09");
    t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 4, "06.02.10");
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "1" }, "b", "c"),
      4,
      "06.02.11"
    );
    t.end();
  }
);

tap.test(
  `06.03 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${32}m${`found`}\u001b[${39}m`} - mode: 2`,
  (t) => {
    // mode 2: hungrily chomp all whitespace except newlines
    const o = { mode: 2 };
    t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "06.03.06");
    t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 1, "06.03.07");
    t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 1, "06.03.08");
    t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 2, "06.03.09");
    t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 2, "06.03.10");
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "2" }, "b", "c"),
      2,
      "06.03.11"
    );
    t.end();
  }
);

tap.test(
  `06.04 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${32}m${`found`}\u001b[${39}m`} - mode: 3`,
  (t) => {
    // mode 3: aggressively chomp all whitespace
    const o = { mode: 3 };
    t.equal(chompLeft("ab c b c  x y", 10, o, "b", "c"), 1, "06.04.06");
    t.equal(chompLeft("a b c b c  x y", 11, o, "b", "c"), 1, "06.04.07");
    t.equal(chompLeft("a  b c b c  x y", 12, o, "b", "c"), 1, "06.04.08");
    t.equal(chompLeft("a\n b c b c  x y", 12, o, "b", "c"), 1, "06.04.09");
    t.equal(chompLeft("a\n  b c b c  x y", 13, o, "b", "c"), 1, "06.04.10");
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c"),
      1,
      "06.04.11"
    );
    t.equal(
      chompLeft("a\n  b c b c  x y", 12, { mode: "3" }, "b", "c?"),
      1,
      "06.04.12"
    );
    t.end();
  }
);

tap.test(
  `06.05 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${31}m${`not found`}\u001b[${39}m`} - all modes`,
  (t) => {
    t.equal(chompLeft("ab c b c  x y", -1), null, "06.05.00");
    t.equal(chompLeft("ab c b c  x y", 0), null, "06.05.00");
    t.equal(chompLeft("ab c b c  x y", 10), null, "06.05.00");
    t.equal(chompLeft("ab c b c  x y", 10, "z", "x"), null, "06.05.01");
    t.equal(
      chompLeft("ab c b c  x y", 10, { mode: 0 }, "z", "x"),
      null,
      "06.05.02"
    );
    t.equal(
      chompLeft("ab c b c  x y", 10, { mode: 1 }, "z", "x"),
      null,
      "06.05.03"
    );
    t.equal(
      chompLeft("ab c b c  x y", 10, { mode: 2 }, "z", "x"),
      null,
      "06.05.04"
    );
    t.equal(
      chompLeft("ab c b c  x y", 10, { mode: 3 }, "z", "x"),
      null,
      "06.05.05"
    );

    // idx is zero/negative:
    t.equal(chompLeft("a b c d  c dx", 0, "z", "x"), null, "05.05.06");
    t.equal(
      chompLeft("a b c d  c dx", 0, { mode: 0 }, "z", "x"),
      null,
      "05.05.07"
    );
    t.equal(
      chompLeft("a b c d  c dx", 0, { mode: 1 }, "z", "x"),
      null,
      "05.05.08"
    );
    t.equal(
      chompLeft("a b c d  c dx", 0, { mode: 2 }, "z", "x"),
      null,
      "05.05.09"
    );
    t.equal(
      chompLeft("a b c d  c dx", 0, { mode: 3 }, "z", "x"),
      null,
      "05.05.10"
    );

    t.equal(chompLeft("a b c d  c dx", 99, "z", "x"), null, "05.05.11");
    t.equal(
      chompLeft("a b c d  c dx", 99, { mode: 0 }, "z", "x"),
      null,
      "05.05.12"
    );
    t.equal(
      chompLeft("a b c d  c dx", 99, { mode: 1 }, "z", "x"),
      null,
      "05.05.13"
    );
    t.equal(
      chompLeft("a b c d  c dx", 99, { mode: 2 }, "z", "x"),
      null,
      "05.05.14"
    );
    t.equal(
      chompLeft("a b c d  c dx", 99, { mode: 3 }, "z", "x"),
      null,
      "05.05.15"
    );

    // no args -> null:
    t.equal(chompLeft("a b c d  c dx", 2), null, "05.05.16");
    t.equal(chompLeft("a b c d  c dx", 2, { mode: 0 }), null, "05.05.17");
    t.equal(chompLeft("a b c d  c dx", 2, { mode: 1 }), null, "05.05.18");
    t.equal(chompLeft("a b c d  c dx", 2, { mode: 2 }), null, "05.05.19");
    t.equal(chompLeft("a b c d  c dx", 2, { mode: 3 }), null, "05.05.20");
    t.end();
  }
);

tap.test(
  `06.06 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`throws`}\u001b[${39}m`}`,
  (t) => {
    t.throws(() => {
      chompLeft("a b c d  c dx", 2, { mode: "z" }, "k", "l");
    }, /THROW_ID_01/);
    t.end();
  }
);

tap.test(
  `06.07 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #1`,
  (t) => {
    // stop at \n
    t.equal(
      chompLeft(" \n  b c   b  c   x y", 17, null, "b", "c"),
      2,
      "06.07.01"
    );
    t.end();
  }
);

tap.test(
  `06.08 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #2`,
  (t) => {
    t.equal(
      chompLeft("         b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
      0,
      "06.08"
    );
    t.end();
  }
);

tap.test(
  `06.09 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #3`,
  (t) => {
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
      1,
      "06.09.01"
    );
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 3 }, "b", "c"),
      1,
      "06.09.02"
    );
    t.end();
  }
);

tap.test(
  `06.10 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #4`,
  (t) => {
    t.equal(chompLeft(1, 22, { mode: 2 }, "b", "c"), null, "06.10");
    t.end();
  }
);

tap.test(
  `06.11 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #5`,
  (t) => {
    t.equal(
      chompLeft("\t        b c   b  c   x y", 22, { mode: 0 }, "b", "c"),
      0,
      "06.11.01"
    );
    t.equal(
      chompLeft("\t        b c   b  c   x y", 22, { mode: 2 }, "b", "c"),
      0,
      "06.11.02"
    );
    t.equal(
      chompLeft("\t        b c   b  c   x y", 22, { mode: 3 }, "b", "c"),
      0,
      "06.11.03"
    );
    t.end();
  }
);

tap.test(
  `06.12 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #5`,
  (t) => {
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "b", "c"),
      2,
      "06.12.01"
    );
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "b?", "c?"),
      2,
      "06.12.02"
    );
    t.equal(
      chompLeft("a        b c   b  c   x y", 22, { mode: 0 }, "x?", "b", "c"),
      2,
      "06.12.03"
    );
    t.end();
  }
);

tap.test(
  `05.13 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #6 - real life`,
  (t) => {
    t.equal(chompLeft(`<a bcd="ef">`, 6, "="), null, "05.13.01");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, "="), 6, "05.13.02");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, "="), 6, "05.13.03");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, "="), 6, "05.13.04");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, "="), 6, "05.13.05");

    // hardcoded default, mode === 0
    t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 0 }, "="), null, "05.13.06");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 0 }, "="), 6, "05.13.07");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 0 }, "="), 6, "05.13.08");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 0 }, "="), 6, "05.13.09");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, { mode: 0 }, "="), 6, "05.13.10");

    // mode === 1
    t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 1 }, "="), null, "05.13.11");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 1 }, "="), 6, "05.13.12");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 1 }, "="), 6, "05.13.13");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 1 }, "="), 6, "05.13.14");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, { mode: 1 }, "="), 6, "05.13.15");

    // mode === 2
    t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 2 }, "="), null, "05.13.16");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 2 }, "="), 6, "05.13.17");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 2 }, "="), 6, "05.13.18");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 2 }, "="), 6, "05.13.19");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, { mode: 2 }, "="), 6, "05.13.20");

    // mode === 3
    t.equal(chompLeft(`<a bcd="ef">`, 6, { mode: 3 }, "="), null, "05.13.21");
    t.equal(chompLeft(`<a bcd=="ef">`, 7, { mode: 3 }, "="), 6, "05.13.22");
    t.equal(chompLeft(`<a bcd==="ef">`, 8, { mode: 3 }, "="), 6, "05.13.23");
    t.equal(chompLeft(`<a bcd= ="ef">`, 8, { mode: 3 }, "="), 6, "05.13.24");
    t.equal(chompLeft(`<a bcd= = ="ef">`, 8, { mode: 3 }, "="), 6, "05.13.25");
    t.end();
  }
);

tap.test(
  `05.14 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`adhoc`}\u001b[${39}m`} #7 - real life`,
  (t) => {
    t.equal(
      chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 20, "!"),
      1,
      "05.14.01"
    );
    t.equal(
      chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 19, "!"),
      1,
      "05.14.02"
    );
    t.equal(
      chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 18, "!"),
      1,
      "05.14.03"
    );
    t.equal(
      chompLeft(`<!!! ! ! ! ! ! ! ! ![CDATA[some stuff]]>`, 17, "!"),
      1,
      "05.14.04"
    );
    t.end();
  }
);

tap.test(
  `05.15 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`hungry`}\u001b[${39}m`} sequence`,
  (t) => {
    t.equal(chompLeft(`. . . . . ....   . x`, 19, ".*"), 0, "05.15");
    t.end();
  }
);

tap.test(
  `05.16 - \u001b[${34}m${`chompLeft`}\u001b[${39}m - ${`\u001b[${33}m${`hungry`}\u001b[${39}m`} sequence`,
  (t) => {
    t.equal(
      chompLeft(`<  << <  << < !! !! ! ! [[[ [ [[  [ x`, 36, "<*", "!*", "[*"),
      0,
      "05.16"
    );
    t.end();
  }
);

// 06. leftStopAtNewLines()
// -----------------------------------------------------------------------------

tap.test(
  `06.01 - \u001b[${35}m${`leftStopAtNewLines`}\u001b[${39}m - null result cases`,
  (t) => {
    t.equal(leftStopAtNewLines("abc"), null, "06.01.01 - assumed default");
    t.equal(leftStopAtNewLines("abc", 0), null, "06.01.02 - hardcoded default");
    t.equal(
      leftStopAtNewLines("abc", null),
      null,
      "06.01.03 - hardcoded default"
    );
    t.equal(leftStopAtNewLines("abc", 4), 2, "06.01.04 - at string.length + 1");
    t.equal(
      leftStopAtNewLines("abc", 9),
      2,
      "06.01.05 - outside of the string.length"
    );
    t.equal(leftStopAtNewLines(""), null, "06.01.06");
    t.equal(leftStopAtNewLines("", 0), null, "06.01.07");
    t.equal(leftStopAtNewLines("", null), null, "06.01.08");
    t.equal(leftStopAtNewLines("", undefined), null, "06.01.09");
    t.equal(leftStopAtNewLines("", 1), null, "06.01.10");
    t.end();
  }
);

tap.test(
  `06.02 - \u001b[${35}m${`leftStopAtNewLines`}\u001b[${39}m - normal use`,
  (t) => {
    t.notOk(!!leftStopAtNewLines(""), "06.02.01");
    t.notOk(!!leftStopAtNewLines("a"), "06.02.02");
    t.equal(leftStopAtNewLines("ab", 1), 0, "06.02.03");
    t.equal(leftStopAtNewLines("a b", 2), 0, "06.02.04");

    t.equal(leftStopAtNewLines("a \n\n\nb", 5), 4, "06.02.05");
    t.equal(leftStopAtNewLines("a \n\n\n b", 6), 4, "06.02.06");
    t.equal(leftStopAtNewLines("a \r\r\r b", 6), 4, "06.02.07");
    t.equal(leftStopAtNewLines("a\n\rb", 3), 2, "06.02.08");
    t.equal(leftStopAtNewLines("a\n\r b", 4), 2, "06.02.09");

    t.equal(leftStopAtNewLines("\n\n\n\n", 4), 3, "06.02.10");
    t.equal(leftStopAtNewLines("\n\n\n\n", 3), 2, "06.02.11");
    t.equal(leftStopAtNewLines("\n\n\n\n", 2), 1, "06.02.12");
    t.equal(leftStopAtNewLines("\n\n\n\n", 1), 0, "06.02.13");
    t.equal(leftStopAtNewLines("\n\n\n\n", 0), null, "06.02.14");
    t.end();
  }
);

// 07. rightStopAtNewLines()
// -----------------------------------------------------------------------------

tap.test(
  `07.01 - \u001b[${36}m${`rirightStopAtNewLinesght`}\u001b[${39}m - calling at string length`,
  (t) => {
    t.equal(rightStopAtNewLines(""), null, "07.01.01");
    t.equal(rightStopAtNewLines("", null), null, "07.01.02");
    t.equal(rightStopAtNewLines("", undefined), null, "07.01.03");
    t.equal(rightStopAtNewLines("", 0), null, "07.01.04");
    t.equal(rightStopAtNewLines("", 1), null, "07.01.05");
    t.equal(rightStopAtNewLines("", 99), null, "07.01.06");
    t.equal(rightStopAtNewLines("abc", 3), null, "07.01.07");
    t.equal(rightStopAtNewLines("abc", 99), null, "07.01.08");
    t.end();
  }
);

tap.test(
  `07.02 - \u001b[${36}m${`rightStopAtNewLines`}\u001b[${39}m - normal use`,
  (t) => {
    t.notOk(!!rightStopAtNewLines(""), "07.02.01");
    t.notOk(!!rightStopAtNewLines("a"), "07.02.02");

    // zero was defaulted to, which is 'a', so to the right of it is 'b', index 1:
    t.equal(rightStopAtNewLines("ab"), 1, "07.02.03");

    // 2nd input arg was omitted so starting index is zero, which is "a".
    // Now, to the right of it, there's a space, index 1, next non-whitespace char
    // is b which is index 2.
    t.equal(rightStopAtNewLines("a b"), 2, "07.02.04");
    t.equal(rightStopAtNewLines("a b", 0), 2, "07.02.05");
    t.equal(rightStopAtNewLines("a b", 1), 2, "07.02.06");
    t.equal(rightStopAtNewLines("a b", 2), null, "07.02.07");

    t.equal(rightStopAtNewLines("a \n\n\nb"), 2, "07.02.08");
    t.equal(rightStopAtNewLines("a \n\n\nb", 0), 2, "07.02.09");
    t.equal(rightStopAtNewLines("a \n\n\nb", 1), 2, "07.02.10");
    t.equal(rightStopAtNewLines("a \n\n\nb", 2), 3, "07.02.11");
    t.equal(rightStopAtNewLines("a \n\n\nb", 3), 4, "07.02.12");
    t.equal(rightStopAtNewLines("a \n\n\nb", 4), 5, "07.02.13");
    t.equal(rightStopAtNewLines("a \n\n\nb", 5), null, "07.02.14");
    t.equal(rightStopAtNewLines("a \n\n\n\n"), 2, "07.02.15");
    t.equal(rightStopAtNewLines("a  "), null, "07.02.16");
    t.equal(rightStopAtNewLines("a  ", 0), null, "07.02.17");
    t.equal(rightStopAtNewLines("a  ", 1), null, "07.02.18");
    t.equal(rightStopAtNewLines("a  ", 2), null, "07.02.19");
    t.equal(rightStopAtNewLines("a  ", 3), null, "07.02.20");
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
