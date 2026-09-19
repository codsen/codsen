import { test } from "uvu";
import { equal } from "uvu/assert";

import { compare } from "../dist/ast-compare.esm.js";

// loose mode
// -----------------------------------------------------------------------------

test("01 - hungryForWhitespace, empty strings within arrays", () => {
  equal(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        type: "rule",
        selectors: [],
      },
    ),
    false,
    "01.01",
  );
  equal(
    compare(
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        type: "rule",
        selectors: [],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    true,
    "01.02",
  );
  equal(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
    ),
    false,
    "01.03",
  );
  equal(
    compare(
      {
        type: "rule",
        selectors: [],
      },
      {
        type: "rule",
        selectors: ["   ", "\n\n\n", "\t\t\t   \t\t\n\n"],
      },
      {
        hungryForWhitespace: true,
      },
    ),
    true,
    "01.04",
  );
});

// Preserve the supported whitespace/subset use cases of ast-loose-compare.
// These assertions describe compare's contract, including intentional differences.
// Do not import the retiring package or use its results as the expected values.

test("02 - nested whitespace shapes match within meaningful object subsets", () => {
  const first = { a: "a", b: [[["\n \n\n"]]], c: "c" };
  const second = { a: "a", b: { c: { d: "   \t\t \t" } } };
  const options = { hungryForWhitespace: true };

  equal(compare(first, second, options), true, "02.01");
  equal(compare(first, second), false, "02.02");
  equal(compare(second, first, options), false, "02.03");
  equal(compare({ ...first, a: "different" }, second, options), false, "02.04");
  equal(
    compare({ ...first, b: [[["visible"]]] }, second, options),
    false,
    "02.05",
  );
});

test("03 - wholly whitespace objects can have different keys", () => {
  const options = { hungryForWhitespace: true };

  equal(compare({ a: " " }, { b: "\n" }, options), true, "03.01");
  equal(
    compare({ a: " ", marker: "kept" }, { b: "\n" }, options),
    false,
    "03.02",
  );
  equal(
    compare({ a: " ", b: "\n", marker: "kept" }, { b: "\n" }, options),
    true,
    "03.03",
  );
});

test("04 - whitespace array matches preserve order and consume each item once", () => {
  const first = ["prefix", " ", "gap", "end"];
  const options = { hungryForWhitespace: true };

  equal(compare(first, ["\n", "end"], options), true, "04.01");
  equal(compare(first, ["end", "\n"], options), false, "04.02");
  equal(compare(first, ["\n", "\t"], options), false, "04.03");
});

test("05 - a whitespace match does not skip later array mismatches", () => {
  const options = { hungryForWhitespace: true };

  equal(
    compare([" ", "different"], ["\n", "expected"], options),
    false,
    "05.01",
  );
  equal(compare([" ", "expected"], ["\n", "expected"], options), true, "05.02");
  equal(
    compare(
      { content: [" ", "different"] },
      { content: ["\n", "expected"] },
      options,
    ),
    false,
    "05.03",
  );
});

test("06 - an undefined pattern value still requires its own key", () => {
  const options = { hungryForWhitespace: true };

  equal(compare({ a: 1 }, { b: undefined }, options), false, "06.01");
  equal(compare({ b: undefined }, { b: undefined }, options), true, "06.02");
  equal(compare({ a: 1 }, { b: null }, options), false, "06.03");
  equal(compare({ b: null }, { b: null }, options), true, "06.04");
  equal(compare({ b: undefined }, { b: null }, options), false, "06.05");
});

test("07 - explicit primitive and nullish operands retain value equality", () => {
  const options = { hungryForWhitespace: true };
  const values = [0, 1, false, true, null, undefined];

  equal(
    values.map((value) => compare(value, value, options)),
    [true, true, true, true, true, true],
    "07.01",
  );
  equal(
    [
      [0, false],
      [1, true],
      [null, undefined],
      [undefined, null],
      [undefined, { a: "a" }],
      [null, ""],
    ].map(([first, second]) => compare(first, second, options)),
    [false, false, false, false, false, false],
    "07.02",
  );
});

test.run();
