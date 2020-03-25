const t = require("tap");
const trim = require("../dist/string-trim-spaces-only.cjs");

const rawnbsp = "\u00a0";

t.test("01 - empty string, defaults", (t) => {
  t.same(
    trim(""),
    {
      res: "",
      ranges: [],
    },
    "01"
  );
  t.end();
});

t.test("02 - empty string, classicTrim=false", (t) => {
  t.same(
    trim("", { classicTrim: false }),
    {
      res: "",
      ranges: [],
    },
    "02 - hardcoded default"
  );
  t.end();
});

t.test("03 - empty string, classicTrim=true", (t) => {
  t.same(
    trim("", { classicTrim: true }),
    {
      res: "",
      ranges: [],
    },
    "03"
  );
  t.end();
});

t.test("04 - single space, defaults", (t) => {
  t.same(
    trim(" "),
    {
      res: "",
      ranges: [[0, 1]],
    },
    "04"
  );
  t.end();
});

t.test("05 - single space, classicTrim=false", (t) => {
  t.same(
    trim(" ", { classicTrim: false }),
    {
      res: "",
      ranges: [[0, 1]],
    },
    "05"
  );
  t.end();
});

t.test("06 - single space, classicTrim=true", (t) => {
  t.same(
    trim(" ", { classicTrim: true }),
    {
      res: "",
      ranges: [[0, 1]],
    },
    "06"
  );
  t.end();
});

t.test("07 - single letter", (t) => {
  t.same(trim("a"), { res: "a", ranges: [] }, "07");
  t.end();
});

t.test("08 - single letter, classicTrim=false", (t) => {
  t.same(trim("a", { classicTrim: false }), { res: "a", ranges: [] }, "08");
  t.end();
});

t.test("09 - single letter, classicTrim=true", (t) => {
  t.same(trim("a", { classicTrim: true }), { res: "a", ranges: [] }, "09");
  t.end();
});

t.test("10 - leading space, default", (t) => {
  t.same(trim(" a a"), { res: "a a", ranges: [[0, 1]] }, "10");
  t.end();
});

t.test("11 - leading space, classicTrim=false", (t) => {
  t.same(
    trim(" a a", { classicTrim: false }),
    { res: "a a", ranges: [[0, 1]] },
    "11"
  );
  t.end();
});

t.test("12 - leading space, classicTrim=true", (t) => {
  t.same(
    trim(" a a", { classicTrim: true }),
    { res: "a a", ranges: [[0, 1]] },
    "12"
  );
  t.end();
});

t.test("13 - trailing space, defaults", (t) => {
  t.same(trim("a a "), { res: "a a", ranges: [[3, 4]] }, "13");
  t.end();
});

t.test("14 - trailing space, defaults", (t) => {
  t.same(
    trim("a a ", { classicTrim: false }),
    { res: "a a", ranges: [[3, 4]] },
    "14"
  );
  t.end();
});

t.test("15 - trailing space, defaults", (t) => {
  t.same(
    trim("a a ", { classicTrim: true }),
    { res: "a a", ranges: [[3, 4]] },
    "15"
  );
  t.end();
});

t.test("16 - space on both sides", (t) => {
  t.same(
    trim("   a a     "),
    {
      res: "a a",
      ranges: [
        [0, 3],
        [6, 11],
      ],
    },
    "16"
  );
  t.end();
});

t.test("17 - space on both sides - copes with emoji", (t) => {
  t.same(
    trim("   👍     "),
    {
      res: "👍",
      ranges: [
        [0, 3],
        [5, 10],
      ],
    },
    "17"
  );
  t.end();
});

t.test("18 - space on both sides - classicTrim=true", (t) => {
  t.same(
    trim("   a a     ", { classicTrim: true }),
    {
      res: "a a",
      ranges: [
        [0, 3],
        [6, 11],
      ],
    },
    "18"
  );
  t.end();
});

t.test(
  "19 - space on both sides - copes with emoji - classicTrim=true",
  (t) => {
    t.same(
      trim("   👍     ", { classicTrim: true }),
      {
        res: "👍",
        ranges: [
          [0, 3],
          [5, 10],
        ],
      },
      "19"
    );
    t.end();
  }
);

t.test("20 - trimming hits the newline and stops", (t) => {
  t.same(
    trim("   \n  a a  \n   "),
    {
      res: "\n  a a  \n",
      ranges: [
        [0, 3],
        [12, 15],
      ],
    },
    "20"
  );
  t.end();
});

t.test("21 - trimming hits the tab and stops", (t) => {
  t.same(
    trim("   \t  a a  \t   "),
    {
      res: "\t  a a  \t",
      ranges: [
        [0, 3],
        [12, 15],
      ],
    },
    "21"
  );
  t.end();
});

t.test("22 - trimming hits the newline and stops - classicTrim", (t) => {
  t.same(
    trim("   \n  a a  \n   ", { classicTrim: true }),
    {
      res: "a a",
      ranges: [
        [0, 6],
        [9, 15],
      ],
    }, // <---------------- !
    "22"
  );
  t.end();
});

t.test("23 - trimming hits the tab and stops - classicTrim", (t) => {
  t.same(
    trim("   \t  a a  \t   ", { classicTrim: true }),
    {
      res: "a a",
      ranges: [
        [0, 6],
        [9, 15],
      ],
    }, // <---------------- !
    "23"
  );
  t.end();
});

t.test("24 - non-string input", (t) => {
  t.throws(() => {
    trim(true);
  }, /THROW_ID_01/g);

  t.throws(() => {
    trim(undefined);
  }, /THROW_ID_01/g);

  t.throws(() => {
    trim(9);
  }, /THROW_ID_01/g);

  const input = { a: "zzz" };
  t.throws(() => {
    trim(input);
  }, /THROW_ID_01/g);

  t.throws(() => {
    trim(true, { classicTrim: true });
  }, /THROW_ID_01/g);

  t.throws(() => {
    trim(undefined, { classicTrim: true });
  }, /THROW_ID_01/g);

  t.throws(() => {
    trim(9, { classicTrim: true });
  }, /THROW_ID_01/g);

  t.throws(() => {
    trim(input, { classicTrim: true });
  }, /THROW_ID_01/g);

  t.end();
});

// opts.space
t.test("25 - opts.space - default", (t) => {
  t.same(
    trim("   a b c   "),
    {
      res: "a b c",
      ranges: [
        [0, 3],
        [8, 11],
      ],
    },
    "25"
  );
  t.end();
});

t.test("26 - opts.space - tabs", (t) => {
  t.same(
    trim(" \t  a b c  \t "),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "26.01"
  );
  t.same(
    trim(" \t  a b c  \t ", { space: true }),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "26.02"
  );
  t.same(
    trim(" \t  a b c  \t ", { tab: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "26.03 - classicTrim negates everything"
  );
  t.same(
    trim(" \t  a b c  \t ", { space: true, tab: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "26.04"
  );
  t.same(
    trim(" \t  a b c  \t ", { space: false, tab: true }),
    { res: " \t  a b c  \t ", ranges: [] },
    "26.05 - spaces trim is not enabled and stops everything"
  );
  t.end();
});

// opts.cr
t.test("27 - opts.cr", (t) => {
  t.same(
    trim(" \t  a b c  \t "),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "27.01"
  );
  t.same(
    trim(" \t  a b c  \t ", { cr: true }),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "27.02"
  );
  t.same(
    trim(" \t  a b c  \t ", { cr: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "27.03 - classicTrim negates all other settings"
  );
  t.same(
    trim(" \r  a b c  \r ", { cr: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "27.04"
  );
  t.same(
    trim(" \r  a b c  \r ", { cr: true, space: false }),
    { res: " \r  a b c  \r ", ranges: [] },
    "27.05 - spaces turned off"
  );
  t.same(
    trim("\r  a b c  \r", { cr: true, space: false }),
    {
      res: "  a b c  ",
      ranges: [
        [0, 1],
        [10, 11],
      ],
    },
    "27.06 - only CR's trimmed as requested"
  );
  t.end();
});

// opts.cr
t.test("28 - opts.lf", (t) => {
  t.same(
    trim(" \t  a b c  \t "),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "28.01"
  );
  t.same(
    trim(" \t  a b c  \t ", { lf: true }),
    {
      res: "\t  a b c  \t",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "28.02"
  );
  t.same(
    trim(" \t  a b c  \t ", { lf: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "28.03 - classicTrim negates all other settings"
  );
  t.same(
    trim(" \n  a b c  \n ", { lf: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "28.04"
  );
  t.same(
    trim(" \n  a b c  \n ", { lf: true, space: false }),
    { res: " \n  a b c  \n ", ranges: [] },
    "28.05 - spaces turned off"
  );
  t.same(
    trim("\n  a b c  \n", { lf: true, space: false }),
    {
      res: "  a b c  ",
      ranges: [
        [0, 1],
        [10, 11],
      ],
    },
    "28.06 - only CR's trimmed as requested"
  );
  t.end();
});

// opts.tab
t.test("29 - opts.tab", (t) => {
  t.same(
    trim(" \n  a b c  \n "),
    {
      res: "\n  a b c  \n",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "29.01"
  );
  t.same(
    trim(" \n  a b c  \n ", { tab: true }),
    {
      res: "\n  a b c  \n",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "29.02"
  );
  t.same(
    trim(" \n  a b c  \n ", { tab: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "29.03 - classicTrim negates all other settings"
  );
  t.same(
    trim(" \t  a b c  \t ", { tab: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "29.04"
  );
  t.same(
    trim(" \t  a b c  \t ", { tab: true, space: false }),
    { res: " \t  a b c  \t ", ranges: [] },
    "29.05 - spaces turted off"
  );
  t.same(
    trim("\t  a b c  \t", { tab: true, space: false }),
    {
      res: "  a b c  ",
      ranges: [
        [0, 1],
        [10, 11],
      ],
    },
    "29.06 - only tabs were trimmed as requested"
  );
  t.end();
});

// opts.nbsp
t.test("30 - opts.nbsp", (t) => {
  t.same(
    trim(" \n  a b c  \n "),
    {
      res: "\n  a b c  \n",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "30.01"
  );
  t.same(
    trim(" \n  a b c  \n ", { nbsp: true }),
    {
      res: "\n  a b c  \n",
      ranges: [
        [0, 1],
        [12, 13],
      ],
    },
    "30.02"
  );
  t.same(
    trim(" \n  a b c  \n ", { nbsp: true, classicTrim: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "30.03 - classicTrim negates all other settings"
  );
  t.same(
    trim(` ${rawnbsp}  a b c  ${rawnbsp} `, { nbsp: true }),
    {
      res: "a b c",
      ranges: [
        [0, 4],
        [9, 13],
      ],
    },
    "30.04"
  );
  t.same(
    trim(` ${rawnbsp}  a b c  ${rawnbsp} `, { nbsp: true, space: false }),
    { res: ` ${rawnbsp}  a b c  ${rawnbsp} `, ranges: [] },
    "30.05 - spaces turted off"
  );
  t.same(
    trim(`${rawnbsp}  a b c  ${rawnbsp}`, { nbsp: true, space: false }),
    {
      res: "  a b c  ",
      ranges: [
        [0, 1],
        [10, 11],
      ],
    },
    "30.06 - only tabs were trimmed as requested"
  );
  t.same(
    trim(`${rawnbsp}  a b c  ${rawnbsp}`, {
      nbsp: true,
      space: false,
      classicTrim: true,
    }),
    {
      res: `a b c`,
      ranges: [
        [0, 3],
        [8, 11],
      ],
    },
    "30.07"
  );
  t.end();
});
