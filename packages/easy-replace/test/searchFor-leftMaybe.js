import tap from "tap";
import { er } from "../dist/easy-replace.esm";

// ==============================
// searchFor + leftMaybe
// ==============================

tap.test("01 - left maybe found", (t) => {
  t.equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "ab🦄c",
    "test 2.1"
  );
  t.equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "ab🦄c",
    "test 2.1"
  );
  t.end();
});

tap.test("02 - two replacements with one leftmaybe, nearby", (t) => {
  t.equal(
    er(
      "ab🐴🦄🐴c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "abddc",
    "test 2.2"
  );
  t.equal(
    er(
      "ab🐴🦄🐴c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "abddc",
    "test 2.2"
  );
  t.end();
});

tap.test("03 - two consecutive maybes found/replaced", (t) => {
  t.equal(
    er(
      "ab🦄🐴🦄🐴c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "abddc",
    "test 2.3"
  );
  t.equal(
    er(
      "ab🦄🐴🦄🐴c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "abddc",
    "test 2.3"
  );
  t.end();
});

tap.test("04 - futile left maybe", (t) => {
  t.equal(
    er(
      "'🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "🦄",
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "'d",
    "test 2.4"
  );
  t.equal(
    er(
      "'🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "d"
    ),
    "'d",
    "test 2.4"
  );
  t.end();
});

tap.test("05 - line break as search string", (t) => {
  t.equal(
    er(
      "\n\n\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "\n",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aaa",
    "test 2.5"
  );
  t.end();
});

tap.test("06 - line break as both searchFor and maybe replaced", (t) => {
  t.equal(
    er(
      "\n\n\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "\n",
        searchFor: "\n",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aaa",
    "test 2.6"
  );
  t.equal(
    er(
      "\n\n\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["\n"],
        searchFor: "\n",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "a"
    ),
    "aaa",
    "test 2.6"
  );
  t.end();
});

tap.test("07 - operations on line breaks only", (t) => {
  t.equal(
    er(
      "\n\n",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: "",
        searchFor: "\n\n",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "\n"
    ),
    "\n",
    "test 2.7"
  );
  t.end();
});

tap.test("08 - three left maybes (found)", (t) => {
  t.equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄", "a", "x"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "ab🦄c",
    "test 2.8"
  );
  t.end();
});

tap.test("09 - three left maybes (not found)", (t) => {
  t.equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄", "🐴", "c"],
        searchFor: "🍺",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "a🦄🐴🦄c",
    "test 2.9"
  );
  t.end();
});

tap.test("10 - three left maybes (multiple hungry finds)", (t) => {
  t.equal(
    er(
      "🐴 a🍺🦄🐴🦄c a🦄🍺🐴🦄c a🦄🐴🦄c a🍺🐴🦄c 🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄", "🍺", "c"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "b a🍺b🦄c a🦄b🦄c ab🦄c ab🦄c b",
    "test 2.10.1"
  );
  t.equal(
    er(
      "🐴 a🍺🦄🐴🦄c a🦄🍺🐴🦄c a🦄🐴🦄c a🍺🐴🦄c 🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["c", "🦄", "🍺"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "b a🍺b🦄c a🦄b🦄c ab🦄c ab🦄c b",
    "test 2.10.2"
  );
  t.equal(
    er(
      "🐴 a🍺🦄🐴🦄c a🦄🍺🐴🦄c a🦄🐴🦄c a🍺🐴🦄c 🐴",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🍺", "c", "🦄"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "b a🍺b🦄c a🦄b🦄c ab🦄c ab🦄c b",
    "test 2.10.3"
  );
  t.end();
});
// if leftMaybe is simply merged and not iterated, and is queried to exist
// explicitly as string on the left side of the searchFor, it will not be found
// if the order of array is wrong, yet characters are all the same.

tap.test("11 - sneaky array conversion situation", (t) => {
  t.equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["a", "🦄"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "ab🦄c",
    "test 2.11"
  );
  t.end();
});

tap.test("12 - sneaky array conversion situation", (t) => {
  t.equal(
    er(
      "a🦄🐴🦄c",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["🦄", "a"],
        searchFor: "🐴",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "b"
    ),
    "ab🦄c",
    "test 2.12"
  );
  t.end();
});

tap.test("13 - normal words, few of them, leftMaybe as array", (t) => {
  t.equal(
    er(
      "this emotion is really a promotion in motion",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["e", "pro"],
        searchFor: "motion",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "test"
    ),
    "this test is really a test in test",
    "test 2.13"
  );
  t.end();
});

tap.test("14 - normal words, few of them, leftMaybe as array", (t) => {
  t.equal(
    er(
      "this emotion is really a promotion in motion",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["pro", "e"],
        searchFor: "motion",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "test"
    ),
    "this test is really a test in test",
    "test 2.14"
  );
  t.end();
});

tap.test("15 - leftMaybe is array, but with only 1 null value", (t) => {
  t.equal(
    er(
      "some text",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: [null],
        searchFor: "look for me",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "replace with me"
    ),
    "some text",
    "test 2.15"
  );
  t.end();
});

tap.test("16 - leftMaybe is array, but with only 1 null value", (t) => {
  t.equal(
    er(
      "some text",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: [null, null, null],
        searchFor: "look for me",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "replace with me"
    ),
    "some text",
    "test 2.16"
  );
  t.end();
});

tap.test("17 - leftMaybe is couple integers in an array", (t) => {
  t.equal(
    er(
      "1234",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: [2, 3],
        searchFor: 4,
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      9
    ),
    "129",
    "test 2.17"
  );
  t.end();
});

tap.test("18 - leftMaybe is couple integers in an array", (t) => {
  t.equal(
    er(
      "1234",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: [3, 2],
        searchFor: 4,
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      9
    ),
    "129",
    "test 2.18"
  );
  t.end();
});

tap.test("19 - sneaky case of overlapping leftMaybes", (t) => {
  t.equal(
    er(
      "this is a word to be searched for",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["be ", "to be ", "this not exists"],
        searchFor: "searched",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
      },
      "we look"
    ),
    "this is a word we look for",
    "test 2.19.1 - no flag"
  );
  t.equal(
    er(
      "this is a word To Be searched for",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["be ", "to be ", "this not exists"],
        searchFor: "searched",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftMaybe: true,
        },
      },
      "we look"
    ),
    "this is a word we look for",
    "test 2.19.2 - varying case"
  );
  t.equal(
    er(
      "this is a word To Be searched for",
      {
        leftOutsideNot: "",
        leftOutside: "",
        leftMaybe: ["this not exists", "zzz"],
        searchFor: "searched",
        rightMaybe: "",
        rightOutside: "",
        rightOutsideNot: "",
        i: {
          leftMaybe: true,
        },
      },
      "we look"
    ),
    "this is a word To Be we look for",
    "test 2.19.3"
  );
  t.end();
});
