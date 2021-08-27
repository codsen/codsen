import tap from "tap";
import { within } from "../dist/email-all-chars-within-ascii.esm.js";

const ETX = String.fromCodePoint(3); // #003
const CAPITALOWITHSTROKE = `\u00D8`; // #216
const SMALLOWITHDIAERESIS = `\u00F6`; // #246
const NONEXISTING = String.fromCodePoint(896); // #003

tap.test("01 - empty", (t) => {
  t.sameStrict(within(""), [], "01");
  t.end();
});

tap.test("02 - legit set of chars", (t) => {
  t.sameStrict(within("the quick brown fox"), [], "02");
  t.end();
});

tap.test("03 - legit, line breaks", (t) => {
  t.sameStrict(within("the quick\rbrown\r\nfox\njumps over"), [], "03");
  t.end();
});

tap.test("04 - illegal", (t) => {
  t.sameStrict(
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
    "04"
  );
  t.end();
});

tap.test("05 - multi-line illegal", (t) => {
  t.sameStrict(
    within(
      `My friend ${CAPITALOWITHSTROKE}rjan\nlikes Mot${SMALLOWITHDIAERESIS}rhead!`
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
    "05"
  );
  t.end();
});

tap.test("06 - illegal low ASCII, ETX", (t) => {
  t.sameStrict(
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
    "06"
  );
  t.end();
});

// https://unicode-table.com/en/#0380
tap.test("07 - non-existent outside ASCII, #896 or u0380", (t) => {
  t.sameStrict(
    within(`a\u0380b`),
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
    "07"
  );
  t.end();
});
