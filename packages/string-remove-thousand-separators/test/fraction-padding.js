import { test } from "uvu";
import { equal } from "uvu/assert";

import { remSep } from "../dist/string-remove-thousand-separators.esm.js";

test("01 - single-digit fractions honor padding independently of grouping", () => {
  for (const [input, padded] of [
    ["0.5", "0.50"],
    [".5", ".50"],
    ["00.5", "00.50"],
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
            padSingleDecimalPlaceNumbers ? padded : input,
            "01.01",
          );
        }
      }
    }
  }
});

test("02 - single-digit comma fractions convert and pad independently", () => {
  for (const [input, expected] of [
    ["0,5", ["0,5", "0.5", "0,50", "0.50"]],
    [",5", [",5", ".5", ",50", ".50"]],
    ["00,5", ["00,5", "00.5", "00,50", "00.50"]],
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
              (padSingleDecimalPlaceNumbers ? 2 : 0) + (forceUKStyle ? 1 : 0)
            ],
            "02.01",
          );
        }
      }
    }
  }
});

test("03 - every fractional digit survives grouping and decimal conversion", () => {
  for (const [input, converted] of [
    ["0.05", "0.05"],
    ["0.075", "0.075"],
    [".075", ".075"],
    ["00.0050", "00.0050"],
    ["0,05", "0.05"],
    ["0,075", "0.075"],
    [",075", ".075"],
    ["00,0050", "00.0050"],
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
            "03.01",
          );
        }
      }
    }
  }
});

test("04 - fractions smaller than numeric precision retain their digits", () => {
  const digits = `${"0".repeat(350)}1`;
  for (const separator of [".", ","]) {
    for (const removeThousandSeparatorsFromNumbers of [false, true]) {
      for (const padSingleDecimalPlaceNumbers of [false, true]) {
        for (const forceUKStyle of [false, true]) {
          equal(
            remSep(`0${separator}${digits}`, {
              removeThousandSeparatorsFromNumbers,
              padSingleDecimalPlaceNumbers,
              forceUKStyle,
            }),
            `0${forceUKStyle ? "." : separator}${digits}`,
            "04.01",
          );
        }
      }
    }
  }
});

test("05 - recognized fractions use the existing whitespace and quote cleanup", () => {
  equal(remSep("  0.5  "), "0.50", "05.01");
  equal(remSep('  "0.5"  '), "0.50", "05.02");
  equal(remSep('  ".075"  '), ".075", "05.03");
  equal(remSep('  "0,075"  ', { forceUKStyle: true }), "0.075", "05.04");
  equal(
    remSep('  "0.5"  ', { padSingleDecimalPlaceNumbers: false }),
    "0.5",
    "05.05",
  );
});

test("06 - nonpositive nondecimal and malformed controls retain their behavior", () => {
  for (const input of ["-0.5", "+0.5", "5e-1", "  +0.5  ", "0.5x", "0.5.5"]) {
    equal(remSep(input), input, "06.01");
  }
  equal(remSep("0.0"), "0.00", "06.02");
  equal(remSep("0.00"), "0.00", "06.03");
  equal(remSep('"0.5\n"'), "0.5\n", "06.04");
  equal(remSep("1.5"), "1.50", "06.05");
  equal(remSep("1,000.5"), "1000.50", "06.06");
  equal(remSep("."), ".", "06.07");
  equal(remSep("0."), "0.", "06.08");
  equal(remSep("0.5/"), "0.5/", "06.09");
});

test.run();
