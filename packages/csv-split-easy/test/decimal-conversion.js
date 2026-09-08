import { test } from "uvu";
import { equal } from "uvu/assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

const cases = [
  {
    remove: false,
    pad: false,
    uk: false,
    plain: ["12,3", "12,34"],
    spaces: ["1 234,5", "1 234,50"],
    apostrophes: ["1'234,5", "1'234,50"],
  },
  {
    remove: false,
    pad: false,
    uk: true,
    plain: ["12.3", "12.34"],
    spaces: ["1 234.5", "1 234.50"],
    apostrophes: ["1'234.5", "1'234.50"],
  },
  {
    remove: false,
    pad: true,
    uk: false,
    plain: ["12,30", "12,34"],
    spaces: ["1 234,50", "1 234,50"],
    apostrophes: ["1'234,50", "1'234,50"],
  },
  {
    remove: false,
    pad: true,
    uk: true,
    plain: ["12.30", "12.34"],
    spaces: ["1 234.50", "1 234.50"],
    apostrophes: ["1'234.50", "1'234.50"],
  },
  {
    remove: true,
    pad: false,
    uk: false,
    plain: ["12,3", "12,34"],
    spaces: ["1234,5", "1234,50"],
    apostrophes: ["1234,5", "1234,50"],
  },
  {
    remove: true,
    pad: false,
    uk: true,
    plain: ["12.3", "12.34"],
    spaces: ["1234.5", "1234.50"],
    apostrophes: ["1234.5", "1234.50"],
  },
  {
    remove: true,
    pad: true,
    uk: false,
    plain: ["12,30", "12,34"],
    spaces: ["1234,50", "1234,50"],
    apostrophes: ["1234,50", "1234,50"],
  },
  {
    remove: true,
    pad: true,
    uk: true,
    plain: ["12.30", "12.34"],
    spaces: ["1234.50", "1234.50"],
    apostrophes: ["1234.50", "1234.50"],
  },
];

test("01 - decimal conversion and padding are independent of grouping removal", () => {
  for (const { remove, pad, uk, plain } of cases) {
    equal(
      splitEasy('plain;12,3;12,34\nquoted;"12,3";"12,34"', {
        delimiter: ";",
        removeThousandSeparatorsFromNumbers: remove,
        padSingleDecimalPlaceNumbers: pad,
        forceUKStyle: uk,
      }),
      [
        ["plain", ...plain],
        ["quoted", ...plain],
      ],
      "01.01",
    );
  }
});

test("02 - decimal conversion preserves space grouping when requested", () => {
  for (const { remove, pad, uk, spaces } of cases) {
    equal(
      splitEasy('plain;1 234,5;1 234,50\nquoted;"1 234,5";"1 234,50"', {
        delimiter: ";",
        removeThousandSeparatorsFromNumbers: remove,
        padSingleDecimalPlaceNumbers: pad,
        forceUKStyle: uk,
      }),
      [
        ["plain", ...spaces],
        ["quoted", ...spaces],
      ],
      "02.01",
    );
  }
});

test("03 - decimal conversion preserves apostrophe grouping when requested", () => {
  for (const { remove, pad, uk, apostrophes } of cases) {
    equal(
      splitEasy(`plain|1'234,5|1'234,50\nquoted|"1'234,5"|"1'234,50"`, {
        delimiter: "|",
        removeThousandSeparatorsFromNumbers: remove,
        padSingleDecimalPlaceNumbers: pad,
        forceUKStyle: uk,
      }),
      [
        ["plain", ...apostrophes],
        ["quoted", ...apostrophes],
      ],
      "03.01",
    );
  }
});

test("04 - retained grouping and decimal conversion compose across mixed rows", () => {
  equal(
    splitEasy('item;"1 234,50"\nnext;12,3\nlast;"1\'234,50"', {
      delimiter: ";",
      removeThousandSeparatorsFromNumbers: false,
      forceUKStyle: true,
    }),
    [
      ["item", "1 234.50"],
      ["next", "12.30"],
      ["last", "1'234.50"],
    ],
    "04.01",
  );
});

test.run();
