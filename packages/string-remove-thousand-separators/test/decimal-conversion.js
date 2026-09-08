import { test } from "uvu";
import { equal } from "uvu/assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

test("01 - two-decimal commas convert independently of grouping and padding", () => {
  for (const [input, converted] of [
    ["1,50", "1.50"],
    ["12,34", "12.34"],
    ["100,01", "100.01"],
  ]) {
    for (const removeThousandSeparatorsFromNumbers of [false, true]) {
      for (const padSingleDecimalPlaceNumbers of [false, true]) {
        for (const forceUKStyle of [false, true]) {
          equal(
            remSep(input, {
              removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers,
              forceUKStyle,
            }),
            forceUKStyle ? converted : input,
            "01.01",
          );
        }
      }
    }
  }
});

test("02 - space grouping is preserved or removed independently of decimal conversion", () => {
  for (const [input, expected] of [
    ["1 234,50", ["1 234,50", "1 234.50", "1234,50", "1234.50"]],
    [
      "100 000 000,99",
      ["100 000 000,99", "100 000 000.99", "100000000,99", "100000000.99"],
    ],
  ]) {
    for (const removeThousandSeparatorsFromNumbers of [false, true]) {
      for (const padSingleDecimalPlaceNumbers of [false, true]) {
        for (const forceUKStyle of [false, true]) {
          equal(
            remSep(input, {
              removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers,
              forceUKStyle,
            }),
            expected[
              (removeThousandSeparatorsFromNumbers ? 2 : 0) +
                (forceUKStyle ? 1 : 0)
            ],
            "02.01",
          );
        }
      }
    }
  }
});

test("03 - apostrophe and dot grouping do not control decimal conversion", () => {
  for (const [input, expected] of [
    ["1'234,50", ["1'234,50", "1'234.50", "1234,50", "1234.50"]],
    ["1.234,50", ["1.234,50", "1.234.50", "1234,50", "1234.50"]],
  ]) {
    for (const removeThousandSeparatorsFromNumbers of [false, true]) {
      for (const padSingleDecimalPlaceNumbers of [false, true]) {
        for (const forceUKStyle of [false, true]) {
          equal(
            remSep(input, {
              removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers,
              forceUKStyle,
            }),
            expected[
              (removeThousandSeparatorsFromNumbers ? 2 : 0) +
                (forceUKStyle ? 1 : 0)
            ],
            "03.01",
          );
        }
      }
    }
  }
});

test("04 - one-decimal conversion keeps its independent padding behavior", () => {
  for (const [input, retained, ungrouped] of [
    ["1,5", "1", "1"],
    ["1 234,5", "1 234", "1234"],
    ["1'234,5", "1'234", "1234"],
  ]) {
    for (const removeThousandSeparatorsFromNumbers of [false, true]) {
      for (const padSingleDecimalPlaceNumbers of [false, true]) {
        for (const forceUKStyle of [false, true]) {
          equal(
            remSep(input, {
              removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers,
              forceUKStyle,
            }),
            `${removeThousandSeparatorsFromNumbers ? ungrouped : retained}${forceUKStyle ? "." : ","}${padSingleDecimalPlaceNumbers ? "50" : "5"}`,
            "04.01",
          );
        }
      }
    }
  }
});

test("05 - trimming wrapping quotes and invalid-number controls remain unchanged", () => {
  const opts = {
    removeThousandSeparatorsFromNumbers: false,
    forceUKStyle: true,
  };
  equal(remSep('  "1 234,50"  ', opts), "1 234.50", "05.01");
  equal(remSep("  amount 12,34  ", opts), "amount 12,34", "05.02");
  equal(remSep("1 234.567,89", opts), "1 234.567,89", "05.03");
  equal(remSep("12.34", opts), "12.34", "05.04");
  equal(remSep("12,34"), "12,34", "05.05");
});

test.run();
