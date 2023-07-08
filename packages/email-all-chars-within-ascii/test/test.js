import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { within } from "../dist/email-all-chars-within-ascii.esm.js";

const ETX = String.fromCodePoint(3); // #003
const CAPITALOWITHSTROKE = "\u00D8"; // #216
const SMALLOWITHDIAERESIS = "\u00F6"; // #246
const NONEXISTING = String.fromCodePoint(896); // #003

test("01 - empty", () => {
  equal(within(""), [], "01.01");
});

test("02 - legit set of chars", () => {
  equal(within("the quick brown fox"), [], "02.01");
});

test("03 - legit, line breaks", () => {
  equal(within("the quick\rbrown\r\nfox\njumps over"), [], "03.01");
});

test("04 - illegal", () => {
  equal(
    within("Motörhead"),
    [
      {
        type: "character",
        line: 1,
        column: 4,
        positionIdx: 3,
        value: "ö",
        codePoint: 246,
        UTF32Hex: "00f6",
      },
    ],
    "04.01",
  );
});

test("05 - multi-line illegal", () => {
  equal(
    within(
      `My friend ${CAPITALOWITHSTROKE}rjan\nlikes Mot${SMALLOWITHDIAERESIS}rhead!`,
    ),
    [
      {
        type: "character",
        line: 1,
        column: 11,
        positionIdx: 10,
        value: CAPITALOWITHSTROKE,
        codePoint: 216,
        UTF32Hex: "00d8",
      },
      {
        type: "character",
        line: 2,
        column: 10,
        positionIdx: 25,
        value: SMALLOWITHDIAERESIS,
        codePoint: 246,
        UTF32Hex: "00f6",
      },
    ],
    "05.01",
  );
});

test("06 - illegal low ASCII, ETX", () => {
  equal(
    within(`a${ETX}b`),
    [
      {
        type: "character",
        line: 1,
        column: 2,
        positionIdx: 1,
        value: ETX,
        codePoint: 3,
        UTF32Hex: "0003",
      },
    ],
    "06.01",
  );
});

// https://unicode-table.com/en/#0380
test("07 - non-existent outside ASCII, #896 or u0380", () => {
  equal(
    within("a\u0380b"),
    [
      {
        type: "character",
        line: 1,
        column: 2,
        positionIdx: 1,
        value: NONEXISTING,
        codePoint: 896,
        UTF32Hex: "0380",
      },
    ],
    "07.01",
  );
});

test.run();
