const t = require("tap");
const Ranges = require("../dist/ranges-push.cjs");
const nbsp = "\xA0";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

t.test("01.01  -  ADD() - empty call", (t) => {
  // missing
  const ranges = new Ranges();
  ranges.add();
  t.equal(ranges.current(), null);
  t.end();
});

t.test("01.02  -  ADD() - two hardcoded undefined args", (t) => {
  const ranges = new Ranges();
  ranges.add(undefined, undefined);
  t.equal(ranges.current(), null);
  t.end();
});

t.test("01.03  -  ADD() - three hardcoded undefined args", (t) => {
  const ranges = new Ranges();
  ranges.add(undefined, undefined, undefined);
  t.equal(ranges.current(), null);
  t.end();
});

t.test("01.04  -  ADD() - two null args", (t) => {
  const ranges = new Ranges();
  ranges.add(null, null);
  t.equal(ranges.current(), null);
  t.end();
});

t.test("01.05  -  ADD() - three null args", (t) => {
  const ranges = new Ranges();
  ranges.add(null, null, null);
  t.equal(ranges.current(), null);
  t.end();
});

t.test("01.06  -  ADD() - wrong input args", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a");
  }, /THROW_ID_12/g);
  t.end();
});

t.test("01.07  -  ADD() - wrong types", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a", "a");
  }, /THROW_ID_09/g);
  t.end();
});

t.test("01.08  -  ADD() - wrong types", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, "a");
  }, /THROW_ID_10/g);
  t.end();
});

t.test("01.09  -  ADD() - wrong types", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a", 1);
  }, /THROW_ID_09/g);
  t.end();
});

t.test("01.10  -  ADD() - wrong input args", (t) => {
  t.doesNotThrow(() => {
    const ranges = new Ranges();
    ranges.add(1, 1);
  });
  t.end();
});

t.test("01.11  -  ADD() - wrong input args", (t) => {
  // numbers but not natural integers
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1.2, 1);
  }, /THROW_ID_09/g);
  t.end();
});

t.test("01.12  -  ADD() - wrong input args", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, 1.3);
  }, /THROW_ID_10/);
  t.end();
});

t.test("01.13  -  ADD() - third input arg is not string", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2, 3);
  t.same(ranges.current(), [[1, 2, "3"]]);
  t.end();
});

t.test("01.14  -  ADD() - overloading", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, 2, "aaa", 1);
  }, /THROW_ID_03/);
  t.end();
});

t.test("01.15  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a");
  }, /THROW_ID_12/);
  t.end();
});

t.test("01.16  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a", "a");
  }, /THROW_ID_09/);
  t.end();
});

t.test("01.17  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, "a");
  }, /THROW_ID_10/);
  t.end();
});

t.test("01.18  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a", 1);
  }, /THROW_ID_09/);
  t.end();
});

t.test("01.19  -  PUSH() - wrong inputs", (t) => {
  t.doesNotThrow(() => {
    const ranges = new Ranges();
    ranges.push(1, 1);
  });
  t.end();
});

t.test("01.20  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(undefined, 1);
  }, /THROW_ID_13/);
  t.end();
});

t.test("01.21  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(null, 1);
  }, /THROW_ID_13/);
  t.end();
});

t.test("01.22  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, undefined);
  }, /THROW_ID_12/);
  t.end();
});

t.test("01.23  -  PUSH() - wrong inputs", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, null);
  }, /THROW_ID_12/);
  t.end();
});

t.test("01.24  -  PUSH() - numbers but not natural integers", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1.2, 1);
  }, /THROW_ID_09/);
  t.end();
});

t.test("01.25  -  PUSH() - numbers but not natural integers", (t) => {
  t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, 1.3);
  }, /THROW_ID_10/);
  t.end();
});

t.test(
  "01.26  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    const ranges = new Ranges();
    ranges.add([[1, 2, 3]]);
    t.same(ranges.current(), [[1, 2, "3"]]);
    t.end();
  }
);

t.test(
  "01.27  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    t.throws(() => {
      const ranges = new Ranges();
      ranges.add([[1, 2, "z", 1]]);
    }, /THROW_ID_03/);
    t.end();
  }
);

t.test(
  "01.28  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    t.throws(() => {
      const ranges = new Ranges();
      ranges.add([[1, "z"]]);
    }, /THROW_ID_10/);
    t.end();
  }
);

t.test(
  "01.29  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    t.throws(() => {
      const ranges = new Ranges();
      ranges.add([["z", 1]]);
    }, /THROW_ID_09/);
    t.end();
  }
);

t.test(
  "01.30  -  ADD() - first argument is .current() output of ranges",
  (t) => {
    t.throws(() => {
      const ranges = new Ranges();
      ranges.add([["z", 1], 1]);
    }, /THROW_ID_09/);
    t.end();
  }
);

t.test("01.31  -  ADD() - null being pushed", (t) => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();
  t.same(
    ranges1.current(),
    null,
    "01.31.01 - part1 - result about-to-be-pushed is really null"
  );
  ranges2.push(ranges1.current());
  t.same(
    ranges2.current(),
    null,
    "01.31.02 - part2 - does not throw when null is pushed"
  );
  t.end();
});

// -----------------------------------------------------------------------------
// 02. BAU - no adding string, only ranges for deletion
// -----------------------------------------------------------------------------

t.test("02.01  -  ADD() - adds two non-overlapping ranges", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  t.same(ranges.current(), [
    [1, 2],
    [3, 4],
  ]);
  t.end();
});

t.test("02.02  -  ADD() - adds two overlapping ranges", (t) => {
  const ranges = new Ranges();
  ranges.add(0, 5, undefined);
  ranges.add(3, 9);
  t.same(ranges.current(), [[0, 9]]);
  t.end();
});

t.test("02.03  -  ADD() - extends range", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(5, 9);
  t.same(ranges.current(), [[1, 9]]);
  t.end();
});

t.test(
  "02.04  -  ADD() - new range bypasses the last range completely",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 5);
    ranges.add(11, 15);
    ranges.add(6, 10);
    ranges.add(16, 20);
    ranges.add(10, 30);
    t.same(ranges.current(), [
      [1, 5],
      [6, 30],
    ]);
    t.end();
  }
);

t.test(
  "02.05  -  ADD() - head and tail markers in new are smaller than last one's",
  (t) => {
    const ranges = new Ranges();
    ranges.add(10, 20);
    ranges.add(1, 5);
    t.same(ranges.current(), [
      [1, 5],
      [10, 20],
    ]);
    t.end();
  }
);

t.test("02.06  -  ADD() - same value in heads and tails", (t) => {
  const ranges1 = new Ranges();
  ranges1.add(1, 1);
  t.same(ranges1.current(), []);

  const ranges2 = new Ranges();
  ranges2.add(1, 1, "zzz");
  t.same(ranges2.current(), [[1, 1, "zzz"]]);

  t.end();
});

t.test("02.07  -  ADD() - same range again and again", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  t.same(ranges.current(), [[1, 10]]);
  t.end();
});

t.test(
  "02.08  -  ADD() - same range again and again, one had third arg",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 10);
    ranges.add(1, 10);
    ranges.add(1, 10);
    ranges.add(1, 10, "zzz");
    ranges.add(1, 10);
    ranges.add(1, 10);
    t.same(ranges.current(), [[1, 10, "zzz"]]);
    t.end();
  }
);

t.test("02.09  -  ADD() - inputs as numeric strings - all OK", (t) => {
  const ranges = new Ranges();
  ranges.add("1", "2");
  ranges.add("3", "4");
  t.same(ranges.current(), [
    [1, 2],
    [3, 4],
  ]);
  t.end();
});

t.test("02.10  -  ADD() - wrong order is fine", (t) => {
  const ranges = new Ranges();
  ranges.add("3", "4");
  ranges.add("1", "2");
  t.same(ranges.current(), [
    [1, 2],
    [3, 4],
  ]);
  t.end();
});

t.test("02.11  -  PUSH() - adds two non-overlapping ranges", (t) => {
  const ranges = new Ranges();
  ranges.push(1, 2);
  ranges.push(3, 4);
  t.same(ranges.current(), [
    [1, 2],
    [3, 4],
  ]);
  t.end();
});

t.test("02.12  -  PUSH() - adds two overlapping ranges", (t) => {
  const ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(3, 9);
  t.same(ranges.current(), [[0, 9]]);
  t.end();
});

t.test("02.13  -  PUSH() - nulls, empty result", (t) => {
  const ranges = new Ranges();
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  t.same(ranges.current(), null);
  t.end();
});

t.test("02.14  -  PUSH() - nulls, previous result retained", (t) => {
  const ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  t.same(ranges.current(), [[0, 5]]);
  t.end();
});

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

t.test("03.01  -  ADD() - adds third argument, blank start", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 1, "zzz");
  t.same(ranges.current(), [[1, 1, "zzz"]]);
  t.end();
});

t.test("03.02  -  ADD() - adds third argument onto existing and stops", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, "zzz");
  t.same(ranges.current(), [
    [1, 2],
    [3, 4, "zzz"],
  ]);
  t.end();
});

t.test(
  "03.03  -  ADD() - adds third argument onto existing and adds more",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2);
    ranges.add(3, 4, "zzz");
    ranges.add(5, 6);
    t.same(ranges.current(), [
      [1, 2],
      [3, 4, "zzz"],
      [5, 6],
    ]);
    t.end();
  }
);

t.test(
  '03.04  -  ADD() - existing "add" values get concatenated with incoming-ones',
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2, "aaa");
    ranges.add(2, 4, "zzz");
    ranges.add(5, 6);
    t.same(ranges.current(), [
      [1, 4, "aaazzz"],
      [5, 6],
    ]);
    t.end();
  }
);

t.test(
  "03.05  -  ADD() - jumped over values have third args and they get concatenated",
  (t) => {
    const ranges = new Ranges();
    ranges.add(6, 10);
    ranges.add(16, 20, "bbb");
    ranges.add(11, 15, "aaa");
    ranges.add(10, 30); // this superset range will wipe the `aaa` and `bbb` above
    ranges.add(1, 5);
    t.same(ranges.current(), [
      [1, 5],
      [6, 30],
    ]);
    t.end();
  }
);

t.test(
  "03.06  -  ADD() - combo of third arg and jumping behind previous range",
  (t) => {
    const ranges = new Ranges();
    ranges.add(10, 11, "aaa");
    ranges.add(3, 4, "zzz");
    t.same(ranges.current(), [
      [3, 4, "zzz"],
      [10, 11, "aaa"],
    ]);
    t.end();
  }
);

t.test(
  "03.07  -  ADD() - combo of third arg merging and extending previous range (default)",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2);
    ranges.add(2, 4, "zzz");
    t.same(ranges.current(), [[1, 4, "zzz"]]);
    t.end();
  }
);

t.test(
  "03.08  -  ADD() - v1.1.0 - do not merge add-only entries with deletion entries case #1",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 3);
    ranges.add(4, 10);
    ranges.add(3, 3, "zzz");
    t.same(ranges.current(), [
      [1, 3, "zzz"],
      [4, 10],
    ]);
    t.end();
  }
);

t.test(
  "03.09  -  ADD() - v2.1.0 - overlapping ranges discard their inner range to-add values",
  (t) => {
    const ranges = new Ranges();
    ranges.add(5, 6, " ");
    ranges.add(1, 10);
    t.same(ranges.current(), [[1, 10]]);
    t.end();
  }
);

t.test("03.10  -  ADD() - adds third argument with null", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, null);
  ranges.add(5, 6);
  t.same(ranges.current(), [
    [1, 2],
    [3, 4, null],
    [5, 6],
  ]);
  t.end();
});

t.test(
  "03.11  -  ADD() - pushing whole .current() output of another ranges class",
  (t) => {
    const ranges1 = new Ranges();
    ranges1.add(5, 6, " ");
    ranges1.push(1, 10);

    const ranges2 = new Ranges();
    ranges2.push(2, 8);
    ranges2.add(5, 12);

    ranges1.push(ranges2.current());

    t.same(ranges1.current(), [[1, 12]]);
    t.end();
  }
);

t.test("03.12  -  ADD() - empty string to add", (t) => {
  const ranges1 = new Ranges();
  ranges1.add(1, 2, "");
  t.same(ranges1.current(), [[1, 2]]);
  t.end();
});

t.test("03.13  -  ADD() - empty string to add", (t) => {
  const ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add(1, 2, "");
  t.same(ranges2.current(), [[1, 2]]);
  t.end();
});

t.test("03.14  -  ADD() - empty string to add", (t) => {
  const ranges3 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges3.add(1, 2, "");
  ranges3.add(1, 2, "");
  t.same(ranges3.current(), [[1, 2]]);
  t.end();
});

t.test("03.15  -  ADD() - empty string to add", (t) => {
  const ranges4 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges4.add(1, 2, "");
  ranges4.add(3, 4, "");
  t.same(ranges4.current(), [
    [1, 2],
    [3, 4],
  ]);
  t.end();
});

t.test("03.16  -  ADD() - leading/trailing spaces in the third arg.", (t) => {
  const ranges = new Ranges();
  ranges.add("1", "2", "a");
  ranges.add("2", "2", " click here ");
  ranges.add("2", "3", "b");
  t.same(ranges.current(), [[1, 3, "a click here b"]]);
  t.end();
});

t.test("03.17  -  ADD() - leading/trailing spaces in the third arg.", (t) => {
  const ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add("1", "2", "a");
  ranges2.add("2", "2", " click here ");
  ranges2.add("2", "3", "b");
  t.same(ranges2.current(), [[1, 3, "a click here b"]]);
  t.end();
});

t.test("03.18  -  ADD() - whole ranges array is pushed", (t) => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();

  ranges1.add(1, 2);
  ranges1.add(3, 4);

  ranges2.push(5, 6);
  ranges2.push(ranges1.current());
  t.same(ranges2.current(), [
    [1, 2],
    [3, 4],
    [5, 6],
  ]);
  t.end();
});

t.test("03.19  -  ADD() - empty array is pushed", (t) => {
  const ranges1 = new Ranges();
  ranges1.push([]);
  t.equal(ranges1.current(), null);
  t.end();
});

t.test("03.20  -  ADD() - null is pushed", (t) => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();
  ranges1.push(ranges2.current());
  t.equal(ranges1.current(), null);
  t.equal(ranges1.current(), null);
  t.end();
});

t.test("03.21  -  ADD() - clashing third argument, mergeType === 1", (t) => {
  const ranges1 = new Ranges();
  ranges1.add(0, 5, "a");
  ranges1.add(0, 5, "b");
  t.same(ranges1.current(), [[0, 5, "ab"]]);
  t.end();
});

t.test("03.22  -  ADD() - clashing third argument, mergeType === 1", (t) => {
  // hardcoded default:
  const ranges2 = new Ranges({
    mergeType: 1,
  });
  ranges2.add(0, 5, "a");
  ranges2.add(0, 5, "b");
  t.same(ranges2.current(), [[0, 5, "ab"]]);
  t.end();
});

t.test("03.23  -  ADD() - clashing third argument, mergeType === 2", (t) => {
  const ranges = new Ranges({
    mergeType: 2,
  });
  ranges.add(0, 5, "a");
  ranges.add(0, 5, "b");
  t.same(ranges.current(), [[0, 5, "b"]]);
  t.end();
});

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

t.test("04.01  -  CURRENT() - calling on blank yields null", (t) => {
  const ranges = new Ranges();
  t.same(ranges.current(), null);
  t.end();
});

t.test(
  "04.02  -  CURRENT() - multiple calls on the same should yield the same",
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
    t.same(ranges.current(), [
      [7, 14],
      [24, 28, " "],
      [29, 31],
    ]);
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

t.test("05.01  -  WIPE() - wipes correctly", (t) => {
  const ranges = new Ranges();
  ranges.add(10, 10, "aaa");
  ranges.wipe();
  ranges.add(1, 2, "bbb");
  t.same(ranges.current(), [[1, 2, "bbb"]]);
  t.end();
});

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

t.test("06.01  -  LAST() - fetches the last range from empty", (t) => {
  const ranges = new Ranges();
  t.same(ranges.last(), null);
  t.end();
});

t.test("06.02  -  LAST() - fetches the last range from non-empty", (t) => {
  const ranges = new Ranges();
  ranges.add(1, 2, "bbb");
  t.same(ranges.last(), [1, 2, "bbb"]);
  t.end();
});

// -----------------------------------------------------------------------------
// 07. opts.limitToBeAddedWhitespace
// -----------------------------------------------------------------------------

t.test("07.01  -  opts.limitToBeAddedWhitespace - spaces grouped - #1", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " ");
  ranges.add(2, 4, "   ");
  t.same(ranges.current(), [[1, 4, " "]], "07.01 - both with spaces only");
  t.end();
});

t.test("07.02  -  opts.limitToBeAddedWhitespace - spaces grouped - #2", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "   ");
  t.same(ranges.current(), [[1, 4, " "]], "07.02 - with tabs");
  t.end();
});

t.test("07.03  -  opts.limitToBeAddedWhitespace - spaces grouped - #3", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2);
  ranges.add(2, 4, "   ");
  t.same(ranges.current(), [[1, 4, " "]], "07.03 - first slice has none");
  t.end();
});

t.test("07.04  -  opts.limitToBeAddedWhitespace - spaces grouped - #4", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "   ");
  t.same(ranges.current(), [[1, 4, " "]], "07.04 - first slice has empty str");
  t.end();
});

t.test("07.05  -  opts.limitToBeAddedWhitespace - spaces grouped - #5", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, " \t\t\t        ");
  t.same(
    ranges.current(),
    [[1, 4, " "]],
    "07.05 - first empty second with tabs"
  );
  t.end();
});

t.test("07.06  -  opts.limitToBeAddedWhitespace - spaces grouped - #6", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4);
  t.same(ranges.current(), [[1, 4, " "]], "07.06 - second slice has none");
  t.end();
});

t.test("07.07  -  opts.limitToBeAddedWhitespace - spaces grouped - #7", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4, "");
  t.same(ranges.current(), [[1, 4, " "]], "07.07 - first slice has empty str");
  t.end();
});

t.test("07.08  -  opts.limitToBeAddedWhitespace - spaces grouped - #8", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "");
  t.same(
    ranges.current(),
    [[1, 4, " "]],
    "07.08 - first empty second with tabs"
  );
  t.end();
});

t.test("07.09  -  opts.limitToBeAddedWhitespace - linebreaks - #1", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "    ");
  t.same(
    ranges.current(),
    [[1, 4, "\n"]],
    "07.09 - only 1st-one has line break"
  );
  t.end();
});

t.test("07.10  -  opts.limitToBeAddedWhitespace - linebreaks - #2", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "  \n  ");
  t.same(ranges.current(), [[1, 4, "\n"]], "07.10 - both have \\n");
  t.end();
});

t.test("07.11  -  opts.limitToBeAddedWhitespace - linebreaks - #3", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "  \n  ");
  t.same(ranges.current(), [[1, 4, "\n"]]);
  t.end();
});

t.test("07.12  -  opts.limitToBeAddedWhitespace - linebreaks - #4", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "");
  t.same(ranges.current(), [[1, 4]]);
  t.end();
});

t.test(
  "07.13  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true });
    ranges.add(1, 2, null);
    ranges.add(2, 4, " z  ");
    t.same(ranges.current(), [[1, 4, null]]);
    t.end();
  }
);

t.test(
  "07.14  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true });
    ranges.add(1, 2, "   ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, null);
    t.same(ranges.current(), [[1, 4, null]]);
    t.end();
  }
);

t.test(
  "07.15  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1",
  (t) => {
    const ranges = new Ranges(); // <---- no opts
    ranges.add(1, 2, null);
    ranges.add(2, 4, " z  ");
    ranges.add(10, 20, " x  ");
    t.same(
      ranges.current(),
      [
        [1, 4, null],
        [10, 20, " x  "],
      ],
      "07.15 - no opts"
    );
    t.end();
  }
);

t.test(
  "07.16  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2",
  (t) => {
    const ranges = new Ranges(); // <---- no opts
    ranges.add(1, 2, "   ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, null);
    t.same(ranges.current(), [[1, 4, null]]);
    t.end();
  }
);

t.test(
  "07.17  -  opts.limitToBeAddedWhitespace - null wipes third arg values",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2, "aaa");
    ranges.add(2, 4, "zzz");
    ranges.add(1, 6, null);
    t.same(ranges.current(), [[1, 6, null]]);
    t.end();
  }
);

t.test(
  "07.18  -  opts.limitToBeAddedWhitespace - adds two non-overlapping ranges",
  (t) => {
    const ranges = new Ranges();
    ranges.add(1, 2);
    ranges.add(3, 4);
    t.same(ranges.current(), [
      [1, 2],
      [3, 4],
    ]);
    t.end();
  }
);

t.test(
  "07.19  -  opts.limitToBeAddedWhitespace - leading whitespace - control",
  (t) => {
    const ranges = new Ranges(); // <---- no opts
    ranges.add(1, 2, "   ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, " ");
    t.same(ranges.current(), [[1, 4, "   z "]]);
    t.end();
  }
);

t.test(
  "07.20  -  opts.limitToBeAddedWhitespace - leading whitespace #1",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
    ranges.add(1, 2, "   ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, " ");
    t.same(ranges.current(), [[1, 4, " z "]]);
    t.end();
  }
);

t.test(
  "07.21  -  opts.limitToBeAddedWhitespace - leading whitespace #2",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
    ranges.add(1, 2, " \n  ");
    ranges.add(2, 3, "z");
    ranges.add(2, 4, " ");
    t.same(ranges.current(), [[1, 4, "\nz "]]);
    t.end();
  }
);

t.test(
  "07.22  -  opts.limitToBeAddedWhitespace - leading whitespace #3",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
    ranges.add(4, 4, null);
    ranges.add(7, 14, " ");
    ranges.add(7, 11);
    ranges.add(14, 14, ' alt=""');
    t.same(ranges.current(), [
      [4, 4, null],
      [7, 14, ' alt=""'],
    ]);
    t.end();
  }
);

t.test("07.23  -  opts.limitToBeAddedWhitespace - nbsp replacement", (t) => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: false });
  ranges.add(1, 2, " ");
  ranges.add(2, 3, nbsp);
  ranges.add(3, 4, " ");
  t.same(ranges.current(), [[1, 4, ` ${nbsp} `]]);
  t.end();
});

t.test(
  "07.24  -  opts.limitToBeAddedWhitespace - inserting a raw nbsp",
  (t) => {
    const ranges = new Ranges({ limitToBeAddedWhitespace: true });
    ranges.add(1, 2, nbsp);
    t.same(ranges.current(), [[1, 2, nbsp]]);
    t.end();
  }
);

// -----------------------------------------------------------------------------
// 08. opts.limitLinebreaksCount
// -----------------------------------------------------------------------------

t.test("08.01  -  opts.limitLinebreaksCount #1 - control", (t) => {
  const ranges = new Ranges(); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  t.same(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\n\n\n alt=""'],
    ],
    "08.01"
  );
  t.end();
});

t.test("08.02  -  opts.limitLinebreaksCount #2 - hardcoded defaults", (t) => {
  const ranges = new Ranges({ limitLinebreaksCount: 1 }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  t.same(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\n\n\n alt=""'],
    ],
    "08.02"
  );
  t.end();
});

t.test("08.03  -  opts.limitLinebreaksCount #3 - hardcoded defaults", (t) => {
  const ranges = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 1,
  }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, 'alt=""');
  t.same(ranges.current(), [
    [4, 4, null],
    [7, 14, '\nalt=""'],
  ]);
  t.end();
});

t.only("08.04  -  opts.limitLinebreaksCount #4 - hardcoded defaults", (t) => {
  const ranges = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2,
  }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, 'alt=""');
  t.same(ranges.current(), [
    [4, 4, null],
    [7, 14, '\n\nalt=""'],
  ]);
  t.end();
});

// -----------------------------------------------------------------------------
// 09. replace()
// -----------------------------------------------------------------------------

t.test("09.01  -  REPLACE() - replaces ranges with ranges", (t) => {
  const oldRanges = new Ranges();
  const newRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.same(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "09.01.01"
  );

  newRanges.add(5, 6, "x");
  newRanges.add(7, 8, "y");
  newRanges.add(11, 12);
  // first, ensure it's been assembled correctly:
  t.same(
    newRanges.current(),
    [
      [5, 6, "x"],
      [7, 8, "y"],
      [11, 12],
    ],
    "09.01.02"
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  t.same(
    oldRanges.current(),
    [
      [5, 6, "x"],
      [7, 8, "y"],
      [11, 12],
    ],
    "09.01.03"
  );
  t.end();
});

t.test("09.02  -  REPLACE() - replaces ranges with null", (t) => {
  const oldRanges = new Ranges();
  const newRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.same(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "09.02.01"
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  t.same(oldRanges.current(), null);
  t.end();
});

t.test("09.03  -  REPLACE() - replaces ranges with empty array", (t) => {
  const oldRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.same(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "09.03.01"
  );

  // replace:
  oldRanges.replace([]);

  // ensure oldRanges is now same as newRanges:
  t.same(oldRanges.current(), null);
  t.end();
});

t.test(
  "09.04  -  REPLACE() - replaces ranges with single range (throws)",
  (t) => {
    const oldRanges = new Ranges();
    oldRanges.add(1, 2, "a");
    oldRanges.add(3, 4, "b");
    oldRanges.add(9, 10);

    // without third element, "what to insert"
    const error1 = t.throws(() => {
      oldRanges.replace([6, 8]);
    });
    t.match(error1.message, /THROW_ID_11/);

    // with third element, "what to insert"
    const error2 = t.throws(() => {
      oldRanges.replace([6, 8, "zzz"]);
    });
    t.match(error2.message, /THROW_ID_11/);

    // but range or ranges does work fine:
    oldRanges.replace([[6, 8, "zzz"]]);
    t.same(oldRanges.current(), [[6, 8, "zzz"]]);
    t.end();
  }
);
