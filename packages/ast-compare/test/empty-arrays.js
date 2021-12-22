import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// matching empty arrays
// -----------------------------------------------------------------------------

test("01 - matching empty arrays - blank vs. normal - defaults", () => {
  equal(compare({ a: "1", b: "2", c: 3 }, {}), false, "01");
});

test("02 - matching empty arrays - blank vs. empty - defaults", () => {
  equal(compare({ a: "\n\n", b: "\t", c: "   " }, {}), false, "02");
});

test("03 - matching empty arrays - blank vs. normal - opts.hungryForWhitespace", () => {
  equal(
    compare({ a: "1", b: "2", c: 3 }, {}, { hungryForWhitespace: true }),
    false,
    "03"
  );
});

test("04 - matching empty arrays - blank vs. empty - opts.hungryForWhitespace", () => {
  equal(
    compare(
      { a: "\n\n", b: "\t", c: "   " },
      {},
      { hungryForWhitespace: true }
    ),
    true,
    "04"
  );
});

test("05 - matching empty arrays - blank vs. normal - opts.matchStrictly", () => {
  equal(
    compare({ a: "1", b: "2", c: 3 }, {}, { matchStrictly: true }),
    false,
    "05"
  );
});

test("06 - matching empty arrays - blank vs. empty - opts.matchStrictly", () => {
  equal(
    compare({ a: "\n\n", b: "\t", c: "   " }, {}, { matchStrictly: true }),
    false,
    "06"
  );
});

test("07 - matching empty arrays - blank vs. normal - both opts", () => {
  equal(
    compare(
      { a: "1", b: "2", c: 3 },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    false,
    "07"
  );
});

test("08 - matching empty arrays - blank vs. empty - both opts", () => {
  equal(
    compare(
      { a: "\n\n", b: "\t", c: "   " },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "08"
  );
});

test("09 - matching empty arrays - blank vs. empty - both opts, arr values", () => {
  equal(
    compare(
      { a: [], b: [], c: [] },
      {},
      { hungryForWhitespace: true, matchStrictly: true }
    ),
    true,
    "09"
  );
});

test("10 - matching empty arrays - blank vs. empty - both opts, arr values", () => {
  equal(
    compare([" "], "", { hungryForWhitespace: true, matchStrictly: true }),
    true,
    "10"
  );
});

test("11 - array vs string", () => {
  equal(
    compare([" "], "", { hungryForWhitespace: true, matchStrictly: true }),
    true,
    "11"
  );
});

test("12 - array vs null", () => {
  equal(
    compare([" "], [null], { hungryForWhitespace: true, matchStrictly: true }),
    true,
    "12"
  );
});

test("13 - array vs bool", () => {
  equal(
    compare([" "], true, { hungryForWhitespace: true, matchStrictly: true }),
    false,
    "13"
  );
});

test("14", () => {
  equal(
    compare(false, true, { hungryForWhitespace: true, matchStrictly: true }),
    false,
    "14"
  );
});

test("15", () => {
  equal(
    compare([false], [true], {
      hungryForWhitespace: true,
      matchStrictly: true,
    }),
    true,
    "15"
  );
});

test.run();
