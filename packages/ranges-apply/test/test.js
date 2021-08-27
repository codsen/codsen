import tap from "tap";
import { rApply } from "../dist/ranges-apply.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test("01 - wrong inputs", (t) => {
  // no input
  t.throws(() => {
    rApply();
  }, /THROW_ID_01/g);

  // first arg not string
  t.throws(() => {
    rApply(1);
  }, /THROW_ID_02/g);

  t.throws(() => {
    rApply(1, [[4, 13]]);
  }, /THROW_ID_02/g);

  // second arg not array
  t.throws(() => {
    rApply("aaa", 1);
  }, /THROW_ID_03/g);

  // ranges array contain something else than arrays
  t.throws(() => {
    rApply("aaa", [1]);
  }, /THROW_ID_05/g);

  t.throws(() => {
    rApply("aaa", [[1, "a"]]);
  }, /THROW_ID_07/g);

  t.doesNotThrow(() => {
    rApply("aaa", [["1", 2]]);
  }, "01.07");
  t.doesNotThrow(() => {
    rApply("aaa", [[1, "2"]]);
  }, "01.08");
  t.doesNotThrow(() => {
    rApply("aaa", [
      [1, "2"],
      ["3", "4"],
    ]);
  }, "01.09");
  t.doesNotThrow(() => {
    rApply("aaa", [[1, 2]]);
  }, "01.10");

  t.throws(() => {
    rApply("aaa", [[1], [10, 20]]);
  }, /THROW_ID_07/g);

  t.throws(() => {
    rApply("aaa", [[10, 20], [30]]);
  }, /THROW_ID_07/g);

  t.throws(() => {
    rApply("aaa", [[10.1, 20]]);
  }, /THROW_ID_06/g);

  t.throws(() => {
    rApply("aaa", [["10.1", "20"]]);
  }, /THROW_ID_06/g);

  t.throws(() => {
    rApply(
      "sldfsljfldjfgldflgkdjlgjlkgjhlfjglhjflgh",
      [
        [10, 20],
        [15, 16],
      ],
      1
    );
  }, /THROW_ID_04/g);

  t.throws(() => {
    rApply(
      "sldfsljfldjfgldflgkdjlgjlkgjhlfjglhjflgh",
      [
        [10, 20],
        [15, 16],
      ],
      true
    );
  }, /THROW_ID_04/g);
  t.end();
});

tap.test("02 - correct inputs", (t) => {
  // all inputs can be empty as long as types are correct

  // str, originalRangesArr, progressFn

  t.strictSame(rApply("", null), "", "02.01");
  t.strictSame(rApply(" ", null), " ", "02.02");
  t.strictSame(rApply("abc", null), "abc", "02.03");

  t.strictSame(rApply("", []), "", "02.04");
  t.strictSame(rApply(" ", []), " ", "02.05");
  t.strictSame(rApply("abc", []), "abc", "02.06");

  t.strictSame(rApply("", [null, null]), "", "02.07");
  t.strictSame(rApply(" ", [null, null]), " ", "02.08");
  t.strictSame(rApply("abc", [null, null]), "abc", "02.09");

  // progressFn as null

  t.strictSame(rApply("", null, null), "", "02.10");
  t.strictSame(rApply(" ", null, null), " ", "02.11");
  t.strictSame(rApply("abc", null, null), "abc", "02.12");

  t.strictSame(rApply("", [], null), "", "02.13");
  t.strictSame(rApply(" ", [], null), " ", "02.14");
  t.strictSame(rApply("abc", [], null), "abc", "02.15");

  t.strictSame(rApply("", [null, null], null), "", "02.16");
  t.strictSame(rApply(" ", [null, null], null), " ", "02.17");
  t.strictSame(rApply("abc", [null, null], null), "abc", "02.18");

  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use, no opts
// -----------------------------------------------------------------------------

tap.test("03 - deletes multiple chunks correctly", (t) => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n115.01')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  t.strictSame(
    rApply(str, [
      [4, 14],
      [18, 29],
    ]),
    "aaa bbb ccc",
    "03"
  );
  t.end();
});

tap.test("04 - rApplyaces multiple chunks correctly", (t) => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n131.02')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.strictSame(
    rApply(str, [
      [4, 13, "zzz"],
      [18, 28, "yyy"],
    ]),
    "aaa zzz bbb yyy ccc",
    "04"
  );
  t.end();
});

tap.test("05 - deletes and replaces multiple chunks correctly", (t) => {
  const str = "aaa delete me bbb replace me ccc";
  // console.log('\n===============\n147.03')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.strictSame(
    rApply(str, [
      [4, 13],
      [18, 28, "zzz"],
    ]),
    "aaa  bbb zzz ccc",
    "05"
  );
  t.end();
});

tap.test("06 - empty ranges array", (t) => {
  t.strictSame(rApply("some text", []), "some text", "06");
  t.end();
});

tap.test("07 - deletes multiple chunks with zero indexes correctly", (t) => {
  const str = "delete me bbb and me too ccc";
  // console.log('\n===============\n168.05')
  // console.log('slice 1: >>>' + str.slice(0, 10) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  t.strictSame(
    rApply(str, [
      [0, 10],
      [14, 25],
    ]),
    "bbb ccc",
    "07"
  );
  t.end();
});

tap.test("08 - rApplyaces multiple chunks with zero indexes correctly", (t) => {
  const str = "delete me bbb and me too ccc";
  // console.log('\n===============\n184.06')
  // console.log('slice 1: >>>' + str.slice(0, 9) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  t.strictSame(
    rApply(str, [
      [0, 9, "aaa"],
      [14, 25],
    ]),
    "aaa bbb ccc",
    "08"
  );
  t.end();
});

tap.test("09 - rApplyace with ending index zero", (t) => {
  const str = "bbb ccc";
  t.strictSame(
    rApply(str, [[0, 0, "aaa "]]),
    "aaa bbb ccc",
    "09.01 - both from and to indexes are zeros, because we're adding content in front"
  );
  t.strictSame(
    rApply(str, [0, 0, "aaa "]),
    "aaa bbb ccc",
    "09.02 - single range, put straight into argument"
  );
  t.end();
});

tap.test("10 - null in third arg does nothing", (t) => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n215.08')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  t.strictSame(
    rApply(str, [
      [4, 14, null],
      [18, 29],
    ]),
    "aaa bbb ccc",
    "10.01"
  );
  t.strictSame(
    rApply(str, [
      [4, 14],
      [18, 29, null],
    ]),
    "aaa bbb ccc",
    "10.02"
  );
  t.strictSame(
    rApply(str, [
      [4, 14, null],
      [18, 29, null],
    ]),
    "aaa bbb ccc",
    "10.03"
  );
  t.end();
});

tap.test("11 - rApplyaces multiple chunks correctly", (t) => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n247.09')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.strictSame(
    rApply(str, [[4, 13, "zzz"], null, [18, 28, null]]),
    "aaa zzz bbb  ccc",
    "11"
  );
  t.end();
});

tap.test(
  "12 - rApplyaces multiple chunks correctly given in a wrong order",
  (t) => {
    const str = "aaa delete me bbb and me too ccc";
    // console.log('\n===============\n265.10')
    // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
    // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
    t.strictSame(
      rApply(str, [
        [18, 28, "yyy"],
        [4, 13, "zzz"],
      ]),
      "aaa zzz bbb yyy ccc",
      "12"
    );
    t.end();
  }
);

tap.test("13 - null as rApplyacement range - does nothing", (t) => {
  const str = "zzzzzzzz";
  t.strictSame(rApply(str, null), str, "13");
  t.end();
});

// -----------------------------------------------------------------------------
// 03. rApplyacement - both "from" and "to" markers are equal
// -----------------------------------------------------------------------------

tap.test("14 - basic rApplyacement", (t) => {
  t.strictSame(rApply("aaa  ccc", [[4, 4, "bbb"]]), "aaa bbb ccc", "14.01");
  t.strictSame(rApply("aaa  ccc", [4, 4, "bbb"]), "aaa bbb ccc", "14.02");
  t.end();
});

tap.test("15 - multiple rApplyacement pieces", (t) => {
  // let str = 'aaa  ccc  eee'
  // console.log('previewing: >>>' + str.slice(4, 15) + '<<<')
  // console.log('previewing: >>>' + str.slice(9, 15) + '<<<')
  t.strictSame(
    rApply("aaa  ccc  eee", [
      [4, 4, "bbb"],
      [9, 9, "ddd"],
    ]),
    "aaa bbb ccc ddd eee",
    "15"
  );
  t.end();
});

tap.test("16 - null in rApplyacement op - does nothing", (t) => {
  t.strictSame(rApply("aaa  ccc", [[4, 4, null]]), "aaa  ccc", "16.01");
  t.strictSame(rApply("aaa  ccc", [4, 4, null]), "aaa  ccc", "16.02");
  t.end();
});

// -----------------------------------------------------------------------------
// 04. progressFn
// -----------------------------------------------------------------------------

tap.test("17 - progressFn - basic rApplyacement", (t) => {
  let count = 0;
  t.strictSame(
    rApply("lkg jdlg dfljhlfgjlkhjf;gjh ;jsdlfj sldf lsjfldksj", [
      [40, 40, "rrrr"],
      [20, 25, "yyy"],
      [5, 5],
      [15, 16],
      [3, 4, "y"],
      [29, 38],
      [0, 0, "rrr"],
      [30, 30],
      [17, 19, "zzz"],
      [8, 11],
      [24, 28, "aaaa"],
      [4, 5],
      [29, 37],
      [22, 23],
      [30, 33],
      [1, 2, "z"],
      [30, 37],
      [5, 7],
    ]),
    "rrrlzgygljhlgzzzkyyyaaaa;dfrrrr lsjfldksj",
    "17.01 - baseline"
  );
  t.strictSame(
    rApply(
      "lkg jdlg dfljhlfgjlkhjf;gjh ;jsdlfj sldf lsjfldksj",
      [
        [40, 40, "rrrr"],
        [20, 25, "yyy"],
        [5, 5],
        [15, 16],
        [3, 4, "y"],
        [29, 38],
        [0, 0, "rrr"],
        [30, 30],
        [17, 19, "zzz"],
        [8, 11],
        [24, 28, "aaaa"],
        [4, 5],
        [29, 37],
        [22, 23],
        [30, 33],
        [1, 2, "z"],
        [30, 37],
        [5, 7],
      ],
      (perc) => {
        // console.log(`perc = ${perc}`);
        t.ok(typeof perc === "number");
        count += 1;
      }
    ),
    "rrrlzgygljhlgzzzkyyyaaaa;dfrrrr lsjfldksj",
    "17.02 - calls the progress function"
  );
  t.ok(count <= 101, "17.03");
  t.end();
});
