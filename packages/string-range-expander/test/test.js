import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { expander as e } from "../dist/string-range-expander.esm.js";

// -----------------------------------------------------------------------------

test("01 - nothing to expand", () => {
  // reference
  equal(
    e({
      str: "a     b",
      from: 2,
      to: 5,
    }),
    [2, 5],
    "01.01",
  );
  equal(
    e({
      str: "a     b",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [2, 5],
    "01.02",
  );
  equal(
    e({
      str: "a     b",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 5],
    "01.03",
  );

  //
  // middle
  // --------------
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
    }),
    [2, 5],
    "01.04",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [2, 5],
    "01.05",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 5, " "],
    "01.06",
  );

  //
  // touches start EOL
  // --------------
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5,
    }),
    [0, 5],
    "01.07",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [0, 5],
    "01.08",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 0,
      to: 5,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [0, 5],
    "01.09",
  );

  //
  // touches end EOL
  // --------------
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12,
    }),
    [2, 12],
    "01.10",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [2, 12],
    "01.11",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 12],
    "01.12",
  );

  //
  // touches both EOLS's
  // --------------
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12,
    }),
    [12, 12],
    "01.13",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [12, 12],
    "01.14",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 12,
      to: 12,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [12, 12],
    "01.15",
  );

  //
  // combo with wipe
  // --------------
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
    }),
    [2, 5],
    "01.16",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [2, 5],
    "01.17",
  );
  equal(
    e({
      str: "aaaaaaaaaaaa",
      from: 2,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [2, 5, " "],
    "01.18",
  );
});

test("02 - expanding from the middle of a gap", () => {
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 3,
    }),
    [2, 5],
    "02.01",
  );
  equal(
    e({
      str: "a     b",
      from: 2,
      to: 3,
    }),
    [2, 5],
    "02.02",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 5,
    }),
    [2, 5],
    "02.03",
  );
  equal(
    e({
      str: "a     b",
      from: 1,
      to: 3,
    }),
    [1, 5],
    "02.04",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 6,
    }),
    [2, 6],
    "02.05",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
    }),
    [2, 6],
    "02.06",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 4,
      wipeAllWhitespaceOnLeft: true,
    }),
    [1, 5],
    "02.07",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
    }),
    [1, 6],
    "02.08",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 4,
      wipeAllWhitespaceOnRight: true,
    }),
    [2, 6],
    "02.09",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnRight: true,
    }),
    [2, 6],
    "02.10",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
    }),
    [1, 6],
    "02.11",
  );
  equal(
    e({
      str: "a     b",
      from: 1,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
    }),
    [1, 6],
    "02.12",
  );
  equal(
    e({
      str: "a     b",
      from: 1,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      wipeAllWhitespaceOnRight: false,
    }),
    [1, 6],
    "02.13",
  );
});

test("03 - starting point is touching the edge (non-whitespace) even though tight cropping is not enabled", () => {
  equal(
    e({
      str: "a     b",
      from: 1,
      to: 3,
    }),
    [1, 5],
    "03.01",
  );
  equal(
    e({
      str: "a     b",
      from: 3,
      to: 6,
    }),
    [2, 6],
    "03.02",
  );
  equal(
    e({
      str: "a     b",
      from: 2,
      to: 6,
    }),
    [2, 6],
    "03.03",
  );
  equal(
    e({
      str: "a     b",
      from: 1,
      to: 6,
    }),
    [1, 6],
    "03.04",
  );
});

test("04 - both ends are equal", () => {
  equal(
    e({
      str: "ab",
      from: 1,
      to: 1,
    }),
    [1, 1],
    "04.01",
  );
  equal(
    e({
      str: "ab",
      from: 2,
      to: 2,
    }),
    [2, 2],
    "04.02",
  );
});

test("05 - addSingleSpaceToPreventAccidentalConcatenation", () => {
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
    }),
    [5, 6],
    "05.01",
  );

  // wipeAllWhitespaceOnLeft
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
    }),
    [5, 6],
    "05.02",
  );
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
    }),
    [5, 6],
    "05.03",
  );

  // addSingleSpaceToPreventAccidentalConcatenation
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 6],
    "05.04",
  );
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 6, " "],
    "05.05",
  );

  // combo
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 6, " "],
    "05.06",
  );
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 6],
    "05.07",
  );
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 6, " "],
    "05.08",
  );
  equal(
    e({
      str: "aaaaa aaaaaaa",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnLeft: false,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 6],
    "05.09",
  );
});

test("06 - wipeAllWhitespaceOnLeft + addSingleSpaceToPreventAccidentalConcatenation", () => {
  equal(
    e({
      str: "aaaaa  bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnLeft: false,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [6, 7],
    "06.01",
  );
  equal(
    e({
      str: "aaaaa  bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnLeft: false,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [6, 7],
    "06.02",
  );
  equal(
    e({
      str: "aaaaa  bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 7],
    "06.03",
  );
  equal(
    e({
      str: "aaaaa  bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 7, " "],
    "06.04",
  );
});

test("07 - wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation", () => {
  equal(
    e({
      str: "aaaaa  bbbbb",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnRight: false,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 6],
    "07.01",
  );
  equal(
    e({
      str: "aaaaa  bbbbb",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnRight: false,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 6],
    "07.02",
  );
  equal(
    e({
      str: "aaaaa  bbbbb",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnRight: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 7],
    "07.03",
  );
  equal(
    e({
      str: "aaaaa  bbbbb",
      from: 5,
      to: 6,
      wipeAllWhitespaceOnRight: true,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 7, " "],
    "07.04",
  );
});

test("08 - wipeAllWhitespaceOnLeft + wipeAllWhitespaceOnRight + addSingleSpaceToPreventAccidentalConcatenation", () => {
  equal(
    e({
      str: "aaaaa   bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnRight: false,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [6, 7],
    "08.01",
  );
  equal(
    e({
      str: "aaaaa   bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnLeft: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 7],
    "08.02",
  );
  equal(
    e({
      str: "aaaaa   bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnRight: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [6, 8],
    "08.03",
  );

  // both on result in tight crop:
  equal(
    e({
      str: "aaaaa   bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [5, 8],
    "08.04",
  );

  equal(
    e({
      str: "aaaaa   bbbbb",
      from: 6,
      to: 7,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 8, " "],
    "08.05",
  );
});

test("09 - addSingleSpaceToPreventAccidentalConcatenation ignored", () => {
  equal(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: false,
    }),
    [8, 16],
    "09.01",
  );
  equal(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [8, 16],
    "09.02",
  );
  equal(
    e({
      str: "a<!-- -->b",
      from: 1,
      to: 9,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [1, 9, " "],
    "09.03",
  );
  equal(
    e({
      str: "<zzz><!-- -->b",
      from: 5,
      to: 13,
      addSingleSpaceToPreventAccidentalConcatenation: true,
    }),
    [5, 13, " "],
    "09.04",
  );
  equal(
    e({
      str: "<strong><!-- --></strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 16],
    "09.05",
  );
  equal(
    e({
      str: "<strong><!-- -->a</strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 16, " "],
    "09.06",
  );
  equal(
    e({
      str: "<strong>a<!-- --></strong>",
      from: 9,
      to: 17,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [9, 17, " "],
    "09.07",
  );
  equal(
    e({
      str: "<strong>a<!-- -->a</strong>",
      from: 9,
      to: 17,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [9, 17, " "],
    "09.08",
  );

  // AND...

  equal(
    e({
      str: "<strong>  <!-- -->  </strong>",
      from: 10,
      to: 18,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 20],
    "09.09",
  );
  equal(
    e({
      str: "<strong>  <!-- --></strong>",
      from: 10,
      to: 18,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 18],
    "09.10",
  );
  equal(
    e({
      str: "<strong><!-- -->  </strong>",
      from: 8,
      to: 16,
      addSingleSpaceToPreventAccidentalConcatenation: true,
      ifLeftSideIncludesThisThenCropTightly: ">",
      ifRightSideIncludesThisThenCropTightly: "<",
    }),
    [8, 18],
    "09.11",
  );
});

// 06. opts.wipeAllWhitespaceOnLeft & opts.wipeAllWhitespaceOnRight
// -----------------------------------------------------------------------------

test(`10 - ${`\u001b[${33}m${"opts.wipeAllWhitespaceOnLeft"}\u001b[${39}m`} - extends to both sides`, () => {
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
    }),
    [3, 6],
    "10.01",
  );
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
    }),
    [2, 6],
    "10.02",
  );
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
      wipeAllWhitespaceOnRight: true,
    }),
    [3, 7],
    "10.03",
  );
  equal(
    e({
      str: "a>     <b",
      from: 4,
      to: 5,
      wipeAllWhitespaceOnLeft: true,
      wipeAllWhitespaceOnRight: true,
    }),
    [2, 7],
    "10.04",
  );
});

// 07. Various
// -----------------------------------------------------------------------------

test(`11 - ${`\u001b[${36}m${"various"}\u001b[${39}m`} - adhoc #1`, () => {
  let str = `<head>
<style type="text/css">
  aa, .unused[z], bb {z:2;}
</style>
</head>
<body id   =   ""  ><a class  =  "" >z</a>
</body>`;

  equal(
    e({
      str,
      from: 82,
      to: 93,
      ifRightSideIncludesThisThenCropTightly: "/>",
      wipeAllWhitespaceOnLeft: true,
    }),
    [81, 95],
    "11.01",
  );
});

test(`12 - ${`\u001b[${36}m${"various"}\u001b[${39}m`} - adhoc #2`, () => {
  let str = `<head>
<style>
  @media screen {.col-1,.col-2 {z: y;}}
</style>
</head>
<body>z
</body>`;

  equal(
    e({
      str,
      from: 32,
      to: 38,
      ifRightSideIncludesThisCropItToo: ",",
      ifRightSideIncludesThisThenCropTightly: ".#",
      extendToOneSide: "right",
    }),
    [32, 39],
    "12.01",
  );
});

test(`13 - ${`\u001b[${36}m${"various"}\u001b[${39}m`} - adhoc #3`, () => {
  let str = `<head>
<style>
  @media screen {.col-1,.col-2 {z: y;}}
</style>
</head>
<body>z
</body>`;

  equal(
    e({
      str,
      from: 39,
      to: 45,
      ifLeftSideIncludesThisCropItToo: ",",
      ifLeftSideIncludesThisThenCropTightly: ".#",
      extendToOneSide: "left",
    }),
    [38, 45],
    "13.01",
  );
});

test.run();
