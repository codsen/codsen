import tap from "tap";
import { rApply } from "ranges-apply";
import clone from "lodash.clonedeep";
import { rCrop } from "../dist/ranges-crop.esm";

// ==============================
// 0. THROWS
// ==============================

tap.test("01 - not ranges", (t) => {
  t.throws(() => {
    rCrop(NaN, null);
  }, /THROW_ID_01/);
  t.end();
});

tap.test("02 - str len is not a number", (t) => {
  t.throws(() => {
    rCrop([[1, 2]], null);
  }, /THROW_ID_02/);

  t.throws(() => {
    rCrop([[1, 2]], "2");
  }, /THROW_ID_02/);

  t.throws(() => {
    rCrop([[1, 2]], [2]);
  }, /THROW_ID_02/);

  t.throws(() => {
    rCrop([[1, 2]], false);
  }, /THROW_ID_02/);
  t.end();
});

tap.test("03 - array of ranges is actually a single range", (t) => {
  t.throws(() => {
    rCrop([1, 2], 3);
  }, /THROW_ID_03/);

  t.throws(() => {
    rCrop([1, 2, "zzzz"], 3);
  }, /THROW_ID_03/);
  t.end();
});

tap.test("04 - something's wrong with range arrays's contents", (t) => {
  t.throws(() => {
    rCrop([[1, "2"]], 3);
  }, /THROW_ID_04/);

  t.throws(() => {
    rCrop(
      [
        [1, 2],
        ["4", 5],
      ],
      3
    );
  }, /THROW_ID_04/);

  t.throws(() => {
    rCrop([[1, 2], [4, 5], "zzz"], 3);
  }, /THROW_ID_04/);

  t.throws(() => {
    rCrop(
      [
        [1, 2],
        [null, 5],
      ],
      3
    );
  }, /THROW_ID_04/);

  t.throws(() => {
    rCrop([[1, 2], [true]], 3);
  }, /THROW_ID_04/);
  t.end();
});

tap.test(
  "05 - third argument within one of given ranges if of a wrong type",
  (t) => {
    t.throws(() => {
      rCrop([[1, 2, 1]], 3);
    }, /THROW_ID_05/);
    t.end();
  }
);

tap.test("06 - null means absence of ranges", (t) => {
  t.is(rCrop(null), null);
  t.is(rCrop(null, 0), null);
  t.is(rCrop(null, 1), null);
  t.end();
});

// ==============================
// 01. crop, two arguments only
// ==============================

tap.test(`06 - crops out few ranges outside the strlen`, (t) => {
  const length = 7;
  const testStr = "z".repeat(length);
  const sourceRange = [[1, 3], null, [4, 6], [8, 10]];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = [
    [1, 3],
    [4, 6],
  ];
  const resRangeBackup = clone(resRange);

  t.strictSame(rCrop(sourceRange, length), resRange, "06.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "06.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "06.03");
  t.strictSame(resRange, resRangeBackup, "06.04");
  t.end();
});

tap.test(`07 - overlap on one of ranges`, (t) => {
  const length = 8;
  const testStr = "z".repeat(length);
  const sourceRange = [
    [1, 3],
    [5, 10],
  ];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = [
    [1, 3],
    [5, 8],
  ];
  const resRangeBackup = clone(resRange);
  t.strictSame(rCrop(sourceRange, length), resRange, "07.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "07.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "07.03");
  t.strictSame(resRange, resRangeBackup, "07.04");

  t.end();
});

tap.test(`08 - overlap on one of ranges plus some extra ranges`, (t) => {
  const length = 8;
  const testStr = "z".repeat(length);
  const sourceRange = [
    [1, 3],
    [5, 10],
    [12, 15],
    [16, 20],
  ];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = [
    [1, 3],
    [5, 8],
  ];
  const resRangeBackup = clone(resRange);

  t.strictSame(rCrop(sourceRange, length), resRange, "08.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "08.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "08.03");
  t.strictSame(resRange, resRangeBackup, "08.04");

  t.end();
});

tap.test(`09 - string length on the beginning of one of ranges`, (t) => {
  const length = 12;
  const testStr = "z".repeat(length);
  const sourceRange = [
    [1, 3],
    [5, 10],
    [12, 15],
    [16, 20],
  ];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = [
    [1, 3],
    [5, 10],
  ];
  const resRangeBackup = clone(resRange);

  t.strictSame(rCrop(sourceRange, length), resRange, "09.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "09.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "09.03");
  t.strictSame(resRange, resRangeBackup, "09.04");

  t.end();
});

tap.test(`10 - string length on the ending of one of ranges`, (t) => {
  const length = 15;
  const testStr = "z".repeat(length);
  const sourceRange = [
    [1, 3],
    [5, 10],
    [12, 15],
    [16, 20],
  ];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = [
    [1, 3],
    [5, 10],
    [12, 15],
  ];
  const resRangeBackup = clone(resRange);

  t.strictSame(rCrop(sourceRange, length), resRange, "10.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "10.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "10.03");
  t.strictSame(resRange, resRangeBackup, "10.04");

  t.end();
});

tap.test(`11 - string length beyond any of given ranges`, (t) => {
  const length = 99;
  const testStr = "z".repeat(length);
  const sourceRange = [
    [1, 3],
    [5, 10],
    [12, 15],
    [16, 20],
  ];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = clone(sourceRange); // <--------------- !
  const resRangeBackup = clone(resRange);

  t.strictSame(rCrop(sourceRange, length), resRange, "11.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "11.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "11.03");
  t.strictSame(resRange, resRangeBackup, "11.04");

  t.end();
});

tap.test(`12 - no ranges`, (t) => {
  const length = 99;
  const testStr = "z".repeat(length);
  const sourceRange = [];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = clone(sourceRange); // <--------------- !
  const resRangeBackup = clone(resRange);

  t.strictSame(rCrop(sourceRange, length), resRange, "12.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "12.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "12.03");
  t.strictSame(resRange, resRangeBackup, "12.04");

  t.end();
});

// now, exact the same tests but with ranges not in sorted order:

tap.test(`13 - unsorted ranges`, (t) => {
  const length = 8;
  const testStr = "z".repeat(length);
  const sourceRange = [
    [5, 10],
    [1, 3],
  ];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = [
    [1, 3],
    [5, 8],
  ];
  const resRangeBackup = clone(resRange);
  t.strictSame(rCrop(sourceRange, length), resRange, "13.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "13.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "13.03");
  t.strictSame(resRange, resRangeBackup, "13.04");

  t.end();
});

tap.test(`14 - lots of overlapping, unsorted and futile ranges`, (t) => {
  const length = 8;
  const testStr = "z".repeat(length);
  const sourceRange = [
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
  const sourceRangeBackup = clone(sourceRange);
  const resRange = [
    [1, 3],
    [5, 8],
  ];
  const resRangeBackup = clone(resRange);

  t.strictSame(rCrop(sourceRange, length), resRange, "14.01");

  // control:
  t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "14.02");

  // no mutation happened:
  t.strictSame(sourceRange, sourceRangeBackup, "14.03");
  t.strictSame(resRange, resRangeBackup, "14.04");

  t.end();
});

// ==============================
// 02. crop, three arguments only
// ==============================

tap.test(
  `15 - strlen matches the middle of some range's indexes, there's content to add (3rd arg.)`,
  (t) => {
    const length = 14;
    const testStr = "z".repeat(length);
    const sourceRange = [
      [1, 3],
      [5, 10, "aaa"],
      [12, 15, "bbb"],
      [16, 20],
    ];
    const sourceRangeBackup = clone(sourceRange);
    const resRange = [
      [1, 3],
      [5, 10, "aaa"],
      [12, 14, "bbb"],
    ];
    const resRangeBackup = clone(resRange);

    t.strictSame(rCrop(sourceRange, length), resRange, "15.01");

    // control:
    t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "15.02");

    // no mutation happened:
    t.strictSame(sourceRange, sourceRangeBackup, "15.03");
    t.strictSame(resRange, resRangeBackup, "15.04");

    t.end();
  }
);

tap.test(
  `16 - strlen matches the beginning of some range's indexes, there's content to add (3rd arg.)`,
  (t) => {
    const length = 12;
    const testStr = "z".repeat(length);
    const sourceRange = [
      [1, 3],
      [5, 10, "aaa"],
      [12, 15, "bbb"],
      [16, 20],
    ];
    const sourceRangeBackup = clone(sourceRange);
    const resRange = [
      [1, 3],
      [5, 10, "aaa"],
      [12, 12, "bbb"],
    ];
    const resRangeBackup = clone(resRange);

    t.strictSame(rCrop(sourceRange, length), resRange, "16.01");

    // control:
    t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "16.02");

    // no mutation happened:
    t.strictSame(sourceRange, sourceRangeBackup, "16.03");
    t.strictSame(resRange, resRangeBackup, "16.04");

    t.end();
  }
);

tap.test(
  `17 - strlen matches the ending of some range's indexes, there's content to add (3rd arg.)`,
  (t) => {
    const length = 15;
    const testStr = "z".repeat(length);
    const sourceRange = [
      [1, 3],
      [5, 10, "aaa"],
      [12, 15, "bbb"],
      [16, 20],
    ];
    const sourceRangeBackup = clone(sourceRange);
    const resRange = [
      [1, 3],
      [5, 10, "aaa"],
      [12, 15, "bbb"],
    ];
    const resRangeBackup = clone(resRange);

    t.strictSame(rCrop(sourceRange, length), resRange, "17.01");

    // control:
    t.equal(rApply(testStr, sourceRange), rApply(testStr, resRange), "17.02");

    // no mutation happened:
    t.strictSame(sourceRange, sourceRangeBackup, "17.03");
    t.strictSame(resRange, resRangeBackup, "17.04");

    t.end();
  }
);
