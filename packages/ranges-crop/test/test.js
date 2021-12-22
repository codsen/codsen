import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";
import { rApply } from "ranges-apply";
import clone from "lodash.clonedeep";

import { rCrop } from "../dist/ranges-crop.esm.js";

// ==============================
// 0. THROWS
// ==============================

test("01 - not ranges", () => {
  throws(() => {
    rCrop(NaN, null);
  }, /THROW_ID_01/);
});

test("02 - str len is not a number", () => {
  throws(() => {
    rCrop([[1, 2]], null);
  }, /THROW_ID_02/);

  throws(() => {
    rCrop([[1, 2]], "2");
  }, /THROW_ID_02/);

  throws(() => {
    rCrop([[1, 2]], [2]);
  }, /THROW_ID_02/);

  throws(() => {
    rCrop([[1, 2]], false);
  }, /THROW_ID_02/);
});

test("03 - array of ranges is actually a single range", () => {
  throws(() => {
    rCrop([1, 2], 3);
  }, /THROW_ID_03/);

  throws(() => {
    rCrop([1, 2, "zzzz"], 3);
  }, /THROW_ID_03/);
});

test("04 - something's wrong with range arrays's contents", () => {
  throws(() => {
    rCrop([[1, "2"]], 3);
  }, /THROW_ID_04/);

  throws(() => {
    rCrop(
      [
        [1, 2],
        ["4", 5],
      ],
      3
    );
  }, /THROW_ID_04/);

  throws(() => {
    rCrop([[1, 2], [4, 5], "zzz"], 3);
  }, /THROW_ID_04/);

  throws(() => {
    rCrop(
      [
        [1, 2],
        [null, 5],
      ],
      3
    );
  }, /THROW_ID_04/);

  throws(() => {
    rCrop([[1, 2], [true]], 3);
  }, /THROW_ID_04/);
});

test("05 - third argument within one of given ranges if of a wrong type", () => {
  throws(() => {
    rCrop([[1, 2, 1]], 3);
  }, /THROW_ID_05/);
});

test("06 - null means absence of ranges", () => {
  is(rCrop(null), null, "06.01");
  is(rCrop(null, 0), null, "06.02");
  is(rCrop(null, 1), null, "06.03");
});

// ==============================
// 01. crop, two arguments only
// ==============================

test(`07 - crops out few ranges outside the strlen`, () => {
  let length = 7;
  let testStr = "z".repeat(length);
  let sourceRange = [[1, 3], null, [4, 6], [8, 10]];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [4, 6],
  ];
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "07.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "07.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "07.03");
  equal(resRange, resRangeBackup, "07.04");
});

test(`08 - overlap on one of ranges`, () => {
  let length = 8;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [1, 3],
    [5, 10],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 8],
  ];
  let resRangeBackup = clone(resRange);
  equal(rCrop(sourceRange, length), resRange, "08.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "08.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "08.03");
  equal(resRange, resRangeBackup, "08.04");
});

test(`09 - overlap on one of ranges plus some extra ranges`, () => {
  let length = 8;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [1, 3],
    [5, 10],
    [12, 15],
    [16, 20],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 8],
  ];
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "09.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "09.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "09.03");
  equal(resRange, resRangeBackup, "09.04");
});

test(`10 - string length on the beginning of one of ranges`, () => {
  let length = 12;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [1, 3],
    [5, 10],
    [12, 15],
    [16, 20],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 10],
  ];
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "10.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "10.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "10.03");
  equal(resRange, resRangeBackup, "10.04");
});

test(`11 - string length on the ending of one of ranges`, () => {
  let length = 15;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [1, 3],
    [5, 10],
    [12, 15],
    [16, 20],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 10],
    [12, 15],
  ];
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "11.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "11.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "11.03");
  equal(resRange, resRangeBackup, "11.04");
});

test(`12 - string length beyond any of given ranges`, () => {
  let length = 99;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [1, 3],
    [5, 10],
    [12, 15],
    [16, 20],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = clone(sourceRange); // <--------------- !
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "12.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "12.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "12.03");
  equal(resRange, resRangeBackup, "12.04");
});

test(`13 - no ranges`, () => {
  let length = 99;
  let testStr = "z".repeat(length);
  let sourceRange = [];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = clone(sourceRange); // <--------------- !
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "13.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "13.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "13.03");
  equal(resRange, resRangeBackup, "13.04");
});

// now, exact the same tests but with ranges not in sorted order:

test(`14 - unsorted ranges`, () => {
  let length = 8;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [5, 10],
    [1, 3],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 8],
  ];
  let resRangeBackup = clone(resRange);
  equal(rCrop(sourceRange, length), resRange, "14.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "14.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "14.03");
  equal(resRange, resRangeBackup, "14.04");
});

test(`15 - lots of overlapping, unsorted and futile ranges`, () => {
  let length = 8;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [0, 0],
    [12, 15],
    [1, 2],
    [5, 7],
    [2, 3],
    [5, 5],
    [5, 10],
    [1, 3],
    [16, 20],
    [16, 16],
    [17, 19],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 8],
  ];
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "15.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "15.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "15.03");
  equal(resRange, resRangeBackup, "15.04");
});

// ==============================
// 02. crop, three arguments only
// ==============================

test(`16 - strlen matches the middle of some range's indexes, there's content to add (3rd arg.)`, () => {
  let length = 14;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [1, 3],
    [5, 10, "aaa"],
    [12, 15, "bbb"],
    [16, 20],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 10, "aaa"],
    [12, 14, "bbb"],
  ];
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "16.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "16.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "16.03");
  equal(resRange, resRangeBackup, "16.04");
});

test(`17 - strlen matches the beginning of some range's indexes, there's content to add (3rd arg.)`, () => {
  let length = 12;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [1, 3],
    [5, 10, "aaa"],
    [12, 15, "bbb"],
    [16, 20],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 10, "aaa"],
    [12, 12, "bbb"],
  ];
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "17.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "17.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "17.03");
  equal(resRange, resRangeBackup, "17.04");
});

test(`18 - strlen matches the ending of some range's indexes, there's content to add (3rd arg.)`, () => {
  let length = 15;
  let testStr = "z".repeat(length);
  let sourceRange = [
    [1, 3],
    [5, 10, "aaa"],
    [12, 15, "bbb"],
    [16, 20],
  ];
  let sourceRangeBackup = clone(sourceRange);
  let resRange = [
    [1, 3],
    [5, 10, "aaa"],
    [12, 15, "bbb"],
  ];
  let resRangeBackup = clone(resRange);

  equal(rCrop(sourceRange, length), resRange, "18.01");

  // control:
  equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "18.02");

  // no mutation happened:
  equal(sourceRange, sourceRangeBackup, "18.03");
  equal(resRange, resRangeBackup, "18.04");
});

test.run();
