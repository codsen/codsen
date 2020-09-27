import tap from "tap";
import compare from "../dist/ast-compare.esm";

// strings
// -----------------------------------------------------------------------------

tap.test("01 - simple strings", (t) => {
  t.strictSame(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    true,
    "01.01"
  );
  t.strictSame(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "01.02"
  );

  t.strictSame(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "01.03"
  );
  t.strictSame(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "01.04"
  );

  t.strictSame(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    true,
    "01.05"
  );
  t.strictSame(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "01.06"
  );

  t.strictSame(
    compare("aaaaa\nbbbbb", "aaaaa\nbbbbb", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    true,
    "01.07"
  );
  t.strictSame(
    compare("aaaaa\nbbbbb", "aaaaa\nc", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "01.08"
  );
  t.end();
});

tap.test("02 - strings compared and fails", (t) => {
  t.strictSame(compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"]), false, "02.01");
  t.not(
    compare("aaaaa\nbbbbb", ["aaaaa\nbbbbb"], { verboseWhenMismatches: true }),
    true,
    "05.02.02"
  );
  t.end();
});

tap.test("03 - strings in arrays compared, positive", (t) => {
  t.strictSame(compare(["aaaaa\nbbbbb"], ["aaaaa\nbbbbb"]), true, "03");
  t.end();
});

tap.test(
  "04 - string against empty array or empty string within an array",
  (t) => {
    t.strictSame(compare(["aaaaa\nbbbbb"], []), false, "04.01");
    t.strictSame(
      compare(["aaaaa\nbbbbb"], [], { hungryForWhitespace: true }),
      true,
      "04.02"
    );
    t.strictSame(
      compare(["aaaaa\nbbbbb"], ["\n\n\n"], { hungryForWhitespace: true }),
      true,
      "04.03"
    );
    t.strictSame(
      compare(["aaaaa\nbbbbb", "\t\t\t \n\n\n", "   "], ["\n\n\n"], {
        hungryForWhitespace: true,
      }),
      true,
      "04.04"
    );
    t.end();
  }
);

tap.test("05 - string vs empty space", (t) => {
  t.strictSame(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "05.01"
  );
  t.strictSame(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    false,
    "05.02"
  );
  t.strictSame(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "05.03"
  );
  t.strictSame(
    compare("aaaaa\nbbbbb", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    false,
    "05.04"
  );
  t.end();
});

tap.test("06 - empty space vs different empty space", (t) => {
  t.strictSame(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: false,
    }),
    false,
    "06.01"
  );
  t.strictSame(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: false,
      hungryForWhitespace: true,
    }),
    true,
    "06.02"
  );
  t.strictSame(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: false,
    }),
    false,
    "06.03"
  );
  t.strictSame(
    compare("     \n\n\n\n\n\n\n\n     ", "\n\n\n   \t\t\t   ", {
      matchStrictly: true,
      hungryForWhitespace: true,
    }),
    true,
    "06.04"
  );
  t.end();
});

tap.test("07 - two arrays, one empty", (t) => {
  t.strictSame(
    compare(["\t\t\t\t\t\t      \n\n\n    \t\t\t"], []),
    false,
    "07.01 - in root, defaults"
  );
  t.strictSame(
    compare(
      { a: ["\t\t\t\t\t\t      \n\n\n    \t\t\t"] },
      { a: [] },
      { hungryForWhitespace: true }
    ),
    true,
    "07.02 - in root, defaults"
  );
  t.strictSame(
    compare([], ["\t\t\t\t\t\t      \n\n\n    \t\t\t"], {
      hungryForWhitespace: true,
    }),
    true,
    "07.03 - in root, defaults, opposite from #2"
  );
  t.end();
});

tap.test("08 - opts.matchStrictly", (t) => {
  t.strictSame(
    compare(
      { a: "a" },
      {},
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    false,
    "08.01 - key count mismatch"
  );
  t.strictSame(
    typeof compare(
      {},
      { a: "a" },
      { matchStrictly: true, verboseWhenMismatches: true }
    ),
    "string",
    "08.02 - key count mismatch"
  );
  t.end();
});
