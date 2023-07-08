import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// strings
// -----------------------------------------------------------------------------

test("01 - simple strings", () => {
  equal(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    true,
    "01.01",
  );
  equal(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "01.02",
  );

  equal(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "01.03",
  );
  equal(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "01.04",
  );

  equal(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    true,
    "01.05",
  );
  equal(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "01.06",
  );

  equal(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    true,
    "01.07",
  );
  equal(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "01.08",
  );
});

test("02 - strings compared and fails", () => {
  equal(compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "02.01");
  not.equal(
    compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"], { verboseWhenMismatches: true }),
    true,
    "02.02",
  );
});

test("03 - strings in arrays compared, positive", () => {
  equal(compare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "03.01");
});

test("04 - string against empty array or empty string within an array", () => {
  equal(compare(["aaaaa\nbbbbb"], []), false, "04.01");
  equal(
    compare(["aaaaa\nbbbbb"], [], { hungryForWhitespace: true }),
    true,
    "04.02",
  );
  equal(
    compare(["aaaaa\nbbbbb"], ["\n\n\n"], { hungryForWhitespace: true }),
    true,
    "04.03",
  );
  equal(
    compare(["aaaaa\nbbbbb", "\t\t\t \n\n\n", "   "], ["\n\n\n"], {
      hungryForWhitespace: true,
    }),
    true,
    "04.04",
  );
});

test("05 - string vs empty space", () => {
  equal(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "05.01",
  );
  equal(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "05.02",
  );
  equal(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "05.03",
  );
  equal(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "05.04",
  );
});

test("06 - empty space vs different empty space", () => {
  equal(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "06.01",
  );
  equal(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "06.02",
  );
  equal(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "06.03",
  );
  equal(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    true,
    "06.04",
  );
});

test("07 - two arrays, one empty", () => {
  equal(compare(["\t\t\t\t\t\t      \n\n\n    \t\t\t"], []), false, "07.01");
  equal(
    compare(
      { a: ["\t\t\t\t\t\t      \n\n\n    \t\t\t"] },
      { a: [] },
      { hungryForWhitespace: true },
    ),
    true,
    "07.02",
  );
  equal(
    compare([], ["\t\t\t\t\t\t      \n\n\n    \t\t\t"], {
      hungryForWhitespace: true,
    }),
    true,
    "07.03",
  );
});

test("08 - opts.matchStrictly", () => {
  equal(
    compare(
      { a: "a" },
      {},
      { matchStrictly: true, verboseWhenMismatches: true },
    ),
    false,
    "08.01",
  );
  equal(
    typeof compare(
      {},
      { a: "a" },
      { matchStrictly: true, verboseWhenMismatches: true },
    ),
    "string",
    "08.02",
  );
});

test.run();
