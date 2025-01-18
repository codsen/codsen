import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { remSep as r } from "../dist/string-remove-thousand-separators.esm.js";

// ==============================
// normal use cases
// ==============================

test("01 - removes Swiss-style thousand separators, single quotes", () => {
  equal(r("1'000'000.00"), "1000000.00", "01.01");
  equal(r("1'000'000.2"), "1000000.20", "01.02");
  equal(
    r("1'000'000.2", { padSingleDecimalPlaceNumbers: false }),
    "1000000.2",
    "01.03",
  );
  // but,
  equal(r("1'000'000.000"), "1'000'000.000", "01.04");
  // ---------------------------------------------------------------------------
  // opts.removeThousandSeparatorsFromNumbers
  equal(
    r("1'000'000.00", { removeThousandSeparatorsFromNumbers: false }),
    "1'000'000.00",
    "01.05",
  );
  equal(
    r("1'000'000.2", { removeThousandSeparatorsFromNumbers: false }),
    "1'000'000.20",
    "01.06",
  );
  equal(
    r("1'000'000.2", {
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "1'000'000.2",
    "01.07",
  );
  // but,
  equal(
    r("1'000'000.000", { removeThousandSeparatorsFromNumbers: false }),
    "1'000'000.000",
    "01.08",
  );
});

test("02 - removes Russian-style thousand separators, spaces", () => {
  equal(r("1 000 000.00"), "1000000.00", "02.01");
  equal(r("1 000 000.2"), "1000000.20", "02.02");
  equal(
    r("1 000 000.2", { padSingleDecimalPlaceNumbers: false }),
    "1000000.2",
    "02.03",
  );
  // but,
  equal(r("1 000 000.000"), "1 000 000.000", "02.04");
  // ---------------------------------------------------------------------------
  // opts.removeThousandSeparatorsFromNumbers
  equal(
    r("1 000 000.00", { removeThousandSeparatorsFromNumbers: false }),
    "1 000 000.00",
    "02.05",
  );
  equal(
    r("1 000 000.2", { removeThousandSeparatorsFromNumbers: false }),
    "1 000 000.20",
    "02.06",
  );
  equal(
    r("1 000 000.2", {
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "1 000 000.2",
    "02.07",
  );
  // but,
  equal(
    r("1 000 000.000", { removeThousandSeparatorsFromNumbers: false }),
    "1 000 000.000",
    "02.08",
  );
});

test("03 - removes UK/US-style thousand separators, commas", () => {
  equal(r("1,000,000.00"), "1000000.00", "03.01");
  equal(r("1,000,000.2"), "1000000.20", "03.02");
  equal(
    r("1,000,000.2", { padSingleDecimalPlaceNumbers: false }),
    "1000000.2",
    "03.03",
  );
  // but,
  equal(r("1,000,000.000"), "1,000,000.000", "03.04");
  // ---------------------------------------------------------------------------
  // opts.removeThousandSeparatorsFromNumbers
  equal(
    r("1,000,000.00", { removeThousandSeparatorsFromNumbers: false }),
    "1,000,000.00",
    "03.05",
  );
  equal(
    r("1,000,000.2", { removeThousandSeparatorsFromNumbers: false }),
    "1,000,000.20",
    "03.06",
  );
  equal(
    r("1,000,000.2", {
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "1,000,000.2",
    "03.07",
  );
  // but,
  equal(
    r("1,000,000.000", { removeThousandSeparatorsFromNumbers: false }),
    "1,000,000.000",
    "03.08",
  );
});

test("04 - removes opposite-style thousand separators, commas", () => {
  equal(r("1.000.000,00"), "1000000,00", "04.01");
  equal(r("1.000.000,2"), "1000000,20", "04.02");
  equal(
    r("1.000.000,2", { padSingleDecimalPlaceNumbers: false }),
    "1000000,2",
    "04.03",
  );
  // but,
  equal(r("1.000.000,000"), "1.000.000,000", "04.04");
  // ---------------------------------------------------------------------------
  // opts.removeThousandSeparatorsFromNumbers
  equal(
    r("1.000.000,00", { removeThousandSeparatorsFromNumbers: false }),
    "1.000.000,00",
    "04.05",
  );
  equal(
    r("1.000.000,2", { removeThousandSeparatorsFromNumbers: false }),
    "1.000.000,20",
    "04.06",
  );
  equal(
    r("1.000.000,2", {
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "1.000.000,2",
    "04.07",
  );
  // but,
  equal(
    r("1.000.000,000", { removeThousandSeparatorsFromNumbers: false }),
    "1.000.000,000",
    "04.08",
  );
});

// ==============================
// false-ones
// ==============================

test("05 - false - includes some text characters", () => {
  equal(r("The price is 1,999.99"), "The price is 1,999.99", "05.01");
  equal(
    r("The price is 1,999.9", { padSingleDecimalPlaceNumbers: true }),
    "The price is 1,999.9",
    "05.02",
  );
  equal(
    r("The price is 1,999.9", { padSingleDecimalPlaceNumbers: false }),
    "The price is 1,999.9",
    "05.03",
  );
  equal(
    r("The price is 1,999.99", { removeThousandSeparatorsFromNumbers: true }),
    "The price is 1,999.99",
    "05.04",
  );
  equal(
    r("The price is 1,999.99", { removeThousandSeparatorsFromNumbers: false }),
    "The price is 1,999.99",
    "05.05",
  );
  equal(r("abc"), "abc", "05.06");
  equal(r(""), "", "05.07");
});

test("06 - false - mixed thousand separators, two dots one comma", () => {
  equal(r("1,000.000"), "1,000.000", "06.01");
  equal(r("1.000,000"), "1.000,000", "06.02");
  equal(r("1,000.000.000"), "1,000.000.000", "06.03");
  equal(r("1.000,000,000"), "1.000,000,000", "06.04");
});

test("07 - false - few sneaky cases", () => {
  equal(r("1,a"), "1,a", "07.01");
  equal(r("1,0a"), "1,0a", "07.02");
  equal(r("1,01a"), "1,01a", "07.03");
  equal(r(",,,"), ",,,", "07.04");
  equal(r("..."), "...", "07.05");
  equal(r("'''"), "'''", "07.06");
  equal(r("1,00000"), "1,00000", "07.07");
  equal(r("a,b"), "a,b", "07.08");
});

test("08 - trims", () => {
  equal(r('"100,000.01"'), "100000.01", "08.01");
  equal(r("100,00:0.01"), "100,00:0.01", "08.02");
  equal(r("    100,000.01  \n  "), "100000.01", "08.03");
  equal(r("    100,0zzzz00.01  \n  "), "100,0zzzz00.01", "08.04");
});

// ==============================
// opts.forceUKStyle
// ==============================

test("09 - converts Russian-style notation into UK-one", () => {
  // defaults
  equal(r("1,5"), "1,50", "09.01");
  equal(r("1,5", { padSingleDecimalPlaceNumbers: false }), "1,5", "09.02");
  equal(r("1,51"), "1,51", "09.03");
  equal(r("1,510"), "1510", "09.04");
  equal(r("100 000 000,9"), "100000000,90", "09.05");
  equal(
    r("100 000 000,9", { padSingleDecimalPlaceNumbers: false }),
    "100000000,9",
    "09.06",
  );
  equal(r("100 000 000,99"), "100000000,99", "09.07");
  // opts.forceUKStyle = true
  equal(r("1,5", { forceUKStyle: true }), "1.50", "09.08");
  equal(
    r("1,5", { forceUKStyle: true, padSingleDecimalPlaceNumbers: false }),
    "1.5",
    "09.09",
  );
  equal(r("1,51", { forceUKStyle: true }), "1.51", "09.10");
  equal(r("1,510", { forceUKStyle: true }), "1510", "09.11");
  equal(r("100 000 000,9", { forceUKStyle: true }), "100000000.90", "09.12");
  equal(
    r("100 000 000,9", {
      forceUKStyle: true,
      padSingleDecimalPlaceNumbers: false,
    }),
    "100000000.9",
    "09.13",
  );
  equal(r("100 000 000,99", { forceUKStyle: true }), "100000000.99", "09.14");
  // in tandem with opts.removeThousandSeparatorsFromNumbers
  equal(
    r("100 000 000,9", {
      forceUKStyle: true,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "100 000 000.90",
    "09.15",
  );
  equal(
    r("100 000 000,9", {
      forceUKStyle: true,
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "100 000 000.9",
    "09.16",
  );
});

// ==============================
// throws
// ==============================

test("10 - throws when the inputs are missing", () => {
  throws(
    () => {
      r();
    },
    /THROW_ID_01/g,
    "10.01",
  );
  not.throws(() => {
    r("");
  }, "10.02");
  not.throws(() => {
    r("123"); // nothing to do
  }, "10.03");
});

test("11 - throws when first arg is not string", () => {
  throws(
    () => {
      r(null);
    },
    /THROW_ID_01/g,
    "11.01",
  );
  throws(
    () => {
      r(true);
    },
    /THROW_ID_01/g,
    "11.02",
  );
  throws(
    () => {
      r(undefined);
    },
    /THROW_ID_01/g,
    "11.03",
  );
  throws(
    () => {
      r(1);
    },
    /THROW_ID_01/g,
    "11.04",
  );
  throws(
    () => {
      r(NaN);
    },
    /THROW_ID_01/g,
    "11.05",
  );
});

test("12 - throws when second arg is not a plain object", () => {
  not.throws(() => {
    r("aaa", {});
  }, "12.01");
  throws(
    () => {
      r("aaa", "aaa");
    },
    /THROW_ID_02/g,
    "12.01",
  );
  throws(
    () => {
      r("aaa", 1);
    },
    /THROW_ID_02/g,
    "12.02",
  );
  throws(
    () => {
      r("aaa", true);
    },
    /THROW_ID_02/g,
    "12.03",
  );
});

test.run();
