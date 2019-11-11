import test from "ava";
import repl from "../dist/ranges-apply.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01.01 - wrong inputs", t => {
  // no input
  const error1 = t.throws(() => {
    repl();
  });
  t.regex(error1.message, /THROW_ID_01/);

  // first arg not string
  const error2 = t.throws(() => {
    repl(1);
  });
  t.regex(error2.message, /THROW_ID_02/);

  const error3 = t.throws(() => {
    repl(1, [[4, 13]]);
  });
  t.regex(error3.message, /THROW_ID_02/);

  // second arg not array
  const error4 = t.throws(() => {
    repl("aaa", 1);
  });
  t.regex(error4.message, /THROW_ID_03/);

  // ranges array contain something else than arrays
  const error5 = t.throws(() => {
    repl("aaa", [1]);
  });
  t.regex(error5.message, /THROW_ID_05/);

  const error6 = t.throws(() => {
    repl("aaa", [[1, "a"]]);
  });
  t.regex(error6.message, /THROW_ID_07/);

  t.notThrows(() => {
    repl("aaa", [["1", 2]]);
  });
  t.notThrows(() => {
    repl("aaa", [[1, "2"]]);
  });
  t.notThrows(() => {
    repl("aaa", [
      [1, "2"],
      ["3", "4"]
    ]);
  });
  t.notThrows(() => {
    repl("aaa", [[1, 2]]);
  });

  const error7 = t.throws(() => {
    repl("aaa", [[1], [10, 20]]);
  });
  t.regex(error7.message, /THROW_ID_07/);

  const error8 = t.throws(() => {
    repl("aaa", [[10, 20], [30]]);
  });
  t.regex(error8.message, /THROW_ID_07/);

  const error9 = t.throws(() => {
    repl("aaa", [[10.1, 20]]);
  });
  t.regex(error9.message, /THROW_ID_06/);

  const error10 = t.throws(() => {
    repl("aaa", [["10.1", "20"]]);
  });
  t.regex(error10.message, /THROW_ID_06/);

  const error11 = t.throws(() => {
    repl(
      "sldfsljfldjfgldflgkdjlgjlkgjhlfjglhjflgh",
      [
        [10, 20],
        [15, 16]
      ],
      1
    );
  });
  t.regex(error11.message, /THROW_ID_04/);

  const error12 = t.throws(() => {
    repl(
      "sldfsljfldjfgldflgkdjlgjlkgjhlfjglhjflgh",
      [
        [10, 20],
        [15, 16]
      ],
      true
    );
  });
  t.regex(error12.message, /THROW_ID_04/);
});

test("01.02 - correct inputs", t => {
  // all inputs can be empty as long as types are correct
  t.notThrows(() => {
    repl("", []);
  });

  // opts can be falsey, the absence being hardcoded
  t.notThrows(() => {
    repl("", [], null);
  });
  t.notThrows(() => {
    repl("", [], undefined);
  });
});

// -----------------------------------------------------------------------------
// 02. normal use, no opts
// -----------------------------------------------------------------------------

test("02.01 - deletes multiple chunks correctly", t => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n02.01')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  t.deepEqual(
    repl(str, [
      [4, 14],
      [18, 29]
    ]),
    "aaa bbb ccc",
    "02.01"
  );
});

test("02.02 - replaces multiple chunks correctly", t => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n02.02')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.deepEqual(
    repl(str, [
      [4, 13, "zzz"],
      [18, 28, "yyy"]
    ]),
    "aaa zzz bbb yyy ccc",
    "02.02"
  );
});

test("02.03 - deletes and replaces multiple chunks correctly", t => {
  const str = "aaa delete me bbb replace me ccc";
  // console.log('\n===============\n02.03')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.deepEqual(
    repl(str, [
      [4, 13],
      [18, 28, "zzz"]
    ]),
    "aaa  bbb zzz ccc",
    "02.03"
  );
});

test("02.04 - empty ranges array", t => {
  t.deepEqual(repl("some text", []), "some text", "02.04");
});

test("02.05 - deletes multiple chunks with zero indexes correctly", t => {
  const str = "delete me bbb and me too ccc";
  // console.log('\n===============\n02.05')
  // console.log('slice 1: >>>' + str.slice(0, 10) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  t.deepEqual(
    repl(str, [
      [0, 10],
      [14, 25]
    ]),
    "bbb ccc",
    "02.05"
  );
});

test("02.06 - replaces multiple chunks with zero indexes correctly", t => {
  const str = "delete me bbb and me too ccc";
  // console.log('\n===============\n02.06')
  // console.log('slice 1: >>>' + str.slice(0, 9) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  t.deepEqual(
    repl(str, [
      [0, 9, "aaa"],
      [14, 25]
    ]),
    "aaa bbb ccc",
    "02.06"
  );
});

test("02.07 - replace with ending index zero", t => {
  const str = "bbb ccc";
  t.deepEqual(
    repl(str, [[0, 0, "aaa "]]),
    "aaa bbb ccc",
    "02.07.01 - both from and to indexes are zeros, because we're adding content in front"
  );
  t.deepEqual(
    repl(str, [0, 0, "aaa "]),
    "aaa bbb ccc",
    "02.07.02 - single range, put straight into argument"
  );
});

test("02.08 - null in third arg does nothing", t => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n02.08')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  t.deepEqual(
    repl(str, [
      [4, 14, null],
      [18, 29]
    ]),
    "aaa bbb ccc",
    "02.08.01"
  );
  t.deepEqual(
    repl(str, [
      [4, 14],
      [18, 29, null]
    ]),
    "aaa bbb ccc",
    "02.08.02"
  );
  t.deepEqual(
    repl(str, [
      [4, 14, null],
      [18, 29, null]
    ]),
    "aaa bbb ccc",
    "02.08.03"
  );
});

test("02.09 - replaces multiple chunks correctly", t => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n02.09')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.deepEqual(
    repl(str, [
      [4, 13, "zzz"],
      [18, 28, null]
    ]),
    "aaa zzz bbb  ccc",
    "02.09"
  );
});

test("02.10 - replaces multiple chunks correctly given in a wrong order", t => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n02.10')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.deepEqual(
    repl(str, [
      [18, 28, "yyy"],
      [4, 13, "zzz"]
    ]),
    "aaa zzz bbb yyy ccc",
    "02.10"
  );
});

test("02.11 - null as replacement range - does nothing", t => {
  const str = "zzzzzzzz";
  t.deepEqual(repl(str, null), str, "02.11.01");
});

// -----------------------------------------------------------------------------
// 03. replacement - both "from" and "to" markers are equal
// -----------------------------------------------------------------------------

test("03.01 - basic replacement", t => {
  t.deepEqual(repl("aaa  ccc", [[4, 4, "bbb"]]), "aaa bbb ccc", "03.01.01");
  t.deepEqual(repl("aaa  ccc", [4, 4, "bbb"]), "aaa bbb ccc", "03.01.02");
});

test("03.02 - multiple replacement pieces", t => {
  // let str = 'aaa  ccc  eee'
  // console.log('previewing: >>>' + str.slice(4, 15) + '<<<')
  // console.log('previewing: >>>' + str.slice(9, 15) + '<<<')
  t.deepEqual(
    repl("aaa  ccc  eee", [
      [4, 4, "bbb"],
      [9, 9, "ddd"]
    ]),
    "aaa bbb ccc ddd eee",
    "03.02"
  );
});

test("03.03 - null in replacement op - does nothing", t => {
  t.deepEqual(repl("aaa  ccc", [[4, 4, null]]), "aaa  ccc", "03.03.01");
  t.deepEqual(repl("aaa  ccc", [4, 4, null]), "aaa  ccc", "03.03.02");
});

// -----------------------------------------------------------------------------
// 04. progressFn
// -----------------------------------------------------------------------------

test("04.01 - progressFn - basic replacement", t => {
  let count = 0;
  t.deepEqual(
    repl("lkg jdlg dfljhlfgjlkhjf;gjh ;jsdlfj sldf lsjfldksj", [
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
      [5, 7]
    ]),
    "rrrlzgygljhlgzzzkyyyaaaa;dfrrrr lsjfldksj",
    "04.01 - baseline"
  );
  t.deepEqual(
    repl(
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
        [5, 7]
      ],
      perc => {
        // console.log(`perc = ${perc}`);
        t.true(typeof perc === "number");
        count++;
      }
    ),
    "rrrlzgygljhlgzzzkyyyaaaa;dfrrrr lsjfldksj",
    "04.02 - calls the progress function"
  );
  t.true(count <= 101, "04.03");
});
