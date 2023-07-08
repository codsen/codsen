import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

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

test.run();
