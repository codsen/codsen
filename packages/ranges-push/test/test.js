import tap from "tap";
import Ranges from "../dist/ranges-push.esm";

const nbsp = "\xA0";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

tap.test("01  -  ADD() - empty call", (t) => {
  // missing
  const ranges = new Ranges();
  ranges.add();
  t.equal(ranges.current(), null, "01");
  t.end();
});

tap.test("02  -  ADD() - two hardcoded undefined args", (t) => {
  const ranges = new Ranges();
  ranges.add(undefined, undefined);
  t.equal(ranges.current(), null, "02");
  t.end();
});

tap.test("03  -  ADD() - three hardcoded undefined args", (t) => {
  const ranges = new Ranges();
  ranges.add(undefined, undefined, undefined);
  t.equal(ranges.current(), null, "03");
  t.end();
});

tap.test("04  -  ADD() - two null args", (t) => {
  const ranges = new Ranges();
  ranges.add(null, null);
  t.equal(ranges.current(), null, "04");
  t.end();
});

tap.test("05  -  ADD() - three null args", (t) => {
  const ranges = new Ranges();
  ranges.add(null, null, null);
  t.equal(ranges.current(), null, "05");
  t.end();
});

tap.test("06  -  ADD() - wrong input args", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a");
  }, /THROW_ID_12/g);
  t.end();
});

tap.test("07  -  ADD() - wrong types", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a", "a");
  }, /THROW_ID_09/g);
  t.end();
});

tap.test("08  -  ADD() - wrong types", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, "a");
  }, /THROW_ID_10/g);
  t.end();
});

tap.test("09  -  ADD() - wrong types", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a", 1);
  }, /THROW_ID_09/g);
  t.end();
});

tap.test("10  -  ADD() - wrong input args", (t) => {
  t.doesNotThrow(() => {
    const ranges = new Ranges();
    ranges.add(1, 1);
  }, "10");
  t.end();
});

tap.test("11  -  ADD() - wrong input args", (t) => {
  // numbers but not natural integers
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1.2, 1);
  }, /THROW_ID_09/g);
  t.end();
});

tap.test("12  -  ADD() - wrong input args", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, 1.3);
  }, /THROW_ID_10/);
  t.end();
});

tap.test("13  -  ADD() - third input arg is not string", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2, 3);
  t.strictSame(ranges.current(), [[1, 2, "3"]], "13");
  t.end();
});

tap.test("14  -  ADD() - overloading", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, 2, "aaa", 1);
  }, /THROW_ID_03/);
  t.end();
});

tap.test("15  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a");
  }, /THROW_ID_12/);
  t.end();
});

tap.test("16  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a", "a");
  }, /THROW_ID_09/);
  t.end();
});

tap.test("17  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, "a");
  }, /THROW_ID_10/);
  t.end();
});

tap.test("18  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a", 1);
  }, /THROW_ID_09/);
  t.end();
});

tap.test("19  -  PUSH() - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    const ranges = new Ranges();
    ranges.push(1, 1);
  }, "19");
  t.end();
});

tap.test("20  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(undefined, 1);
  }, /THROW_ID_13/);
  t.end();
});

tap.test("21  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(null, 1);
  }, /THROW_ID_13/);
  t.end();
});

tap.test("22  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, undefined);
  }, /THROW_ID_12/);
  t.end();
});

tap.test("23  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, null);
  }, /THROW_ID_12/);
  t.end();
});

tap.test("24  -  PUSH() - numbers but not natural integers", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1.2, 1);
  }, /THROW_ID_09/);
  t.end();
});

tap.test("25  -  PUSH() - numbers but not natural integers", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, 1.3);
  }, /THROW_ID_10/);
  t.end();
});

tap.test(
  "26  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    const ranges = new Ranges();
    ranges.add([[1, 2, 3]]);
    t.strictSame(ranges.current(), [[1, 2, "3"]], "26");
    t.end();
  }
);

tap.test(
  "27  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    t.throws(() => {
      const ranges = new Ranges();
      ranges.add([[1, 2, "z", 1]]);
    }, /THROW_ID_03/);
    t.end();
  }
);

tap.test(
  "28  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    t.throws(() => {
      const ranges = new Ranges();
      ranges.add([[1, "z"]]);
    }, /THROW_ID_10/);
    t.end();
  }
);

tap.test(
  "29  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    t.throws(() => {
      const ranges = new Ranges();
      ranges.add([["z", 1]]);
    }, /THROW_ID_09/);
    t.end();
  }
);

tap.test(
  "30  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    t.throws(() => {
      const ranges = new Ranges();
      ranges.add([["z", 1], 1]);
    }, /THROW_ID_09/);
    t.end();
  }
);

tap.test("31  -  ADD() - null being pushed", (t) => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();
  t.strictSame(
    ranges1.current(),
    null,
    "31.01 - part1 - result about-to-be-pushed is really null"
  );
  ranges2.push(ranges1.current());
  t.strictSame(
    ranges2.current(),
    null,
    "31.02 - part2 - does not throw when null is pushed"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 02. BAU - no adding string, only ranges for deletion
// -----------------------------------------------------------------------------

tap.test("32  -  ADD() - adds two non-overlapping ranges", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  t.strictSame(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "32"
  );
  t.end();
});

tap.test("33  -  ADD() - adds two overlapping ranges", (t) => {
  const ranges = new Ranges();
  ranges.add(0, 5, undefined);
  ranges.add(3, 9);
  t.strictSame(ranges.current(), [[0, 9]], "33");
  t.end();
});

tap.test("34  -  ADD() - extends range", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(5, 9);
  t.strictSame(ranges.current(), [[1, 9]], "34");
  t.end();
});

tap.test("35  -  ADD() - new range bypasses the last range completely", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(11, 15);
  ranges.add(6, 10);
  ranges.add(16, 20);
  ranges.add(10, 30);
  t.strictSame(
    ranges.current(),
    [
      [1, 5],
      [6, 30],
    ],
    "35"
  );
  t.end();
});

tap.test(
  "36  -  ADD() - head and tail markers in new are smaller than last one's",
  (t) => {
    const ranges = new Ranges();
    ranges.add(10, 20);
    ranges.add(1, 5);
    t.strictSame(
      ranges.current(),
      [
        [1, 5],
        [10, 20],
      ],
      "36"
    );
    t.end();
  }
);

tap.test("37  -  ADD() - same value in heads and tails", (t) => {
  const ranges1 = new Ranges();
  ranges1.add(1, 1);
  t.strictSame(ranges1.current(), null, "37.01");

  const ranges2 = new Ranges();
  ranges2.add(1, 1, "zzz");
  t.strictSame(ranges2.current(), [[1, 1, "zzz"]], "37.02");

  t.end();
});

tap.test("38  -  ADD() - same range again and again", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  t.strictSame(ranges.current(), [[1, 10]], "38");
  t.end();
});

tap.test(
  "39  -  ADD() - same range again and again, one had third arg",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 10);
    ranges.add(1, 10);
    ranges.add(1, 10);
    ranges.add(1, 10, "zzz");
    ranges.add(1, 10);
    ranges.add(1, 10);
    t.strictSame(ranges.current(), [[1, 10, "zzz"]], "39");
    t.end();
  }
);

tap.test("40  -  ADD() - inputs as numeric strings - all OK", (t) => {
  const ranges = new Ranges();
  ranges.add("1", "2");
  ranges.add("3", "4");
  t.strictSame(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "40"
  );
  t.end();
});

tap.test("41  -  ADD() - wrong order is fine", (t) => {
  const ranges = new Ranges();
  ranges.add("3", "4");
  ranges.add("1", "2");
  t.strictSame(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "41"
  );
  t.end();
});

tap.test("42  -  PUSH() - adds two non-overlapping ranges", (t) => {
  const ranges = new Ranges();
  ranges.push(1, 2);
  ranges.push(3, 4);
  t.strictSame(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "42"
  );
  t.end();
});

tap.test("43  -  PUSH() - adds two overlapping ranges", (t) => {
  const ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(3, 9);
  t.strictSame(ranges.current(), [[0, 9]], "43");
  t.end();
});

tap.test("44  -  PUSH() - nulls, empty result", (t) => {
  const ranges = new Ranges();
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  t.strictSame(ranges.current(), null, "44");
  t.end();
});

tap.test("45  -  PUSH() - nulls, previous result retained", (t) => {
  const ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  t.strictSame(ranges.current(), [[0, 5]], "45");
  t.end();
});

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

tap.test("46  -  ADD() - adds third argument, blank start", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 1, "zzz");
  t.strictSame(ranges.current(), [[1, 1, "zzz"]], "46");
  t.end();
});

tap.test("47  -  ADD() - adds third argument onto existing and stops", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, "zzz");
  t.strictSame(
    ranges.current(),
    [
      [1, 2],
      [3, 4, "zzz"],
    ],
    "47"
  );
  t.end();
});

tap.test(
  "48  -  ADD() - adds third argument onto existing and adds more",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2);
    ranges.add(3, 4, "zzz");
    ranges.add(5, 6);
    t.strictSame(
      ranges.current(),
      [
        [1, 2],
        [3, 4, "zzz"],
        [5, 6],
      ],
      "48"
    );
    t.end();
  }
);

tap.test(
  '49  -  ADD() - existing "add" values get concatenated with incoming-ones',
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2, "aaa");
    ranges.add(2, 4, "zzz");
    ranges.add(5, 6);
    t.strictSame(
      ranges.current(),
      [
        [1, 4, "aaazzz"],
        [5, 6],
      ],
      "49"
    );
    t.end();
  }
);

tap.test(
  "50  -  ADD() - jumped over values have third args and they get concatenated",
  (t) => {
    const ranges = new Ranges();
    ranges.add(6, 10);
    ranges.add(16, 20, "bbb");
    ranges.add(11, 15, "aaa");
    ranges.add(10, 30); // this superset range will wipe the `aaa` and `bbb` above
    ranges.add(1, 5);
    t.strictSame(
      ranges.current(),
      [
        [1, 5],
        [6, 30],
      ],
      "50"
    );
    t.end();
  }
);

tap.test(
  "51  -  ADD() - combo of third arg and jumping behind previous range",
  (t) => {
    const ranges = new Ranges();
    ranges.add(10, 11, "aaa");
    ranges.add(3, 4, "zzz");
    t.strictSame(
      ranges.current(),
      [
        [3, 4, "zzz"],
        [10, 11, "aaa"],
      ],
      "51"
    );
    t.end();
  }
);

tap.test(
  "52  -  ADD() - combo of third arg merging and extending previous range (default)",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2);
    ranges.add(2, 4, "zzz");
    t.strictSame(ranges.current(), [[1, 4, "zzz"]], "52");
    t.end();
  }
);

tap.test(
  "53  -  ADD() - v1.1.0 - do not merge add-only entries with deletion entries case #1",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 3);
    ranges.add(4, 10);
    ranges.add(3, 3, "zzz");
    t.strictSame(
      ranges.current(),
      [
        [1, 3, "zzz"],
        [4, 10],
      ],
      "53"
    );
    t.end();
  }
);

tap.test(
  "54  -  ADD() - v2.1.0 - overlapping ranges discard their inner range to-add values",
  (t) => {
    const ranges = new Ranges();
    ranges.add(5, 6, " ");
    ranges.add(1, 10);
    t.strictSame(ranges.current(), [[1, 10]], "54");
    t.end();
  }
);

tap.test("55  -  ADD() - adds third argument with null", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, null);
  ranges.add(5, 6);
  t.strictSame(
    ranges.current(),
    [
      [1, 2],
      [3, 4, null],
      [5, 6],
    ],
    "55"
  );
  t.end();
});

tap.test(
  "56  -  ADD() - pushing whole .current() output of another ranges class",
  (t) => {
    const ranges1 = new Ranges();
    ranges1.add(5, 6, " ");
    ranges1.push(1, 10);

    const ranges2 = new Ranges();
    ranges2.push(2, 8);
    ranges2.add(5, 12);

    ranges1.push(ranges2.current());

    t.strictSame(ranges1.current(), [[1, 12]], "56");
    t.end();
  }
);

tap.test("57  -  ADD() - empty string to add", (t) => {
  const ranges1 = new Ranges();
  ranges1.add(1, 2, "");
  t.strictSame(ranges1.current(), [[1, 2]], "57");
  t.end();
});

tap.test("58  -  ADD() - empty string to add", (t) => {
  const ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add(1, 2, "");
  t.strictSame(ranges2.current(), [[1, 2]], "58");
  t.end();
});

tap.test("59  -  ADD() - empty string to add", (t) => {
  const ranges3 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges3.add(1, 2, "");
  ranges3.add(1, 2, "");
  t.strictSame(ranges3.current(), [[1, 2]], "59");
  t.end();
});

tap.test("60  -  ADD() - empty string to add", (t) => {
  const ranges4 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges4.add(1, 2, "");
  ranges4.add(3, 4, "");
  t.strictSame(
    ranges4.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "60"
  );
  t.end();
});

tap.test("61  -  ADD() - leading/trailing spaces in the third arg.", (t) => {
  const ranges = new Ranges();
  ranges.add("1", "2", "a");
  ranges.add("2", "2", " click here ");
  ranges.add("2", "3", "b");
  t.strictSame(ranges.current(), [[1, 3, "a click here b"]], "61");
  t.end();
});

tap.test("62  -  ADD() - leading/trailing spaces in the third arg.", (t) => {
  const ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add("1", "2", "a");
  ranges2.add("2", "2", " click here ");
  ranges2.add("2", "3", "b");
  t.strictSame(ranges2.current(), [[1, 3, "a click here b"]], "62");
  t.end();
});

tap.test("63  -  ADD() - whole ranges array is pushed", (t) => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();

  ranges1.add(1, 2);
  ranges1.add(3, 4);

  ranges2.push(5, 6);
  ranges2.push(ranges1.current());
  t.strictSame(
    ranges2.current(),
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    "63"
  );
  t.end();
});

tap.test("64  -  ADD() - empty array is pushed", (t) => {
  const ranges1 = new Ranges();
  ranges1.push([]);
  t.equal(ranges1.current(), null, "64");
  t.end();
});

tap.test("65  -  ADD() - null is pushed", (t) => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();
  ranges1.push(ranges2.current());
  t.equal(ranges1.current(), null, "65.01");
  t.equal(ranges1.current(), null, "65.02");
  t.end();
});

tap.test("66  -  ADD() - clashing third argument, mergeType === 1", (t) => {
  const ranges1 = new Ranges();
  ranges1.add(0, 5, "a");
  ranges1.add(0, 5, "b");
  t.strictSame(ranges1.current(), [[0, 5, "ab"]], "66");
  t.end();
});

tap.test("67  -  ADD() - clashing third argument, mergeType === 1", (t) => {
  // hardcoded default:
  const ranges2 = new Ranges({
    mergeType: 1,
  });
  ranges2.add(0, 5, "a");
  ranges2.add(0, 5, "b");
  t.strictSame(ranges2.current(), [[0, 5, "ab"]], "67");
  t.end();
});

tap.test("68  -  ADD() - clashing third argument, mergeType === 2", (t) => {
  const ranges = new Ranges({
    mergeType: 2,
  });
  ranges.add(0, 5, "a");
  ranges.add(0, 5, "b");
  t.strictSame(ranges.current(), [[0, 5, "b"]], "68");
  t.end();
});

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

tap.test("69  -  CURRENT() - calling on blank yields null", (t) => {
  const ranges = new Ranges();
  t.strictSame(ranges.current(), null, "69");
  t.end();
});

tap.test(
  "70  -  CURRENT() - multiple calls on the same should yield the same",
  (t) => {
    const ranges = new Ranges();
    ranges.add(7, 14);
    ranges.add(24, 28, " ");
    ranges.current();
    ranges.add(29, 31);
    ranges.current();
    ranges.current();
    ranges.current();
    ranges.current();
    t.strictSame(
      ranges.current(),
      [
        [7, 14],
        [24, 28, " "],
        [29, 31],
      ],
      "70"
    );
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

tap.test("71  -  WIPE() - wipes correctly", (t) => {
  const ranges = new Ranges();
  ranges.add(10, 10, "aaa");
  ranges.wipe();
  ranges.add(1, 2, "bbb");
  t.strictSame(ranges.current(), [[1, 2, "bbb"]], "71");
  t.end();
});

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

tap.test("72  -  LAST() - fetches the last range from empty", (t) => {
  const ranges = new Ranges();
  t.strictSame(ranges.last(), null, "72");
  t.end();
});

tap.test("73  -  LAST() - fetches the last range from non-empty", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2, "bbb");
  t.strictSame(ranges.last(), [1, 2, "bbb"], "73");
  t.end();
});

// -----------------------------------------------------------------------------
// 07. opts.limitToBeAddedWhitespace
// -----------------------------------------------------------------------------

tap.test("74  -  opts.limitToBeAddedWhitespace - spaces grouped - #1", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " ");
  ranges.add(2, 4, "   ");
  t.strictSame(ranges.current(), [[1, 4, " "]], "74 - both with spaces only");
  t.end();
});

tap.test("75  -  opts.limitToBeAddedWhitespace - spaces grouped - #2", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "   ");
  t.strictSame(ranges.current(), [[1, 4, " "]], "75 - with tabs");
  t.end();
});

tap.test("76  -  opts.limitToBeAddedWhitespace - spaces grouped - #3", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2);
  ranges.add(2, 4, "   ");
  t.strictSame(ranges.current(), [[1, 4, " "]], "76 - first slice has none");
  t.end();
});

tap.test("77  -  opts.limitToBeAddedWhitespace - spaces grouped - #4", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "   ");
  t.strictSame(
    ranges.current(),
    [[1, 4, " "]],
    "77 - first slice has empty str"
  );
  t.end();
});

tap.test("78  -  opts.limitToBeAddedWhitespace - spaces grouped - #5", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, " \t\t\t        ");
  t.strictSame(
    ranges.current(),
    [[1, 4, " "]],
    "78 - first empty second with tabs"
  );
  t.end();
});

tap.test("79  -  opts.limitToBeAddedWhitespace - spaces grouped - #6", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4);
  t.strictSame(ranges.current(), [[1, 4, " "]], "79 - second slice has none");
  t.end();
});

tap.test("80  -  opts.limitToBeAddedWhitespace - spaces grouped - #7", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4, "");
  t.strictSame(
    ranges.current(),
    [[1, 4, " "]],
    "80 - first slice has empty str"
  );
  t.end();
});

tap.test("81  -  opts.limitToBeAddedWhitespace - spaces grouped - #8", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "");
  t.strictSame(
    ranges.current(),
    [[1, 4, " "]],
    "81 - first empty second with tabs"
  );
  t.end();
});

tap.test("82  -  opts.limitToBeAddedWhitespace - linebreaks - #1", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "    ");
  t.strictSame(
    ranges.current(),
    [[1, 4, "\n"]],
    "82 - only 1st-one has line break"
  );
  t.end();
});

tap.test("83  -  opts.limitToBeAddedWhitespace - linebreaks - #2", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "  \n  ");
  t.strictSame(ranges.current(), [[1, 4, "\n"]], "83 - both have \\n");
  t.end();
});

tap.test("84  -  opts.limitToBeAddedWhitespace - linebreaks - #3", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "  \n  ");
  t.strictSame(ranges.current(), [[1, 4, "\n"]], "84");
  t.end();
});

tap.test("85  -  opts.limitToBeAddedWhitespace - linebreaks - #4", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "");
  t.strictSame(ranges.current(), [[1, 4]], "85");
  t.end();
});

tap.test(
  "86  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true });
    ranges.add(1, 2, null);
    ranges.add(2, 4, " z  ");
    t.strictSame(ranges.current(), [[1, 4, null]], "86");
    t.end();
  }
);

tap.test(
  "87  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true });
    ranges.add(1, 2, "   ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, null);
    t.strictSame(ranges.current(), [[1, 4, null]], "87");
    t.end();
  }
);

tap.test(
  "88  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1",
  (t) => {
    const ranges = new Ranges(); // <---- no opts
    ranges.add(1, 2, null);
    ranges.add(2, 4, " z  ");
    ranges.add(10, 20, " x  ");
    t.strictSame(
      ranges.current(),
      [
        [1, 4, null],
        [10, 20, " x  "],
      ],
      "88 - no opts"
    );
    t.end();
  }
);

tap.test(
  "89  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2",
  (t) => {
    const ranges = new Ranges(); // <---- no opts
    ranges.add(1, 2, "   ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, null);
    t.strictSame(ranges.current(), [[1, 4, null]], "89");
    t.end();
  }
);

tap.test(
  "90  -  opts.limitToBeAddedWhitespace - null wipes third arg values",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2, "aaa");
    ranges.add(2, 4, "zzz");
    ranges.add(1, 6, null);
    t.strictSame(ranges.current(), [[1, 6, null]], "90");
    t.end();
  }
);

tap.test(
  "91  -  opts.limitToBeAddedWhitespace - adds two non-overlapping ranges",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2);
    ranges.add(3, 4);
    t.strictSame(
      ranges.current(),
      [
        [1, 2],
        [3, 4],
      ],
      "91"
    );
    t.end();
  }
);

tap.test(
  "92  -  opts.limitToBeAddedWhitespace - leading whitespace - control",
  (t) => {
    const ranges = new Ranges(); // <---- no opts
    ranges.add(1, 2, "   ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, " ");
    t.strictSame(ranges.current(), [[1, 4, "   z "]], "92");
    t.end();
  }
);

tap.test(
  "93  -  opts.limitToBeAddedWhitespace - leading whitespace #1",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
    ranges.add(1, 2, "   ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, " ");
    t.strictSame(ranges.current(), [[1, 4, " z "]], "93");
    t.end();
  }
);

tap.test(
  "94  -  opts.limitToBeAddedWhitespace - leading whitespace #2",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
    ranges.add(1, 2, " \n  ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, " ");
    t.strictSame(ranges.current(), [[1, 4, "\nz "]], "94");
    t.end();
  }
);

tap.test(
  "95  -  opts.limitToBeAddedWhitespace - leading whitespace #3",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
    ranges.add(4, 4, null);
    ranges.add(7, 14, " ");
    ranges.add(7, 11);
    ranges.add(14, 14, ' alt=""');
    t.strictSame(
      ranges.current(),
      [
        [4, 4, null],
        [7, 14, ' alt=""'],
      ],
      "95"
    );
    t.end();
  }
);

tap.test("96  -  opts.limitToBeAddedWhitespace - nbsp replacement", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: false });
  ranges.add(1, 2, " ");
  ranges.add(2, 3, nbsp);
  ranges.add(3, 4, " ");
  t.strictSame(ranges.current(), [[1, 4, ` ${nbsp} `]], "96");
  t.end();
});

tap.test("97  -  opts.limitToBeAddedWhitespace - inserting a raw nbsp", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, nbsp);
  t.strictSame(ranges.current(), [[1, 2, nbsp]], "97");
  t.end();
});

// -----------------------------------------------------------------------------
// 08. opts.limitLinebreaksCount
// -----------------------------------------------------------------------------

tap.test("98  -  opts.limitLinebreaksCount #1 - control", (t) => {
  const ranges = new Ranges(); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  t.strictSame(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\n\n\n alt=""'],
    ],
    "98"
  );
  t.end();
});

tap.test("99  -  opts.limitLinebreaksCount #2 - hardcoded defaults", (t) => {
  const ranges = new Ranges({ limitLinebreaksCount: 1 }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  t.strictSame(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\n\n\n alt=""'],
    ],
    "99"
  );
  t.end();
});

tap.test("100  -  opts.limitLinebreaksCount #3 - hardcoded defaults", (t) => {
  const ranges = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 1,
  }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, 'alt=""');
  t.strictSame(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\nalt=""'],
    ],
    "100"
  );
  t.end();
});

tap.test("101  -  opts.limitLinebreaksCount #4 - hardcoded defaults", (t) => {
  const ranges = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2,
  }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, 'alt=""');
  t.strictSame(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\n\nalt=""'],
    ],
    "101"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 09. replace()
// -----------------------------------------------------------------------------

tap.test("102  -  REPLACE() - replaces ranges with ranges", (t) => {
  const oldRanges = new Ranges();
  const newRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.strictSame(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "102.01"
  );

  newRanges.add(5, 6, "x");
  newRanges.add(7, 8, "y");
  newRanges.add(11, 12);
  // first, ensure it's been assembled correctly:
  t.strictSame(
    newRanges.current(),
    [
      [5, 6, "x"],
      [7, 8, "y"],
      [11, 12],
    ],
    "102.02"
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  t.strictSame(
    oldRanges.current(),
    [
      [5, 6, "x"],
      [7, 8, "y"],
      [11, 12],
    ],
    "102.03"
  );
  t.end();
});

tap.test("103  -  REPLACE() - replaces ranges with null", (t) => {
  const oldRanges = new Ranges();
  const newRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.strictSame(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "103.01"
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  t.strictSame(oldRanges.current(), null, "103.02");
  t.end();
});

tap.test("104  -  REPLACE() - replaces ranges with empty array", (t) => {
  const oldRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.strictSame(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "104.01"
  );

  // replace:
  oldRanges.replace([]);

  // ensure oldRanges is now same as newRanges:
  t.strictSame(oldRanges.current(), null, "104.02");
  t.end();
});

tap.test(
  "105  -  REPLACE() - replaces ranges with single range (throws)",
  (t) => {
    const oldRanges = new Ranges();
    oldRanges.add(1, 2, "a");
    oldRanges.add(3, 4, "b");
    oldRanges.add(9, 10);

    // without third element, "what to insert"
    const error1 = t.throws(() => {
      oldRanges.replace([6, 8]);
    });
    t.match(error1.message, /THROW_ID_11/, "105.01");

    // with third element, "what to insert"
    const error2 = t.throws(() => {
      oldRanges.replace([6, 8, "zzz"]);
    });
    t.match(error2.message, /THROW_ID_11/, "105.02");

    // but range or ranges does work fine:
    oldRanges.replace([[6, 8, "zzz"]]);
    t.strictSame(oldRanges.current(), [[6, 8, "zzz"]], "105.03");
    t.end();
  }
);
