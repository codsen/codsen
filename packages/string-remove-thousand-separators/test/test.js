import tap from "tap";
import { remSep as r } from "../dist/string-remove-thousand-separators.esm";

// ==============================
// normal use cases
// ==============================

tap.test("01 - removes Swiss-style thousand separators, single quotes", (t) => {
  t.strictSame(r("1'000'000.00"), "1000000.00", "01.01 - normal");
  t.strictSame(
    r("1'000'000.2"),
    "1000000.20",
    "01.02 - one decimal place - padds to two decimal places (default)"
  );
  t.strictSame(
    r("1'000'000.2", { padSingleDecimalPlaceNumbers: false }),
    "1000000.2",
    "01.03 - one decimal place - does not pad to two decimal places (off)"
  );
  // but,
  t.strictSame(
    r("1'000'000.000"),
    "1'000'000.000",
    "01.04 - inconsistent thousand separators"
  );
  // ---------------------------------------------------------------------------
  // opts.removeThousandSeparatorsFromNumbers
  t.strictSame(
    r("1'000'000.00", { removeThousandSeparatorsFromNumbers: false }),
    "1'000'000.00",
    "01.05 - normal"
  );
  t.strictSame(
    r("1'000'000.2", { removeThousandSeparatorsFromNumbers: false }),
    "1'000'000.20",
    "01.06 - one decimal place - only padds to two decimal places (default)"
  );
  t.strictSame(
    r("1'000'000.2", {
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "1'000'000.2",
    "01.07 - one decimal place - does not pad to two decimal places (off)"
  );
  // but,
  t.strictSame(
    r("1'000'000.000", { removeThousandSeparatorsFromNumbers: false }),
    "1'000'000.000",
    "01.08 - inconsistent thousand separators - bails"
  );
  t.end();
});

tap.test("02 - removes Russian-style thousand separators, spaces", (t) => {
  t.strictSame(r("1 000 000.00"), "1000000.00", "02.01");
  t.strictSame(
    r("1 000 000.2"),
    "1000000.20",
    "02.02 - padds to two decimal places (default)"
  );
  t.strictSame(
    r("1 000 000.2", { padSingleDecimalPlaceNumbers: false }),
    "1000000.2",
    "02.03 - padds to two decimal places (off)"
  );
  // but,
  t.strictSame(
    r("1 000 000.000"),
    "1 000 000.000",
    "02.04 - inconsistent thousand separators - bail"
  );
  // ---------------------------------------------------------------------------
  // opts.removeThousandSeparatorsFromNumbers
  t.strictSame(
    r("1 000 000.00", { removeThousandSeparatorsFromNumbers: false }),
    "1 000 000.00",
    "02.05"
  );
  t.strictSame(
    r("1 000 000.2", { removeThousandSeparatorsFromNumbers: false }),
    "1 000 000.20",
    "02.06 - only padds to two decimal places (default)"
  );
  t.strictSame(
    r("1 000 000.2", {
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "1 000 000.2",
    "02.07 - basically everything's off."
  );
  // but,
  t.strictSame(
    r("1 000 000.000", { removeThousandSeparatorsFromNumbers: false }),
    "1 000 000.000",
    "02.08 - inconsistent thousand separators - bail"
  );
  t.end();
});

tap.test("03 - removes UK/US-style thousand separators, commas", (t) => {
  t.strictSame(r("1,000,000.00"), "1000000.00", "03.01");
  t.strictSame(
    r("1,000,000.2"),
    "1000000.20",
    "03.02 - padds to two decimal places (default)"
  );
  t.strictSame(
    r("1,000,000.2", { padSingleDecimalPlaceNumbers: false }),
    "1000000.2",
    "03.03 - padds to two decimal places (off)"
  );
  // but,
  t.strictSame(
    r("1,000,000.000"),
    "1,000,000.000",
    "03.04 - inconsistent thousand separators"
  );
  // ---------------------------------------------------------------------------
  // opts.removeThousandSeparatorsFromNumbers
  t.strictSame(
    r("1,000,000.00", { removeThousandSeparatorsFromNumbers: false }),
    "1,000,000.00",
    "03.05"
  );
  t.strictSame(
    r("1,000,000.2", { removeThousandSeparatorsFromNumbers: false }),
    "1,000,000.20",
    "03.06 - only padds to two decimal places (default)"
  );
  t.strictSame(
    r("1,000,000.2", {
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "1,000,000.2",
    "03.07 - does nothing, basically"
  );
  // but,
  t.strictSame(
    r("1,000,000.000", { removeThousandSeparatorsFromNumbers: false }),
    "1,000,000.000",
    "03.08 - bails because of inconsistent thousand separators"
  );
  t.end();
});

tap.test("04 - removes opposite-style thousand separators, commas", (t) => {
  t.strictSame(r("1.000.000,00"), "1000000,00", "04.01 - removes separators");
  t.strictSame(
    r("1.000.000,2"),
    "1000000,20",
    "04.02 - pads and removes separators"
  );
  t.strictSame(
    r("1.000.000,2", { padSingleDecimalPlaceNumbers: false }),
    "1000000,2",
    "04.03 - only removes separators, but does not pad because of opts"
  );
  // but,
  t.strictSame(
    r("1.000.000,000"),
    "1.000.000,000",
    "04.04 - bails when encounters inconsistent thousand separators"
  );
  // ---------------------------------------------------------------------------
  // opts.removeThousandSeparatorsFromNumbers
  t.strictSame(
    r("1.000.000,00", { removeThousandSeparatorsFromNumbers: false }),
    "1.000.000,00",
    "04.05 - does not remove separators because of the opts"
  );
  t.strictSame(
    r("1.000.000,2", { removeThousandSeparatorsFromNumbers: false }),
    "1.000.000,20",
    "04.06 - only pads because of opts defaults"
  );
  t.strictSame(
    r("1.000.000,2", {
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "1.000.000,2",
    "04.07 - neither removes separators not pads because opts turned off both"
  );
  // but,
  t.strictSame(
    r("1.000.000,000", { removeThousandSeparatorsFromNumbers: false }),
    "1.000.000,000",
    "04.08 - bails when encounters inconsistent thousand separators"
  );

  t.end();
});

// ==============================
// false-ones
// ==============================

tap.test("05 - false - includes some text characters", (t) => {
  t.strictSame(
    r("The price is 1,999.99"),
    "The price is 1,999.99",
    "05.01 - does nothing because there are letters"
  );
  t.strictSame(
    r("The price is 1,999.9", { padSingleDecimalPlaceNumbers: true }),
    "The price is 1,999.9",
    "05.02 - still does nothing because of letters"
  );
  t.strictSame(
    r("The price is 1,999.9", { padSingleDecimalPlaceNumbers: false }),
    "The price is 1,999.9",
    "05.03 - still does nothing because of letters"
  );
  t.strictSame(
    r("The price is 1,999.99", { removeThousandSeparatorsFromNumbers: true }),
    "The price is 1,999.99",
    "05.04 - still does nothing because of letters"
  );
  t.strictSame(
    r("The price is 1,999.99", { removeThousandSeparatorsFromNumbers: false }),
    "The price is 1,999.99",
    "05.05 - still does nothing because of letters"
  );
  t.strictSame(r("abc"), "abc", "05.06 - does not freak out if it's text-only");
  t.strictSame(r(""), "", "05.07 - does not freak out if it's empty-text-only");
  t.end();
});

tap.test("06 - false - mixed thousand separators, two dots one comma", (t) => {
  t.strictSame(r("1,000.000"), "1,000.000", "06.01");
  t.strictSame(r("1.000,000"), "1.000,000", "06.02");
  t.strictSame(r("1,000.000.000"), "1,000.000.000", "06.03");
  t.strictSame(r("1.000,000,000"), "1.000,000,000", "06.04");
  t.end();
});

tap.test("07 - false - few sneaky cases", (t) => {
  t.strictSame(
    r("1,a"),
    "1,a",
    "07.01 - the first char after thousands separator is wrong"
  );
  t.strictSame(
    r("1,0a"),
    "1,0a",
    "07.02 - the second char after thousands separator is wrong"
  );
  t.strictSame(
    r("1,01a"),
    "1,01a",
    "07.03 - the third char after thousands separator is wrong"
  );
  t.strictSame(r(",,,"), ",,,", "07.04 - does nothing");
  t.strictSame(r("..."), "...", "07.05 - does nothing");
  t.strictSame(r("'''"), "'''", "07.06 - does nothing");
  t.strictSame(r("1,00000"), "1,00000", "07.07");
  t.strictSame(r("a,b"), "a,b", "07.08");
  t.end();
});

tap.test("08 - trims", (t) => {
  t.strictSame(r('"100,000.01"'), "100000.01", "08.01 - trims double quotes");
  t.strictSame(
    r("100,00:0.01"),
    "100,00:0.01",
    "08.02 - unrecognised (colon) character - bails (trims double quotes anyway)"
  );
  t.strictSame(
    r("    100,000.01  \n  "),
    "100000.01",
    "08.03 - trims whitespace quotes"
  );
  t.strictSame(
    r("    100,0zzzz00.01  \n  "),
    "100,0zzzz00.01",
    "08.04 - still trims before bails"
  );

  t.end();
});

// ==============================
// opts.forceUKStyle
// ==============================

tap.test("09 - converts Russian-style notation into UK-one", (t) => {
  // defaults
  t.strictSame(r("1,5"), "1,50", "09.01 - one decimal place");
  t.strictSame(
    r("1,5", { padSingleDecimalPlaceNumbers: false }),
    "1,5",
    "09.02 - one decimal place"
  );
  t.strictSame(r("1,51"), "1,51", "09.03 - two decimal places");
  t.strictSame(
    r("1,510"),
    "1510",
    "09.04 - this is actually thousands separator"
  );
  t.strictSame(
    r("100 000 000,9"),
    "100000000,90",
    "09.05 - includes thousand separators, one decimal place"
  );
  t.strictSame(
    r("100 000 000,9", { padSingleDecimalPlaceNumbers: false }),
    "100000000,9",
    "09.06 - includes thousand separators, one decimal place"
  );
  t.strictSame(
    r("100 000 000,99"),
    "100000000,99",
    "09.07 - includes thousand separators, two decimal places"
  );
  // opts.forceUKStyle = true
  t.strictSame(
    r("1,5", { forceUKStyle: true }),
    "1.50",
    "09.08 - one decimal place"
  );
  t.strictSame(
    r("1,5", { forceUKStyle: true, padSingleDecimalPlaceNumbers: false }),
    "1.5",
    "09.09 - one decimal place"
  );
  t.strictSame(
    r("1,51", { forceUKStyle: true }),
    "1.51",
    "09.10 - two decimal places"
  );
  t.strictSame(
    r("1,510", { forceUKStyle: true }),
    "1510",
    "09.11 - this is actually thousands separator"
  );
  t.strictSame(
    r("100 000 000,9", { forceUKStyle: true }),
    "100000000.90",
    "09.12 - includes thousand separators, one decimal place"
  );
  t.strictSame(
    r("100 000 000,9", {
      forceUKStyle: true,
      padSingleDecimalPlaceNumbers: false,
    }),
    "100000000.9",
    "09.13 - includes thousand separators, one decimal place"
  );
  t.strictSame(
    r("100 000 000,99", { forceUKStyle: true }),
    "100000000.99",
    "09.14 - includes thousand separators, two decimal places"
  );
  // in tandem with opts.removeThousandSeparatorsFromNumbers
  t.strictSame(
    r("100 000 000,9", {
      forceUKStyle: true,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "100 000 000.90",
    "09.15 - forces style, padding kicks in by default but does not remove thousand separators, just as explicitly requested"
  );
  t.strictSame(
    r("100 000 000,9", {
      forceUKStyle: true,
      padSingleDecimalPlaceNumbers: false,
      removeThousandSeparatorsFromNumbers: false,
    }),
    "100 000 000.9",
    "09.16 - forces style but does nothing else (padding or thousand separator removal)"
  );
  t.end();
});

// ==============================
// throws
// ==============================

tap.test("10 - throws when the inputs are missing", (t) => {
  t.throws(() => {
    r();
  }, /THROW_ID_01/g);
  t.doesNotThrow(() => {
    r("");
  }, "10.02");
  t.doesNotThrow(() => {
    r("123"); // nothing to do
  }, "10.03");
  t.end();
});

tap.test("11 - throws when first arg is not string", (t) => {
  t.throws(() => {
    r(null);
  }, /THROW_ID_01/g);
  t.throws(() => {
    r(true);
  }, /THROW_ID_01/g);
  t.throws(() => {
    r(undefined);
  }, /THROW_ID_01/g);
  t.throws(() => {
    r(1);
  }, /THROW_ID_01/g);
  t.throws(() => {
    r(NaN);
  }, /THROW_ID_01/g);
  t.end();
});

tap.test("12 - throws when second arg is not a plain object", (t) => {
  t.doesNotThrow(() => {
    r("aaa", {});
  }, "12.01");
  t.throws(() => {
    r("aaa", "aaa");
  }, /THROW_ID_02/g);
  t.throws(() => {
    r("aaa", 1);
  }, /THROW_ID_02/g);
  t.throws(() => {
    r("aaa", true);
  }, /THROW_ID_02/g);
  t.end();
});
