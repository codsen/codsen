import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { expander as e } from "../dist/string-range-expander.esm.js";

// -----------------------------------------------------------------------------

test("01 - normal use, both sides extended", () => {
  equal(
    e({
      str: "a>     <b",
      from: 3,
      to: 6,
      ifLeftSideIncludesThisThenCropTightly: ">",
    }),
    [2, 7],
    "01.01",
  );
  equal(
    e({
      str: "a>     <b",
      from: 2,
      to: 6,
      ifLeftSideIncludesThisThenCropTightly: ">",
    }),
    [2, 7],
    "01.02",
  );
  equal(
    e({
      str: "a>     <b",
      from: 3,
      to: 7,
      ifLeftSideIncludesThisThenCropTightly: ">",
    }),
    [2, 7],
    "01.03",
  );
  equal(
    e({
      str: "a>     <b",
      from: 2,
      to: 7,
      ifLeftSideIncludesThisThenCropTightly: ">",
    }),
    [2, 7],
    "01.04",
  );
});

test("02 - normal use, mismatching value", () => {
  equal(
    e({
      str: "a>     <b",
      from: 5,
      to: 5,
      ifLeftSideIncludesThisThenCropTightly: "z",
    }),
    [3, 6],
    "02.01",
  );
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
      ifLeftSideIncludesThisThenCropTightly: "z",
    }),
    [3, 6],
    "02.02",
  );
  equal(
    e({
      str: "a>     <b",
      from: 3,
      to: 6,
      ifLeftSideIncludesThisThenCropTightly: "z",
    }),
    [3, 6],
    "02.03",
  );
  equal(
    e({
      str: "a>     <b",
      from: 2,
      to: 6,
      ifLeftSideIncludesThisThenCropTightly: "z",
    }),
    [2, 6],
    "02.04",
  );
  equal(
    e({
      str: "a>     <b",
      from: 3,
      to: 7,
      ifLeftSideIncludesThisThenCropTightly: "z",
    }),
    [3, 7],
    "02.05",
  );
  equal(
    e({
      str: "a>     <b",
      from: 2,
      to: 7,
      ifLeftSideIncludesThisThenCropTightly: "z",
    }),
    [2, 7],
    "02.06",
  );
});

test("03 - range within characters, no whitespace", () => {
  equal(
    e({
      str: "aaaaaaaaaaaaa",
      from: 5,
      to: 5,
      ifLeftSideIncludesThisThenCropTightly: "z",
    }),
    [5, 5],
    "03.01",
  );
  equal(
    e({
      str: "aaaaaaaaaaaaa",
      from: 5,
      to: 5,
      ifLeftSideIncludesThisThenCropTightly: "a",
    }),
    [5, 5],
    "03.02",
  );
  equal(
    e({
      str: "-aaaaaaaaaaaaa-",
      from: 5,
      to: 5,
      ifLeftSideIncludesThisThenCropTightly: "a",
    }),
    [5, 5],
    "03.03",
  );
});

// 03. opts.ifRightSideIncludesThisThenCropTightly
// -----------------------------------------------------------------------------

test(`04 - ${`\u001b[${33}m${"opts.ifRightSideIncludesThisThenCropTightly"}\u001b[${39}m`} - normal use, both sides extended`, () => {
  equal(
    e({
      str: "a>     <b",
      from: 3,
      to: 6,
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [2, 7],
    "04.01",
  );
  equal(
    e({
      str: "a>     <b",
      from: 2,
      to: 6,
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [2, 7],
    "04.02",
  );
  equal(
    e({
      str: "a>     <b",
      from: 3,
      to: 7,
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [2, 7],
    "04.03",
  );
  equal(
    e({
      str: "a>     <b",
      from: 2,
      to: 7,
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [2, 7],
    "04.04",
  );
});

test(`05 - ${`\u001b[${33}m${"opts.ifRightSideIncludesThisThenCropTightly"}\u001b[${39}m`} - normal use, mismatching value`, () => {
  equal(
    e({
      str: "a>     <b",
      from: 5,
      to: 5,
      ifRightSideIncludesThisThenCropTightly: "z",
    }),
    [3, 6],
    "05.01",
  );
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
      ifRightSideIncludesThisThenCropTightly: "z",
    }),
    [3, 6],
    "05.02",
  );
  equal(
    e({
      str: "a>     <b",
      from: 3,
      to: 6,
      ifRightSideIncludesThisThenCropTightly: "z",
    }),
    [3, 6],
    "05.03",
  );
  equal(
    e({
      str: "a>     <b",
      from: 2,
      to: 6,
      ifRightSideIncludesThisThenCropTightly: "z",
    }),
    [2, 6],
    "05.04",
  );
  equal(
    e({
      str: "a>     <b",
      from: 3,
      to: 7,
      ifRightSideIncludesThisThenCropTightly: "z",
    }),
    [3, 7],
    "05.05",
  );
  equal(
    e({
      str: "a>     <b",
      from: 2,
      to: 7,
      ifRightSideIncludesThisThenCropTightly: "z",
    }),
    [2, 7],
    "05.06",
  );
});

test(`06 - ${`\u001b[${33}m${"opts.ifRightSideIncludesThisThenCropTightly"}\u001b[${39}m`} - range within characters, no whitespace`, () => {
  equal(
    e({
      str: "aaaaaaaaaaaaa",
      from: 5,
      to: 5,
      ifRightSideIncludesThisThenCropTightly: "z",
    }),
    [5, 5],
    "06.01",
  );
  equal(
    e({
      str: "aaaaaaaaaaaaa",
      from: 5,
      to: 5,
      ifRightSideIncludesThisThenCropTightly: "a",
    }),
    [5, 5],
    "06.02",
  );
  equal(
    e({
      str: "-aaaaaaaaaaaaa-",
      from: 5,
      to: 5,
      ifRightSideIncludesThisThenCropTightly: "a",
    }),
    [5, 5],
    "06.03",
  );
});

test.run();
