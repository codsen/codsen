import { test } from "uvu";
import { equal } from "uvu/assert";

import { expander } from "../dist/string-range-expander.esm.js";

test("01 - prevents concatenation across Unicode letter and number categories", () => {
  const fixtures = [
    "a a",
    "é é",
    "你 你",
    "١ ١",
    "१ १",
    "Ⅻ Ⅻ",
    "𐐀 𐐀",
  ];
  const expectedRanges = [
    [1, 2, " "],
    [1, 2, " "],
    [1, 2, " "],
    [1, 2, " "],
    [1, 2, " "],
    [1, 2, " "],
    [2, 3, " "],
  ];

  fixtures.forEach((str, index) => {
    const from = str.indexOf(" ");
    equal(
      expander({
        str,
        from,
        to: from + 1,
        addSingleSpaceToPreventAccidentalConcatenation: true,
      }),
      expectedRanges[index],
      `01.${String(index + 1).padStart(2, "0")}`,
    );
  });
});

test("02 - retains punctuation, symbol, and string-edge behavior", () => {
  equal(
    expander({
      str: "! ?",
      from: 1,
      to: 2,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [1, 2],
    "02.01",
  );
  equal(
    expander({
      str: "😀 😀",
      from: 2,
      to: 3,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 3],
    "02.02",
  );
  equal(
    expander({
      str: "a !",
      from: 1,
      to: 2,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [1, 2, " "],
    "02.03",
  );
  equal(
    expander({
      str: "a",
      from: 0,
      to: 0,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [0, 0],
    "02.04",
  );
});

test.run();
