import tap from "tap";
import repl from "../dist/ranges-apply.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test("01.01 - wrong inputs", (t) => {
  // no input
  t.throws(() => {
    repl();
  }, /THROW_ID_01/g);

  // first arg not string
  t.throws(() => {
    repl(1);
  }, /THROW_ID_02/g);

  t.throws(() => {
    repl(1, [[4, 13]]);
  }, /THROW_ID_02/g);

  // second arg not array
  t.throws(() => {
    repl("aaa", 1);
  }, /THROW_ID_03/g);

  // ranges array contain something else than arrays
  t.throws(() => {
    repl("aaa", [1]);
  }, /THROW_ID_05/g);

  t.throws(() => {
    repl("aaa", [[1, "a"]]);
  }, /THROW_ID_07/g);

  t.doesNotThrow(() => {
    repl("aaa", [["1", 2]]);
  });
  t.doesNotThrow(() => {
    repl("aaa", [[1, "2"]]);
  });
  t.doesNotThrow(() => {
    repl("aaa", [
      [1, "2"],
      ["3", "4"],
    ]);
  });
  t.doesNotThrow(() => {
    repl("aaa", [[1, 2]]);
  });

  t.throws(() => {
    repl("aaa", [[1], [10, 20]]);
  }, /THROW_ID_07/g);

  t.throws(() => {
    repl("aaa", [[10, 20], [30]]);
  }, /THROW_ID_07/g);

  t.throws(() => {
    repl("aaa", [[10.1, 20]]);
  }, /THROW_ID_06/g);

  t.throws(() => {
    repl("aaa", [["10.1", "20"]]);
  }, /THROW_ID_06/g);

  t.throws(() => {
    repl(
      "sldfsljfldjfgldflgkdjlgjlkgjhlfjglhjflgh",
      [
        [10, 20],
        [15, 16],
      ],
      1
    );
  }, /THROW_ID_04/g);

  t.throws(() => {
    repl(
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

tap.test("01.02 - correct inputs", (t) => {
  // all inputs can be empty as long as types are correct
  t.doesNotThrow(() => {
    repl("", []);
  });

  // opts can be falsey, the absence being hardcoded
  t.doesNotThrow(() => {
    repl("", [], null);
  });
  t.doesNotThrow(() => {
    repl("", [], undefined);
  });
  t.end();
});

// -----------------------------------------------------------------------------
// 02. normal use, no opts
// -----------------------------------------------------------------------------

tap.test("02.01 - deletes multiple chunks correctly", (t) => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n115.01')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  t.same(
    repl(str, [
      [4, 14],
      [18, 29],
    ]),
    "aaa bbb ccc",
    "02.01"
  );
  t.end();
});

tap.test("02.02 - replaces multiple chunks correctly", (t) => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n131.02')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.same(
    repl(str, [
      [4, 13, "zzz"],
      [18, 28, "yyy"],
    ]),
    "aaa zzz bbb yyy ccc",
    "02.02"
  );
  t.end();
});

tap.test("02.03 - deletes and replaces multiple chunks correctly", (t) => {
  const str = "aaa delete me bbb replace me ccc";
  // console.log('\n===============\n147.03')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.same(
    repl(str, [
      [4, 13],
      [18, 28, "zzz"],
    ]),
    "aaa  bbb zzz ccc",
    "02.03"
  );
  t.end();
});

tap.test("02.04 - empty ranges array", (t) => {
  t.same(repl("some text", []), "some text", "02.04");
  t.end();
});

tap.test("02.05 - deletes multiple chunks with zero indexes correctly", (t) => {
  const str = "delete me bbb and me too ccc";
  // console.log('\n===============\n168.05')
  // console.log('slice 1: >>>' + str.slice(0, 10) + '<<<')
  // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
  t.same(
    repl(str, [
      [0, 10],
      [14, 25],
    ]),
    "bbb ccc",
    "02.05"
  );
  t.end();
});

tap.test(
  "02.06 - replaces multiple chunks with zero indexes correctly",
  (t) => {
    const str = "delete me bbb and me too ccc";
    // console.log('\n===============\n184.06')
    // console.log('slice 1: >>>' + str.slice(0, 9) + '<<<')
    // console.log('slice 2: >>>' + str.slice(14, 25) + '<<<\n')
    t.same(
      repl(str, [
        [0, 9, "aaa"],
        [14, 25],
      ]),
      "aaa bbb ccc",
      "02.06"
    );
    t.end();
  }
);

tap.test("02.07 - replace with ending index zero", (t) => {
  const str = "bbb ccc";
  t.same(
    repl(str, [[0, 0, "aaa "]]),
    "aaa bbb ccc",
    "02.07.01 - both from and to indexes are zeros, because we're adding content in front"
  );
  t.same(
    repl(str, [0, 0, "aaa "]),
    "aaa bbb ccc",
    "02.07.02 - single range, put straight into argument"
  );
  t.end();
});

tap.test("02.08 - null in third arg does nothing", (t) => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n215.08')
  // console.log('slice 1: >>>' + str.slice(4, 14) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 29) + '<<<\n')
  t.same(
    repl(str, [
      [4, 14, null],
      [18, 29],
    ]),
    "aaa bbb ccc",
    "02.08.01"
  );
  t.same(
    repl(str, [
      [4, 14],
      [18, 29, null],
    ]),
    "aaa bbb ccc",
    "02.08.02"
  );
  t.same(
    repl(str, [
      [4, 14, null],
      [18, 29, null],
    ]),
    "aaa bbb ccc",
    "02.08.03"
  );
  t.end();
});

tap.test("02.09 - replaces multiple chunks correctly", (t) => {
  const str = "aaa delete me bbb and me too ccc";
  // console.log('\n===============\n247.09')
  // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
  // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
  t.same(
    repl(str, [
      [4, 13, "zzz"],
      [18, 28, null],
    ]),
    "aaa zzz bbb  ccc",
    "02.09"
  );
  t.end();
});

tap.test(
  "02.10 - replaces multiple chunks correctly given in a wrong order",
  (t) => {
    const str = "aaa delete me bbb and me too ccc";
    // console.log('\n===============\n265.10')
    // console.log('slice 1: >>>' + str.slice(4, 13) + '<<<')
    // console.log('slice 2: >>>' + str.slice(18, 28) + '<<<\n')
    t.same(
      repl(str, [
        [18, 28, "yyy"],
        [4, 13, "zzz"],
      ]),
      "aaa zzz bbb yyy ccc",
      "02.10"
    );
    t.end();
  }
);

tap.test("02.11 - null as replacement range - does nothing", (t) => {
  const str = "zzzzzzzz";
  t.same(repl(str, null), str, "02.11.01");
  t.end();
});

// -----------------------------------------------------------------------------
// 03. replacement - both "from" and "to" markers are equal
// -----------------------------------------------------------------------------

tap.test("03.01 - basic replacement", (t) => {
  t.same(repl("aaa  ccc", [[4, 4, "bbb"]]), "aaa bbb ccc", "03.01.01");
  t.same(repl("aaa  ccc", [4, 4, "bbb"]), "aaa bbb ccc", "03.01.02");
  t.end();
});

tap.test("03.02 - multiple replacement pieces", (t) => {
  // let str = 'aaa  ccc  eee'
  // console.log('previewing: >>>' + str.slice(4, 15) + '<<<')
  // console.log('previewing: >>>' + str.slice(9, 15) + '<<<')
  t.same(
    repl("aaa  ccc  eee", [
      [4, 4, "bbb"],
      [9, 9, "ddd"],
    ]),
    "aaa bbb ccc ddd eee",
    "03.02"
  );
  t.end();
});

tap.test("03.03 - null in replacement op - does nothing", (t) => {
  t.same(repl("aaa  ccc", [[4, 4, null]]), "aaa  ccc", "03.03.01");
  t.same(repl("aaa  ccc", [4, 4, null]), "aaa  ccc", "03.03.02");
  t.end();
});

// -----------------------------------------------------------------------------
// 04. progressFn
// -----------------------------------------------------------------------------

tap.test("04.01 - progressFn - basic replacement", (t) => {
  let count = 0;
  t.same(
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
      [5, 7],
    ]),
    "rrrlzgygljhlgzzzkyyyaaaa;dfrrrr lsjfldksj",
    "04.01 - baseline"
  );
  t.same(
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
        [5, 7],
      ],
      (perc) => {
        // console.log(`perc = ${perc}`);
        t.ok(typeof perc === "number");
        count += 1;
      }
    ),
    "rrrlzgygljhlgzzzkyyyaaaa;dfrrrr lsjfldksj",
    "04.02 - calls the progress function"
  );
  t.ok(count <= 101, "04.03");
  t.end();
});
