import { test } from "uvu";
import { equal } from "uvu/assert";

import { splitEasy } from "../dist/csv-split-easy.esm.js";

const cases = [
  {
    remove: false,
    pad: false,
    uk: false,
    dot: ["0.5", ".5", "00.5"],
    comma: ["0,5", ",5", "00,5"],
  },
  {
    remove: false,
    pad: false,
    uk: true,
    dot: ["0.5", ".5", "00.5"],
    comma: ["0.5", ".5", "00.5"],
  },
  {
    remove: false,
    pad: true,
    uk: false,
    dot: ["0.50", ".50", "00.50"],
    comma: ["0,50", ",50", "00,50"],
  },
  {
    remove: false,
    pad: true,
    uk: true,
    dot: ["0.50", ".50", "00.50"],
    comma: ["0.50", ".50", "00.50"],
  },
  {
    remove: true,
    pad: false,
    uk: false,
    dot: ["0.5", ".5", "00.5"],
    comma: ["0,5", ",5", "00,5"],
  },
  {
    remove: true,
    pad: false,
    uk: true,
    dot: ["0.5", ".5", "00.5"],
    comma: ["0.5", ".5", "00.5"],
  },
  {
    remove: true,
    pad: true,
    uk: false,
    dot: ["0.50", ".50", "00.50"],
    comma: ["0,50", ",50", "00,50"],
  },
  {
    remove: true,
    pad: true,
    uk: true,
    dot: ["0.50", ".50", "00.50"],
    comma: ["0.50", ".50", "00.50"],
  },
];

test("01 - unsigned dot fractions pad exactly one digit when requested", () => {
  for (const { remove, pad, uk, dot } of cases) {
    equal(
      splitEasy("item,0.5,.5,00.5", {
        removeThousandSeparatorsFromNumbers: remove,
        padSingleDecimalPlaceNumbers: pad,
        forceUKStyle: uk,
      }),
      [["item", ...dot]],
      "01.01",
    );
  }
});

test("02 - quoted fractions have the same padding and leading-zero spelling", () => {
  for (const { remove, pad, uk, dot } of cases) {
    equal(
      splitEasy('item,"0.5",".5","00.5"', {
        removeThousandSeparatorsFromNumbers: remove,
        padSingleDecimalPlaceNumbers: pad,
        forceUKStyle: uk,
      }),
      [["item", ...dot]],
      "02.01",
    );
  }
});

test("03 - comma fractions convert independently of padding and grouping", () => {
  for (const { remove, pad, uk, comma } of cases) {
    equal(
      splitEasy('plain;0,5;,5;00,5\nquoted;"0,5";",5";"00,5"', {
        delimiter: ";",
        removeThousandSeparatorsFromNumbers: remove,
        padSingleDecimalPlaceNumbers: pad,
        forceUKStyle: uk,
      }),
      [
        ["plain", ...comma],
        ["quoted", ...comma],
      ],
      "03.01",
    );
  }
});

test("04 - multiple fractional digits retain their magnitude and precision", () => {
  for (const { remove, pad, uk } of cases) {
    equal(
      splitEasy('item;0.075;".075";00.075;0,075;",075";00,075;0.05', {
        delimiter: ";",
        removeThousandSeparatorsFromNumbers: remove,
        padSingleDecimalPlaceNumbers: pad,
        forceUKStyle: uk,
      }),
      uk
        ? [
            [
              "item",
              "0.075",
              ".075",
              "00.075",
              "0.075",
              ".075",
              "00.075",
              "0.05",
            ],
          ]
        : [
            [
              "item",
              "0.075",
              ".075",
              "00.075",
              "0,075",
              ",075",
              "00,075",
              "0.05",
            ],
          ],
      "04.01",
    );
  }
});

test("05 - fractions below floating-point range retain every digit", () => {
  const digits = `${"0".repeat(350)}123456789`;
  const dot = `0.${digits}`;
  const comma = `0,${digits}`;
  const dotWithoutInteger = `.${digits}`;
  const commaWithoutInteger = `,${digits}`;

  for (const { remove, pad, uk } of cases) {
    equal(
      splitEasy(
        `item|${dot}|"${comma}"|"${dotWithoutInteger}"|${commaWithoutInteger}`,
        {
          delimiter: "|",
          removeThousandSeparatorsFromNumbers: remove,
          padSingleDecimalPlaceNumbers: pad,
          forceUKStyle: uk,
        },
      ),
      [
        [
          "item",
          dot,
          uk ? dot : comma,
          dotWithoutInteger,
          uk ? dotWithoutInteger : commaWithoutInteger,
        ],
      ],
      "05.01",
    );
  }
});

test("06 - padded fractions remain separate from empty fields and ordinary text", () => {
  equal(
    splitEasy(
      'kind;value;note\nfraction;"0.5";""\ntext;ordinary;tail\ninteger;2;done',
      {
        delimiter: ";",
      },
    ),
    [
      ["kind", "value", "note"],
      ["fraction", "0.50", ""],
      ["text", "ordinary", "tail"],
      ["integer", "2", "done"],
    ],
    "06.01",
  );
});

test.run();
