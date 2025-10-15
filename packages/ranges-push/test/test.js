import { test } from "uvu";
/* eslint-disable @typescript-eslint/no-unused-vars */
import { equal, is, ok, throws, type, not, match } from "uvu/assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const nbsp = "\xA0";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01 - ADD() - empty call", () => {
  // missing
  let ranges = new Ranges();
  ranges.add();
  equal(ranges.current(), null, "01.01");
});

test("02 - ADD() - two hardcoded undefined args", () => {
  let ranges = new Ranges();
  ranges.add(undefined, undefined);
  equal(ranges.current(), null, "02.01");
});

test("03 - ADD() - three hardcoded undefined args", () => {
  let ranges = new Ranges();
  ranges.add(undefined, undefined, undefined);
  equal(ranges.current(), null, "03.01");
});

test("04 - ADD() - two null args", () => {
  let ranges = new Ranges();
  ranges.add(null, null);
  equal(ranges.current(), null, "04.01");
});

test("05 - ADD() - three null args", () => {
  let ranges = new Ranges();
  ranges.add(null, null, null);
  equal(ranges.current(), null, "05.01");
});

test("06 - ADD() - wrong input args", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add("a");
    },
    /THROW_ID_12/g,
    "06.01",
  );
});

test("07 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add("a", "a");
    },
    /THROW_ID_09/g,
    "07.01",
  );
});

test("08 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1, "a");
    },
    /THROW_ID_10/g,
    "08.01",
  );
});

test("09 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add("a", 1);
    },
    /THROW_ID_09/g,
    "09.01",
  );
});

test("10 - ADD() - wrong input args", () => {
  not.throws(() => {
    let ranges = new Ranges();
    ranges.add(1, 1);
  }, "10.01");
});

test("11 - ADD() - wrong input args", () => {
  // numbers but not natural integers
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1.2, 1);
    },
    /THROW_ID_09/g,
    "11.01",
  );
});

test("12 - ADD() - wrong input args", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1, 1.3);
    },
    /THROW_ID_10/,
    "12.01",
  );
});

test("13 - ADD() - third input arg is not string", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, 3);
  equal(ranges.current(), [[1, 2, 3]], "13.01");
});

test("14 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a");
    },
    /THROW_ID_12/,
    "14.01",
  );
});

test("15 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a", "a");
    },
    /THROW_ID_09/,
    "15.01",
  );
});

test("16 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, "a");
    },
    /THROW_ID_10/,
    "16.01",
  );
});

test("17 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a", 1);
    },
    /THROW_ID_09/,
    "17.01",
  );
});

test("18 - PUSH() - wrong inputs", () => {
  not.throws(() => {
    let ranges = new Ranges();
    ranges.push(1, 1);
  }, "18.01");
});

test("19 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(undefined, 1);
    },
    /THROW_ID_13/,
    "19.01",
  );
});

test("20 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(null, 1);
    },
    /THROW_ID_13/,
    "20.01",
  );
});

test("21 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, undefined);
    },
    /THROW_ID_12/,
    "21.01",
  );
});

test("22 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, null);
    },
    /THROW_ID_12/,
    "22.01",
  );
});

test("23 - PUSH() - numbers but not natural integers", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1.2, 1);
    },
    /THROW_ID_09/,
    "23.01",
  );
});

test("24 - PUSH() - numbers but not natural integers", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, 1.3);
    },
    /THROW_ID_10/,
    "24.01",
  );
});

test("25 - ADD() - third arg can be number", () => {
  let ranges = new Ranges();
  ranges.add([[1, 2, 3]]);
  ranges.add([[4, 5, "6"]]);
  ranges.add([[7, 8, 9]]);
  equal(
    ranges.current(),
    [
      [1, 2, 3],
      [4, 5, "6"],
      [7, 8, 9],
    ],
    "25.01",
  );
});

test("26 - ADD() - third arg clashes, num vs str, #1", () => {
  let ranges = new Ranges();
  ranges.add([[1, 2, 0]]);
  ranges.add([[1, 2, "9"]]);
  equal(ranges.current(), [[1, 2, "09"]], "26.01");
});

test("27 - ADD() - third arg clashes, num vs str, #2", () => {
  let ranges = new Ranges();
  ranges.add([[1, 2, "9"]]);
  ranges.add([[1, 2, 0]]);
  equal(ranges.current(), [[1, 2, "90"]], "27.01");
});

test("28 - ADD() - third arg, #3", () => {
  let ranges = new Ranges();
  ranges.add([[1, 2, 9]]);
  ranges.add([[1, 2]]);
  equal(ranges.current(), [[1, 2, 9]], "28.01");
});

test("29 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([[1, "z"]]);
    },
    /THROW_ID_10/,
    "29.01",
  );
});

test("30 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([["z", 1]]);
    },
    /THROW_ID_09/,
    "30.01",
  );
});

test("31 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([["z", 1], 1]);
    },
    /THROW_ID_09/,
    "31.01",
  );
});

test("32 - ADD() - null being pushed", () => {
  let ranges1 = new Ranges();
  let ranges2 = new Ranges();
  equal(ranges1.current(), null, "32.01");
  ranges2.push(ranges1.current());
  equal(ranges2.current(), null, "32.02");
});

// -----------------------------------------------------------------------------
// 02. BAU - no adding string, only ranges for deletion
// -----------------------------------------------------------------------------

test("33 - ADD() - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "33.01",
  );
});

test("34 - ADD() - adds two overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(0, 5, undefined);
  ranges.add(3, 9);
  equal(ranges.current(), [[0, 9]], "34.01");
});

test("35 - ADD() - extends range", () => {
  let ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(5, 9);
  equal(ranges.current(), [[1, 9]], "35.01");
});

test("36 - ADD() - new range bypasses the last range completely", () => {
  let ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(11, 15);
  ranges.add(6, 10);
  ranges.add(16, 20);
  ranges.add(10, 30);
  equal(
    ranges.current(),
    [
      [1, 5],
      [6, 30],
    ],
    "36.01",
  );
});

test("37 - ADD() - head and tail markers in new are smaller than last one's", () => {
  let ranges = new Ranges();
  ranges.add(10, 20);
  ranges.add(1, 5);
  equal(
    ranges.current(),
    [
      [1, 5],
      [10, 20],
    ],
    "37.01",
  );
});

test("38 - ADD() - same value in heads and tails", () => {
  let ranges1 = new Ranges();
  ranges1.add(1, 1);
  equal(ranges1.current(), null, "38.01");

  let ranges2 = new Ranges();
  ranges2.add(1, 1, "zzz");
  equal(ranges2.current(), [[1, 1, "zzz"]], "38.02");
});

test("39 - ADD() - same range again and again", () => {
  let ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10]], "39.01");
});

test("40 - ADD() - same range again and again, one had third arg", () => {
  let ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10, "zzz");
  ranges.add(1, 10);
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10, "zzz"]], "40.01");
});

test("41 - ADD() - inputs as numeric strings - all OK", () => {
  let ranges = new Ranges();
  ranges.add("1", "2");
  ranges.add("3", "4");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "41.01",
  );
});

test("42 - ADD() - wrong order is fine", () => {
  let ranges = new Ranges();
  ranges.add("3", "4");
  ranges.add("1", "2");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "42.01",
  );
});

test("43 - PUSH() - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.push(1, 2);
  ranges.push(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "43.01",
  );
});

test("44 - PUSH() - adds two overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(3, 9);
  equal(ranges.current(), [[0, 9]], "44.01");
});

test("45 - PUSH() - nulls, empty result", () => {
  let ranges = new Ranges();
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  equal(ranges.current(), null, "45.01");
});

test("46 - PUSH() - nulls, previous result retained", () => {
  let ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  equal(ranges.current(), [[0, 5]], "46.01");
});

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

test("47 - ADD() - adds a third argument, blank start", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, "zzz");
  equal(ranges.current(), [[1, 1, "zzz"]], "47.01");
});

test("48 - ADD() - adds a third argument, number", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, 9);
  equal(ranges.current(), [[1, 1, 9]], "48.01");
});

test("49 - ADD() - adds a third argument, fraction", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, 0.1);
  equal(ranges.current(), [[1, 1, 0.1]], "49.01");
});

test("50 - ADD() - adds a third argument, negative", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, -0.1);
  equal(ranges.current(), [[1, 1, -0.1]], "50.01");
});

test("51 - ADD() - adds a third argument onto existing and stops", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, "zzz");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4, "zzz"],
    ],
    "51.01",
  );
});

test("52 - ADD() - adds a third argument onto existing and adds more", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, "zzz");
  ranges.add(5, 6);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4, "zzz"],
      [5, 6],
    ],
    "52.01",
  );
});

test('53 - ADD() - existing "add" values get concatenated with incoming-ones', () => {
  let ranges = new Ranges();
  ranges.add(1, 2, "aaa");
  ranges.add(2, 4, "zzz");
  ranges.add(5, 6);
  equal(
    ranges.current(),
    [
      [1, 4, "aaazzz"],
      [5, 6],
    ],
    "53.01",
  );
});

test("54 - ADD() - jumped over values have third args and they get concatenated", () => {
  let ranges = new Ranges();
  ranges.add(6, 10);
  ranges.add(16, 20, "bbb");
  ranges.add(11, 15, "aaa");
  ranges.add(10, 30); // this superset range will wipe the `aaa` and `bbb` above
  ranges.add(1, 5);
  equal(
    ranges.current(),
    [
      [1, 5],
      [6, 30],
    ],
    "54.01",
  );
});

test("55 - ADD() - combo of third arg and jumping behind previous range", () => {
  let ranges = new Ranges();
  ranges.add(10, 11, "aaa");
  ranges.add(3, 4, "zzz");
  equal(
    ranges.current(),
    [
      [3, 4, "zzz"],
      [10, 11, "aaa"],
    ],
    "55.01",
  );
});

test("56 - ADD() - combo of third arg merging and extending previous range (default)", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(2, 4, "zzz");
  equal(ranges.current(), [[1, 4, "zzz"]], "56.01");
});

test("57 - ADD() - v1.1.0 - do not merge add-only entries with deletion entries case #1", () => {
  let ranges = new Ranges();
  ranges.add(1, 3);
  ranges.add(4, 10);
  ranges.add(3, 3, "zzz");
  equal(
    ranges.current(),
    [
      [1, 3, "zzz"],
      [4, 10],
    ],
    "57.01",
  );
});

test("58 - ADD() - v2.1.0 - overlapping ranges discard their inner range to-add values", () => {
  let ranges = new Ranges();
  ranges.add(5, 6, " ");
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10]], "58.01");
});

test("59 - ADD() - adds a third argument with null", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, null);
  ranges.add(5, 6);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4, null],
      [5, 6],
    ],
    "59.01",
  );
});

test("60 - ADD() - pushing whole .current() output of another ranges class", () => {
  let ranges1 = new Ranges();
  ranges1.add(5, 6, " ");
  ranges1.push(1, 10);

  let ranges2 = new Ranges();
  ranges2.push(2, 8);
  ranges2.add(5, 12);

  ranges1.push(ranges2.current());

  equal(ranges1.current(), [[1, 12]], "60.01");
});

test("61 - ADD() - empty string to add", () => {
  let ranges1 = new Ranges();
  ranges1.add(1, 2, "");
  equal(ranges1.current(), [[1, 2]], "61.01");
});

test("62 - ADD() - empty string to add", () => {
  let ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add(1, 2, "");
  equal(ranges2.current(), [[1, 2]], "62.01");
});

test("63 - ADD() - empty string to add", () => {
  let ranges3 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges3.add(1, 2, "");
  ranges3.add(1, 2, "");
  equal(ranges3.current(), [[1, 2]], "63.01");
});

test("64 - ADD() - empty string to add", () => {
  let ranges4 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges4.add(1, 2, "");
  ranges4.add(3, 4, "");
  equal(
    ranges4.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "64.01",
  );
});

test("65 - ADD() - leading/trailing spaces in the third arg.", () => {
  let ranges = new Ranges();
  ranges.add("1", "2", "a");
  ranges.add("2", "2", " click here ");
  ranges.add("2", "3", "b");
  equal(ranges.current(), [[1, 3, "a click here b"]], "65.01");
});

test("66 - ADD() - leading/trailing spaces in the third arg.", () => {
  let ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add("1", "2", "a");
  ranges2.add("2", "2", " click here ");
  ranges2.add("2", "3", "b");
  equal(ranges2.current(), [[1, 3, "a click here b"]], "66.01");
});

test("67 - ADD() - whole ranges array is pushed", () => {
  let ranges1 = new Ranges();
  let ranges2 = new Ranges();

  ranges1.add(1, 2);
  ranges1.add(3, 4);

  ranges2.push(5, 6);
  ranges2.push(ranges1.current());
  equal(
    ranges2.current(),
    [
      [1, 2],
      [3, 4],
      [5, 6],
    ],
    "67.01",
  );
});

test("68 - ADD() - empty array is pushed", () => {
  let ranges1 = new Ranges();
  ranges1.push([]);
  equal(ranges1.current(), null, "68.01");
});

test("69 - ADD() - null is pushed", () => {
  let ranges1 = new Ranges();
  let ranges2 = new Ranges();
  ranges1.push(ranges2.current());
  equal(ranges1.current(), null, "69.01");
  equal(ranges1.current(), null, "69.02");
});

test("70 - ADD() - clashing third argument, mergeType === 1", () => {
  let ranges1 = new Ranges();
  ranges1.add(0, 5, "a");
  ranges1.add(0, 5, "b");
  equal(ranges1.current(), [[0, 5, "ab"]], "70.01");
});

test("71 - ADD() - clashing third argument, mergeType === 1", () => {
  // hardcoded default:
  let ranges2 = new Ranges({
    mergeType: 1,
  });
  ranges2.add(0, 5, "a");
  ranges2.add(0, 5, "b");
  equal(ranges2.current(), [[0, 5, "ab"]], "71.01");
});

test("72 - ADD() - clashing third argument, mergeType === 2", () => {
  let ranges = new Ranges({
    mergeType: 2,
  });
  ranges.add(0, 5, "a");
  ranges.add(0, 5, "b");
  equal(ranges.current(), [[0, 5, "b"]], "72.01");
});

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

test("73 - CURRENT() - calling on blank yields null", () => {
  let ranges = new Ranges();
  equal(ranges.current(), null, "73.01");
});

test("74 - CURRENT() - multiple calls on the same should yield the same", () => {
  let ranges = new Ranges();
  ranges.add(7, 14);
  ranges.add(24, 28, " ");
  ranges.current();
  ranges.add(29, 31);
  ranges.current();
  ranges.current();
  ranges.current();
  ranges.current();
  equal(
    ranges.current(),
    [
      [7, 14],
      [24, 28, " "],
      [29, 31],
    ],
    "74.01",
  );
});

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

test("75 - WIPE() - wipes correctly", () => {
  let ranges = new Ranges();
  ranges.add(10, 10, "aaa");
  ranges.wipe();
  ranges.add(1, 2, "bbb");
  equal(ranges.current(), [[1, 2, "bbb"]], "75.01");
});

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

test("76 - LAST() - fetches the last range from empty", () => {
  let ranges = new Ranges();
  equal(ranges.last(), null, "76.01");
});

test("77 - LAST() - fetches the last range from non-empty", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, "bbb");
  equal(ranges.last(), [1, 2, "bbb"], "77.01");
});

// -----------------------------------------------------------------------------
// 07. opts.limitToBeAddedWhitespace
// -----------------------------------------------------------------------------

test("78 - opts.limitToBeAddedWhitespace - spaces grouped - #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " ");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "78.01");
});

test("79 - opts.limitToBeAddedWhitespace - spaces grouped - #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "79.01");
});

test("80 - opts.limitToBeAddedWhitespace - spaces grouped - #3", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2);
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "80.01");
});

test("81 - opts.limitToBeAddedWhitespace - spaces grouped - #4", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "81.01");
});

test("82 - opts.limitToBeAddedWhitespace - spaces grouped - #5", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, " \t\t\t        ");
  equal(ranges.current(), [[1, 4, " "]], "82.01");
});

test("83 - opts.limitToBeAddedWhitespace - spaces grouped - #6", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4);
  equal(ranges.current(), [[1, 4, " "]], "83.01");
});

test("84 - opts.limitToBeAddedWhitespace - spaces grouped - #7", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4, " "]], "84.01");
});

test("85 - opts.limitToBeAddedWhitespace - spaces grouped - #8", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4, " "]], "85.01");
});

test("86 - opts.limitToBeAddedWhitespace - linebreaks - #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "    ");
  equal(ranges.current(), [[1, 4, "\n"]], "86.01");
});

test("87 - opts.limitToBeAddedWhitespace - linebreaks - #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "  \n  ");
  equal(ranges.current(), [[1, 4, "\n"]], "87.01");
});

test("88 - opts.limitToBeAddedWhitespace - linebreaks - #3", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "  \n  ");
  equal(ranges.current(), [[1, 4, "\n"]], "88.01");
});

test("89 - opts.limitToBeAddedWhitespace - linebreaks - #4", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4]], "89.01");
});

test("90 - opts.limitToBeAddedWhitespace - null negates 3rd arg #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, null);
  ranges.add(2, 4, " z  ");
  equal(ranges.current(), [[1, 4, null]], "90.01");
});

test("91 - opts.limitToBeAddedWhitespace - null negates 3rd arg #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, null);
  equal(ranges.current(), [[1, 4, null]], "91.01");
});

test("92 - opts.limitToBeAddedWhitespace - null negates 3rd arg #1", () => {
  let ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, null);
  ranges.add(2, 4, " z  ");
  ranges.add(10, 20, " x  ");
  equal(
    ranges.current(),
    [
      [1, 4, null],
      [10, 20, " x  "],
    ],
    "92.01",
  );
});

test("93 - opts.limitToBeAddedWhitespace - null negates 3rd arg #2", () => {
  let ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, null);
  equal(ranges.current(), [[1, 4, null]], "93.01");
});

test("94 - opts.limitToBeAddedWhitespace - null wipes third arg values", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, "aaa");
  ranges.add(2, 4, "zzz");
  ranges.add(1, 6, null);
  equal(ranges.current(), [[1, 6, null]], "94.01");
});

test("95 - opts.limitToBeAddedWhitespace - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "95.01",
  );
});

test("96 - opts.limitToBeAddedWhitespace - leading whitespace - control", () => {
  let ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, "   z "]], "96.01");
});

test("97 - opts.limitToBeAddedWhitespace - leading whitespace #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, " z "]], "97.01");
});

test("98 - opts.limitToBeAddedWhitespace - leading whitespace #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(1, 2, " \n  ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, "\nz "]], "98.01");
});

test("99 - opts.limitToBeAddedWhitespace - leading whitespace #3", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, " ");
  ranges.add(7, 11);
  ranges.add(14, 14, ' alt=""');
  equal(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, ' alt=""'],
    ],
    "99.01",
  );
});

test("100 - opts.limitToBeAddedWhitespace - nbsp replacement", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: false });
  ranges.add(1, 2, " ");
  ranges.add(2, 3, nbsp);
  ranges.add(3, 4, " ");
  equal(ranges.current(), [[1, 4, ` ${nbsp} `]], "100.01");
});

test("101 - opts.limitToBeAddedWhitespace - inserting a raw nbsp", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, nbsp);
  equal(ranges.current(), [[1, 2, nbsp]], "101.01");
});

// -----------------------------------------------------------------------------
// 08. opts.limitLinebreaksCount
// -----------------------------------------------------------------------------

test("102 - opts.limitLinebreaksCount #1 - control", () => {
  let ranges = new Ranges(); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  equal(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\n\n\n alt=""'],
    ],
    "102.01",
  );
});

test("103 - opts.limitLinebreaksCount #2 - hardcoded defaults", () => {
  let ranges = new Ranges({ limitLinebreaksCount: 1 }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  equal(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\n\n\n alt=""'],
    ],
    "103.01",
  );
});

test("104 - opts.limitLinebreaksCount #3 - hardcoded defaults", () => {
  let ranges = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 1,
  }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, 'alt=""');
  equal(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\nalt=""'],
    ],
    "104.01",
  );
});

test("105 - opts.limitLinebreaksCount #4 - hardcoded defaults", () => {
  let ranges = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2,
  }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, 'alt=""');
  equal(
    ranges.current(),
    [
      [4, 4, null],
      [7, 14, '\n\nalt=""'],
    ],
    "105.01",
  );
});

// -----------------------------------------------------------------------------
// 09. replace()
// -----------------------------------------------------------------------------

test("106 - REPLACE() - replaces ranges with ranges", () => {
  let oldRanges = new Ranges();
  let newRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  equal(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "106.01",
  );

  newRanges.add(5, 6, "x");
  newRanges.add(7, 8, "y");
  newRanges.add(11, 12);
  // first, ensure it's been assembled correctly:
  equal(
    newRanges.current(),
    [
      [5, 6, "x"],
      [7, 8, "y"],
      [11, 12],
    ],
    "106.02",
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  equal(
    oldRanges.current(),
    [
      [5, 6, "x"],
      [7, 8, "y"],
      [11, 12],
    ],
    "106.03",
  );
});

test("107 - REPLACE() - replaces ranges with null", () => {
  let oldRanges = new Ranges();
  let newRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  equal(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "107.01",
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  equal(oldRanges.current(), null, "107.02");
});

test("108 - REPLACE() - replaces ranges with empty array", () => {
  let oldRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  equal(
    oldRanges.current(),
    [
      [1, 2, "a"],
      [3, 4, "b"],
      [9, 10],
    ],
    "108.01",
  );

  // replace:
  oldRanges.replace([]);

  // ensure oldRanges is now same as newRanges:
  equal(oldRanges.current(), null, "108.02");
});

test("109 - REPLACE() - replaces ranges with single range (throws)", () => {
  let oldRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);

  // without third element, "what to insert"
  throws(
    () => {
      oldRanges.replace([6, 8]);
    },
    /THROW_ID_11/,
    "109.01",
  );

  // with third element, "what to insert"
  throws(
    () => {
      oldRanges.replace([6, 8, "zzz"]);
    },
    /THROW_ID_11/,
    "109.02",
  );

  // but range or ranges does work fine:
  oldRanges.replace([[6, 8, "zzz"]]);
  equal(oldRanges.current(), [[6, 8, "zzz"]], "109.03");
});

test.run();
