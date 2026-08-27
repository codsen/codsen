// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { expander as e } from "../dist/string-range-expander.esm.js";

// -----------------------------------------------------------------------------

test("01 - combo with tight crop", () => {
  equal(
    e({
      str: "something>\n\t    zzzz <here",
      from: 16,
      to: 20,
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [10, 21],
    "01.01",
  );
  equal(
    e({
      str: "something>\n\t    zzzz <here",
      from: 16,
      to: 20,
      ifLeftSideIncludesThisCropItToo: "\n\t",
    }),
    [10, 20],
    "01.02",
  );
  equal(
    e({
      str: "something>\n\t    zzzz <here",
      from: 16,
      to: 20,
      ifLeftSideIncludesThisCropItToo: "\n\t",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [10, 21],
    "01.03",
  );
  equal(
    e({
      str: "something> a    zzzz <here",
      from: 16,
      to: 20,
      ifRightSideIncludesThisThenCropTightly: "<",
      ifLeftSideIncludesThisThenCropTightly: ">",
    }),
    [12, 21],
    "01.04",
  );
  equal(
    e({
      str: "something> a    zzzz <here",
      from: 16,
      to: 20,
      ifRightSideIncludesThisThenCropTightly: "<",
      ifLeftSideIncludesThisCropItToo: "a",
      ifLeftSideIncludesThisThenCropTightly: ">",
    }),
    [10, 21],
    "01.05",
  );
  equal(
    e({
      str: "something> a    zzzz <here",
      from: 16,
      to: 20,
      ifLeftSideIncludesThisCropItToo: "a",
      ifLeftSideIncludesThisThenCropTightly: ">",
    }),
    [10, 21],
    "01.06",
  );
});

test("02 - crop markers beyond one space behave symmetrically", () => {
  equal(
    e({
      str: "a ;a",
      from: 1,
      to: 1,
      ifRightSideIncludesThisCropItToo: ";",
    }),
    [1, 3],
    "02.01",
  );
  equal(
    e({
      str: "a; a",
      from: 3,
      to: 3,
      ifLeftSideIncludesThisCropItToo: ";",
    }),
    [1, 3],
    "02.02",
  );
  equal(
    e({
      str: "ax ;a",
      from: 1,
      to: 2,
      ifRightSideIncludesThisCropItToo: ";",
    }),
    [1, 4],
    "02.03",
  );
  equal(
    e({
      str: "a; xa",
      from: 3,
      to: 4,
      ifLeftSideIncludesThisCropItToo: ";",
    }),
    [1, 4],
    "02.04",
  );
});

test("03 - one-side controls still suppress the opposite crop", () => {
  equal(
    e({
      str: "a ;a",
      from: 1,
      to: 1,
      ifRightSideIncludesThisCropItToo: ";",
      extendToOneSide: "left",
    }),
    [1, 1],
    "03.01",
  );
  equal(
    e({
      str: "a; a",
      from: 3,
      to: 3,
      ifLeftSideIncludesThisCropItToo: ";",
      extendToOneSide: "right",
    }),
    [3, 3],
    "03.02",
  );
});

test.run();
