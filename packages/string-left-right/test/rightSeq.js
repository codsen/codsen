import tap from "tap";
import { rightSeq } from "../dist/string-left-right.esm.js";

// rightSeq()
// -----------------------------------------------------------------------------

tap.test(`01 - normal use`, (t) => {
  // starts at "c":
  t.strictSame(
    rightSeq("abcdefghijklmnop", 2, "d"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 3,
    },
    "01.01"
  );
  t.strictSame(
    rightSeq("abcdefghijklmnop", 2, "d", "e", "f"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 5,
    },
    "01.02"
  );
  t.strictSame(
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
    "01.03"
  );
  t.end();
});

tap.test(`02 - no findings`, (t) => {
  t.equal(rightSeq("abcdefghijklmnop", 0, "d", "e", "f"), null, "02");
  t.end();
});

tap.test(`03 - absent skips to right()`, (t) => {
  t.equal(rightSeq("abcdefghijklmnop", 0, "", ""), null, "03.01");
  t.strictSame(
    rightSeq("abcdefghijklmnop", 0, "b", ""),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "03.02"
  );
  t.strictSame(
    rightSeq("abcdefghijklmnop", 0, "", "b"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 1,
    },
    "03.03"
  );
  t.end();
});

tap.test(`04 - starting point outside of the range`, (t) => {
  t.equal(rightSeq("abcdefghijklmnop", 99, "d", "e", "f"), null, "04");
  t.end();
});

tap.test(`05 - optional - existing`, (t) => {
  t.strictSame(
    rightSeq("abcdefghijklmnop", 2, "d?", "e?", "f"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 5,
    },
    "05"
  );
  t.end();
});

tap.test(
  `06 - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - 1 not existing, no whitespace`,
  (t) => {
    t.strictSame(
      rightSeq("abcefghijklmnop", 2, "d?", "e", "f"),
      {
        gaps: [],
        leftmostChar: 3,
        rightmostChar: 4,
      },
      "06"
    );
    t.end();
  }
);

tap.test(
  `07 - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - 1 not existing, with whitespace`,
  (t) => {
    t.strictSame(
      rightSeq("abc  e   f   g   hijklmnop", 2, "d?", "e", "f"),
      {
        gaps: [
          [3, 5],
          [6, 9],
        ],
        leftmostChar: 5,
        rightmostChar: 9,
      },
      "07"
    );
    t.end();
  }
);

tap.test(
  `08 - ${`\u001b[${31}m${`optional`}\u001b[${39}m`} - ends with non-existing optional`,
  (t) => {
    t.strictSame(
      rightSeq("abc  e   f   g   hijklmnop", 2, "y?", "e", "z?"),
      {
        gaps: [[3, 5]],
        leftmostChar: 5,
        rightmostChar: 5,
      },
      "08"
    );
    t.end();
  }
);

tap.test(`09 - all optional, existing`, (t) => {
  t.strictSame(
    rightSeq("abcdefghijklmnop", 2, "d?", "e?", "f?"),
    {
      gaps: [],
      leftmostChar: 3,
      rightmostChar: 5,
    },
    "09"
  );
  t.end();
});

tap.test(`10 - all optional, not existing`, (t) => {
  t.equal(rightSeq("abcdefghijklmnop", 2, "x?"), null, "10.01");
  t.equal(rightSeq("abcdefghijklmnop", 2, "x?", "y?"), null, "10.02");
  t.equal(rightSeq("abcdefghijklmnop", 2, "x?", "y?", "z?"), null, "10.03");
  t.end();
});

tap.test(`11 - no findings`, (t) => {
  t.equal(rightSeq("ABCDEFGHIJKLMNOP", 0, "b", "c", "d"), null, "11.01");
  t.strictSame(
    rightSeq("ABCDEFGHIJKLMNOP", 0, { i: true }, "b", "c", "d"),
    {
      gaps: [],
      leftmostChar: 1,
      rightmostChar: 3,
    },
    "11.02"
  );
  t.end();
});
