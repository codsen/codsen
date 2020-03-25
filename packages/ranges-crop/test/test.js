const t = require("tap");
const crop = require("../dist/ranges-crop.cjs");
const rangesApply = require("ranges-apply");
const clone = require("lodash.clonedeep");

// ==============================
// 0. THROWS
// ==============================

t.test("00.01 - ranges array is not array", (t) => {
  // throw pinning:
  t.throws(() => {
    crop(null);
  }, /THROW_ID_01/);
  t.end();
});

t.test("00.02 - str len is not a number", (t) => {
  t.throws(() => {
    crop([[1, 2]], null);
  }, /THROW_ID_02/);

  t.throws(() => {
    crop([[1, 2]], "2");
  }, /THROW_ID_02/);

  t.throws(() => {
    crop([[1, 2]], [2]);
  }, /THROW_ID_02/);

  t.throws(() => {
    crop([[1, 2]], false);
  }, /THROW_ID_02/);
  t.end();
});

t.test("00.03 - array of ranges is actually a single range", (t) => {
  t.throws(() => {
    crop([1, 2], 3);
  }, /THROW_ID_03/);

  t.throws(() => {
    crop([1, 2, "zzzz"], 3);
  }, /THROW_ID_03/);
  t.end();
});

t.test("00.04 - something's wrong with range arrays's contents", (t) => {
  t.throws(() => {
    crop([[1, "2"]], 3);
  }, /THROW_ID_04/);

  t.throws(() => {
    crop(
      [
        [1, 2],
        ["4", 5],
      ],
      3
    );
  }, /THROW_ID_04/);

  t.throws(() => {
    crop([[1, 2], [4, 5], "zzz"], 3);
  }, /THROW_ID_04/);

  t.throws(() => {
    crop(
      [
        [1, 2],
        [null, 5],
      ],
      3
    );
  }, /THROW_ID_04/);

  t.throws(() => {
    crop([[1, 2], [true]], 3);
  }, /THROW_ID_04/);
  t.end();
});

t.test(
  "00.05 - third argument within one of given ranges if of a wrong type",
  (t) => {
    t.throws(() => {
      crop([[1, 2, 1]], 3);
    }, /THROW_ID_05/);
    t.end();
  }
);

// ==============================
// 01. crop, two arguments only
// ==============================

t.test(`01.01 - crops out few ranges outside the strlen`, (t) => {
  const length = 7;
  const testStr = "z".repeat(length);
  const sourceRange = [
    [1, 3],
    [4, 6],
    [8, 10],
  ];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = [
    [1, 3],
    [4, 6],
  ];
  const resRangeBackup = clone(resRange);

  t.same(crop(sourceRange, length), resRange, "01.01.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.01.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.01.03");
  t.same(resRange, resRangeBackup, "01.01.04");
  t.end();
});

t.test(`01.02 - overlap on one of ranges`, (t) => {
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
  t.same(crop(sourceRange, length), resRange, "01.02.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.02.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.02.03");
  t.same(resRange, resRangeBackup, "01.02.04");

  t.end();
});

t.test(`01.03 - overlap on one of ranges plus some extra ranges`, (t) => {
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

  t.same(crop(sourceRange, length), resRange, "01.03.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.03.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.03.03");
  t.same(resRange, resRangeBackup, "01.03.04");

  t.end();
});

t.test(`01.04 - string length on the beginning of one of ranges`, (t) => {
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

  t.same(crop(sourceRange, length), resRange, "01.04.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.04.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.04.03");
  t.same(resRange, resRangeBackup, "01.04.04");

  t.end();
});

t.test(`01.05 - string length on the ending of one of ranges`, (t) => {
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

  t.same(crop(sourceRange, length), resRange, "01.05.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.05.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.05.03");
  t.same(resRange, resRangeBackup, "01.05.04");

  t.end();
});

t.test(`01.06 - string length beyond any of given ranges`, (t) => {
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

  t.same(crop(sourceRange, length), resRange, "01.06.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.06.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.06.03");
  t.same(resRange, resRangeBackup, "01.06.04");

  t.end();
});

t.test(`01.07 - no ranges`, (t) => {
  const length = 99;
  const testStr = "z".repeat(length);
  const sourceRange = [];
  const sourceRangeBackup = clone(sourceRange);
  const resRange = clone(sourceRange); // <--------------- !
  const resRangeBackup = clone(resRange);

  t.same(crop(sourceRange, length), resRange, "01.07.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.07.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.07.03");
  t.same(resRange, resRangeBackup, "01.07.04");

  t.end();
});

// now, exact the same tests but with ranges not in sorted order:

t.test(`01.08 - unsorted ranges`, (t) => {
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
  t.same(crop(sourceRange, length), resRange, "01.08.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.08.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.08.03");
  t.same(resRange, resRangeBackup, "01.08.04");

  t.end();
});

t.test(`01.09 - lots of overlapping, unsorted and futile ranges`, (t) => {
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

  t.same(crop(sourceRange, length), resRange, "01.09.01");

  // control:
  t.equal(
    rangesApply(testStr, sourceRange),
    rangesApply(testStr, resRange),
    "01.09.02"
  );

  // no mutation happened:
  t.same(sourceRange, sourceRangeBackup, "01.09.03");
  t.same(resRange, resRangeBackup, "01.09.04");

  t.end();
});

// ==============================
// 02. crop, three arguments only
// ==============================

t.test(
  `02.01 - strlen matches the middle of some range's indexes, there's content to add (3rd arg.)`,
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

    t.same(crop(sourceRange, length), resRange, "02.01.01");

    // control:
    t.equal(
      rangesApply(testStr, sourceRange),
      rangesApply(testStr, resRange),
      "02.01.02"
    );

    // no mutation happened:
    t.same(sourceRange, sourceRangeBackup, "02.01.03");
    t.same(resRange, resRangeBackup, "02.01.04");

    t.end();
  }
);

t.test(
  `02.02 - strlen matches the beginning of some range's indexes, there's content to add (3rd arg.)`,
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

    t.same(crop(sourceRange, length), resRange, "02.02.01");

    // control:
    t.equal(
      rangesApply(testStr, sourceRange),
      rangesApply(testStr, resRange),
      "02.02.02"
    );

    // no mutation happened:
    t.same(sourceRange, sourceRangeBackup, "02.02.03");
    t.same(resRange, resRangeBackup, "02.02.04");

    t.end();
  }
);

t.test(
  `02.03 - strlen matches the ending of some range's indexes, there's content to add (3rd arg.)`,
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

    t.same(crop(sourceRange, length), resRange, "02.03.01");

    // control:
    t.equal(
      rangesApply(testStr, sourceRange),
      rangesApply(testStr, resRange),
      "02.03.02"
    );

    // no mutation happened:
    t.same(sourceRange, sourceRangeBackup, "02.03.03");
    t.same(resRange, resRangeBackup, "02.03.04");

    t.end();
  }
);
