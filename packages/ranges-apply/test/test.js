import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { rApply } from "../dist/ranges-apply.esm.js";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - wrong inputs", () => {
  // no input
  throws(
    () => {
      rApply();
    },
    /THROW_ID_01/g,
    "01.01"
  );

  // first arg not string
  throws(
    () => {
      rApply(1);
    },
    /THROW_ID_02/g,
    "01.02"
  );

  throws(
    () => {
      rApply(1, [[4, 13]]);
    },
    /THROW_ID_02/g,
    "01.03"
  );

  // second arg not array
  throws(
    () => {
      rApply("aaa", 1);
    },
    /THROW_ID_03/g,
    "01.04"
  );

  // ranges array contain something else than arrays
  throws(
    () => {
      rApply("aaa", [1]);
    },
    /THROW_ID_05/g,
    "01.05"
  );

  throws(
    () => {
      rApply("aaa", [[1, "a"]]);
    },
    /THROW_ID_07/g,
    "01.06"
  );

  not.throws(() => {
    rApply("aaa", [["1", 2]]);
  }, "01.07");
  not.throws(() => {
    rApply("aaa", [[1, "2"]]);
  }, "01.08");
  not.throws(() => {
    rApply("aaa", [
      [1, "2"],
      ["3", "4"],
    ]);
  }, "01.09");
  not.throws(() => {
    rApply("aaa", [[1, 2]]);
  }, "01.10");

  throws(
    () => {
      rApply("aaa", [[1], [10, 20]]);
    },
    /THROW_ID_07/g,
    "01.07"
  );

  throws(
    () => {
      rApply("aaa", [[10, 20], [30]]);
    },
    /THROW_ID_07/g,
    "01.08"
  );

  throws(
    () => {
      rApply("aaa", [[10.1, 20]]);
    },
    /THROW_ID_06/g,
    "01.09"
  );

  throws(
    () => {
      rApply("aaa", [["10.1", "20"]]);
    },
    /THROW_ID_06/g,
    "01.10"
  );

  throws(
    () => {
      rApply(
        "sldfsljfldjfgldflgkdjlgjlkgjhlfjglhjflgh",
        [
          [10, 20],
          [15, 16],
        ],
        1
      );
    },
    /THROW_ID_04/g,
    "01.11"
  );

  throws(
    () => {
      rApply(
        "sldfsljfldjfgldflgkdjlgjlkgjhlfjglhjflgh",
        [
          [10, 20],
          [15, 16],
        ],
        true
      );
    },
    /THROW_ID_04/g,
    "01.12"
  );
});

test("02 - correct inputs", () => {
  // all inputs can be empty as long as types are correct

  // str, originalRangesArr, progressFn

  equal(rApply("", null), "", "02.01");
  equal(rApply(" ", null), " ", "02.02");
  equal(rApply("abc", null), "abc", "02.03");

  equal(rApply("", []), "", "02.04");
  equal(rApply(" ", []), " ", "02.05");
  equal(rApply("abc", []), "abc", "02.06");

  equal(rApply("", [null, null]), "", "02.07");
  equal(rApply(" ", [null, null]), " ", "02.08");
  equal(rApply("abc", [null, null]), "abc", "02.09");

  // progressFn as null

  equal(rApply("", null, null), "", "02.10");
  equal(rApply(" ", null, null), " ", "02.11");
  equal(rApply("abc", null, null), "abc", "02.12");

  equal(rApply("", [], null), "", "02.13");
  equal(rApply(" ", [], null), " ", "02.14");
  equal(rApply("abc", [], null), "abc", "02.15");

  equal(rApply("", [null, null], null), "", "02.16");
  equal(rApply(" ", [null, null], null), " ", "02.17");
  equal(rApply("abc", [null, null], null), "abc", "02.18");
});

// -----------------------------------------------------------------------------
// 02. normal use, no opts
// -----------------------------------------------------------------------------

test("03 - deletes multiple chunks correctly", () => {
  let str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n115.01')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  equal(
    rApply(str, [
      [4, 14],
      [18, 29],
    ]),
    "aaa bbb ccc",
    "03.01"
  );
});

test("04 - rApplyaces multiple chunks correctly", () => {
  let str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n131.02')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  equal(
    rApply(str, [
      [4, 13, "zzz"],
      [18, 28, "yyy"],
    ]),
    "aaa zzz bbb yyy ccc",
    "04.01"
  );
});

test("05 - deletes and replaces multiple chunks correctly", () => {
  let str = "aaa delete me bbb replace me ccc";
  // console.log('\n===============\n147.03')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  equal(
    rApply(str, [
      [4, 13],
      [18, 28, "zzz"],
    ]),
    "aaa  bbb zzz ccc",
    "05.01"
  );
});

test("06 - empty ranges array", () => {
  equal(rApply("some text", []), "some text", "06.01");
});

test("07 - deletes multiple chunks with zero indexes correctly", () => {
  let str = "delete me bbb and me too ccc";
  // console.log('\n===============\n168.05')
  // console.log('slice 1: >>>' + str.slice(0, 10) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  equal(
    rApply(str, [
      [0, 10],
      [14, 25],
    ]),
    "bbb ccc",
    "07.01"
  );
});

test("08 - rApplyaces multiple chunks with zero indexes correctly", () => {
  let str = "delete me bbb and me too ccc";
  // console.log('\n===============\n184.06')
  // console.log('slice 1: >>>' + str.slice(0, 9) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  equal(
    rApply(str, [
      [0, 9, "aaa"],
      [14, 25],
    ]),
    "aaa bbb ccc",
    "08.01"
  );
});

test("09 - rApplyace with ending index zero", () => {
  let str = "bbb ccc";
  equal(rApply(str, [[0, 0, "aaa "]]), "aaa bbb ccc", "09.01");
  equal(rApply(str, [0, 0, "aaa "]), "aaa bbb ccc", "09.02");
});

test("10 - null in third arg does nothing", () => {
  let str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n215.08')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  equal(
    rApply(str, [
      [4, 14, null],
      [18, 29],
    ]),
    "aaa bbb ccc",
    "10.01"
  );
  equal(
    rApply(str, [
      [4, 14],
      [18, 29, null],
    ]),
    "aaa bbb ccc",
    "10.02"
  );
  equal(
    rApply(str, [
      [4, 14, null],
      [18, 29, null],
    ]),
    "aaa bbb ccc",
    "10.03"
  );
});

test("11 - rApplyaces multiple chunks correctly", () => {
  let str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n247.09')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  equal(
    rApply(str, [[4, 13, "zzz"], null, [18, 28, null]]),
    "aaa zzz bbb  ccc",
    "11.01"
  );
});

test("12 - rApplyaces multiple chunks correctly given in a wrong order", () => {
  let str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n265.10')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  equal(
    rApply(str, [
      [18, 28, "yyy"],
      [4, 13, "zzz"],
    ]),
    "aaa zzz bbb yyy ccc",
    "12.01"
  );
});

test("13 - null as rApplyacement range - does nothing", () => {
  let str = "zzzzzzzz";
  equal(rApply(str, null), str, "13.01");
});

// -----------------------------------------------------------------------------
// 03. rApplyacement - both "from" and "to" markers are equal
// -----------------------------------------------------------------------------

test("14 - basic rApplyacement", () => {
  equal(rApply("aaa  ccc", [[4, 4, "bbb"]]), "aaa bbb ccc", "14.01");
  equal(rApply("aaa  ccc", [4, 4, "bbb"]), "aaa bbb ccc", "14.02");
});

test("15 - multiple rApplyacement pieces", () => {
  // let str = 'aaa  ccc  eee'
  // console.log('previewing: >>>' + str.slice(4, 15) + '<<<')
  // console.log('previewing: >>>' + str.slice(9, 15) + '<<<')
  equal(
    rApply("aaa  ccc  eee", [
      [4, 4, "bbb"],
      [9, 9, "ddd"],
    ]),
    "aaa bbb ccc ddd eee",
    "15.01"
  );
});

test("16 - null in rApplyacement op - does nothing", () => {
  equal(rApply("aaa  ccc", [[4, 4, null]]), "aaa  ccc", "16.01");
  equal(rApply("aaa  ccc", [4, 4, null]), "aaa  ccc", "16.02");
});

// -----------------------------------------------------------------------------
// 04. progressFn
// -----------------------------------------------------------------------------

test("17 - progressFn - basic rApplyacement", () => {
  let count = 0;
  equal(
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
    "17.01"
  );
  equal(
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
        type(perc, "number");
        count += 1;
      }
    ),
    "rrrlzgygljhlgzzzkyyyaaaa;dfrrrr lsjfldksj",
    "17.02"
  );
  ok(count <= 101, "17.03");
});

test.run();
