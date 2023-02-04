import { test } from "uvu";
// eslint-disable-next-line no-unused-vars
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
    "06.01"
  );
});

test("07 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add("a", "a");
    },
    /THROW_ID_09/g,
    "07.01"
  );
});

test("08 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1, "a");
    },
    /THROW_ID_10/g,
    "08.01"
  );
});

test("09 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add("a", 1);
    },
    /THROW_ID_09/g,
    "09.01"
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
    "11.01"
  );
});

test("12 - ADD() - wrong input args", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1, 1.3);
    },
    /THROW_ID_10/,
    "12.01"
  );
});

test("13 - ADD() - third input arg is not string", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, 3);
  equal(ranges.current(), [[1, 2, "3"]], "13.01");
});

test("14 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a");
    },
    /THROW_ID_12/,
    "14.01"
  );
});

test("15 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a", "a");
    },
    /THROW_ID_09/,
    "15.01"
  );
});

test("16 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, "a");
    },
    /THROW_ID_10/,
    "16.01"
  );
});

test("17 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a", 1);
    },
    /THROW_ID_09/,
    "17.01"
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
    "19.01"
  );
});

test("20 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(null, 1);
    },
    /THROW_ID_13/,
    "20.01"
  );
});

test("21 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, undefined);
    },
    /THROW_ID_12/,
    "21.01"
  );
});

test("22 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, null);
    },
    /THROW_ID_12/,
    "22.01"
  );
});

test("23 - PUSH() - numbers but not natural integers", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1.2, 1);
    },
    /THROW_ID_09/,
    "23.01"
  );
});

test("24 - PUSH() - numbers but not natural integers", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, 1.3);
    },
    /THROW_ID_10/,
    "24.01"
  );
});

test("25 - ADD() - first argument is .current() output of ranges", () => {
  let ranges = new Ranges();
  ranges.add([[1, 2, 3]]);
  equal(ranges.current(), [[1, 2, "3"]], "25.01");
});

test("26 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([[1, "z"]]);
    },
    /THROW_ID_10/,
    "26.01"
  );
});

test("27 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([["z", 1]]);
    },
    /THROW_ID_09/,
    "27.01"
  );
});

test("28 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([["z", 1], 1]);
    },
    /THROW_ID_09/,
    "28.01"
  );
});

test("29 - ADD() - null being pushed", () => {
  let ranges1 = new Ranges();
  let ranges2 = new Ranges();
  equal(ranges1.current(), null, "29.01");
  ranges2.push(ranges1.current());
  equal(ranges2.current(), null, "29.02");
});

// -----------------------------------------------------------------------------
// 02. BAU - no adding string, only ranges for deletion
// -----------------------------------------------------------------------------

test("30 - ADD() - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "30.01"
  );
});

test("31 - ADD() - adds two overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(0, 5, undefined);
  ranges.add(3, 9);
  equal(ranges.current(), [[0, 9]], "31.01");
});

test("32 - ADD() - extends range", () => {
  let ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(5, 9);
  equal(ranges.current(), [[1, 9]], "32.01");
});

test("33 - ADD() - new range bypasses the last range completely", () => {
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
    "33.01"
  );
});

test("34 - ADD() - head and tail markers in new are smaller than last one's", () => {
  let ranges = new Ranges();
  ranges.add(10, 20);
  ranges.add(1, 5);
  equal(
    ranges.current(),
    [
      [1, 5],
      [10, 20],
    ],
    "34.01"
  );
});

test("35 - ADD() - same value in heads and tails", () => {
  let ranges1 = new Ranges();
  ranges1.add(1, 1);
  equal(ranges1.current(), null, "35.01");

  let ranges2 = new Ranges();
  ranges2.add(1, 1, "zzz");
  equal(ranges2.current(), [[1, 1, "zzz"]], "35.02");
});

test("36 - ADD() - same range again and again", () => {
  let ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10]], "36.01");
});

test("37 - ADD() - same range again and again, one had third arg", () => {
  let ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10, "zzz");
  ranges.add(1, 10);
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10, "zzz"]], "37.01");
});

test("38 - ADD() - inputs as numeric strings - all OK", () => {
  let ranges = new Ranges();
  ranges.add("1", "2");
  ranges.add("3", "4");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "38.01"
  );
});

test("39 - ADD() - wrong order is fine", () => {
  let ranges = new Ranges();
  ranges.add("3", "4");
  ranges.add("1", "2");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "39.01"
  );
});

test("40 - PUSH() - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.push(1, 2);
  ranges.push(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "40.01"
  );
});

test("41 - PUSH() - adds two overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(3, 9);
  equal(ranges.current(), [[0, 9]], "41.01");
});

test("42 - PUSH() - nulls, empty result", () => {
  let ranges = new Ranges();
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  equal(ranges.current(), null, "42.01");
});

test("43 - PUSH() - nulls, previous result retained", () => {
  let ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  equal(ranges.current(), [[0, 5]], "43.01");
});

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

test("44 - ADD() - adds third argument, blank start", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, "zzz");
  equal(ranges.current(), [[1, 1, "zzz"]], "44.01");
});

test("45 - ADD() - adds third argument onto existing and stops", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, "zzz");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4, "zzz"],
    ],
    "45.01"
  );
});

test("46 - ADD() - adds third argument onto existing and adds more", () => {
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
    "46.01"
  );
});

test('47 - ADD() - existing "add" values get concatenated with incoming-ones', () => {
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
    "47.01"
  );
});

test("48 - ADD() - jumped over values have third args and they get concatenated", () => {
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
    "48.01"
  );
});

test("49 - ADD() - combo of third arg and jumping behind previous range", () => {
  let ranges = new Ranges();
  ranges.add(10, 11, "aaa");
  ranges.add(3, 4, "zzz");
  equal(
    ranges.current(),
    [
      [3, 4, "zzz"],
      [10, 11, "aaa"],
    ],
    "49.01"
  );
});

test("50 - ADD() - combo of third arg merging and extending previous range (default)", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(2, 4, "zzz");
  equal(ranges.current(), [[1, 4, "zzz"]], "50.01");
});

test("51 - ADD() - v1.1.0 - do not merge add-only entries with deletion entries case #1", () => {
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
    "51.01"
  );
});

test("52 - ADD() - v2.1.0 - overlapping ranges discard their inner range to-add values", () => {
  let ranges = new Ranges();
  ranges.add(5, 6, " ");
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10]], "52.01");
});

test("53 - ADD() - adds third argument with null", () => {
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
    "53.01"
  );
});

test("54 - ADD() - pushing whole .current() output of another ranges class", () => {
  let ranges1 = new Ranges();
  ranges1.add(5, 6, " ");
  ranges1.push(1, 10);

  let ranges2 = new Ranges();
  ranges2.push(2, 8);
  ranges2.add(5, 12);

  ranges1.push(ranges2.current());

  equal(ranges1.current(), [[1, 12]], "54.01");
});

test("55 - ADD() - empty string to add", () => {
  let ranges1 = new Ranges();
  ranges1.add(1, 2, "");
  equal(ranges1.current(), [[1, 2]], "55.01");
});

test("56 - ADD() - empty string to add", () => {
  let ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add(1, 2, "");
  equal(ranges2.current(), [[1, 2]], "56.01");
});

test("57 - ADD() - empty string to add", () => {
  let ranges3 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges3.add(1, 2, "");
  ranges3.add(1, 2, "");
  equal(ranges3.current(), [[1, 2]], "57.01");
});

test("58 - ADD() - empty string to add", () => {
  let ranges4 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges4.add(1, 2, "");
  ranges4.add(3, 4, "");
  equal(
    ranges4.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "58.01"
  );
});

test("59 - ADD() - leading/trailing spaces in the third arg.", () => {
  let ranges = new Ranges();
  ranges.add("1", "2", "a");
  ranges.add("2", "2", " click here ");
  ranges.add("2", "3", "b");
  equal(ranges.current(), [[1, 3, "a click here b"]], "59.01");
});

test("60 - ADD() - leading/trailing spaces in the third arg.", () => {
  let ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add("1", "2", "a");
  ranges2.add("2", "2", " click here ");
  ranges2.add("2", "3", "b");
  equal(ranges2.current(), [[1, 3, "a click here b"]], "60.01");
});

test("61 - ADD() - whole ranges array is pushed", () => {
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
    "61.01"
  );
});

test("62 - ADD() - empty array is pushed", () => {
  let ranges1 = new Ranges();
  ranges1.push([]);
  equal(ranges1.current(), null, "62.01");
});

test("63 - ADD() - null is pushed", () => {
  let ranges1 = new Ranges();
  let ranges2 = new Ranges();
  ranges1.push(ranges2.current());
  equal(ranges1.current(), null, "63.01");
  equal(ranges1.current(), null, "63.02");
});

test("64 - ADD() - clashing third argument, mergeType === 1", () => {
  let ranges1 = new Ranges();
  ranges1.add(0, 5, "a");
  ranges1.add(0, 5, "b");
  equal(ranges1.current(), [[0, 5, "ab"]], "64.01");
});

test("65 - ADD() - clashing third argument, mergeType === 1", () => {
  // hardcoded default:
  let ranges2 = new Ranges({
    mergeType: 1,
  });
  ranges2.add(0, 5, "a");
  ranges2.add(0, 5, "b");
  equal(ranges2.current(), [[0, 5, "ab"]], "65.01");
});

test("66 - ADD() - clashing third argument, mergeType === 2", () => {
  let ranges = new Ranges({
    mergeType: 2,
  });
  ranges.add(0, 5, "a");
  ranges.add(0, 5, "b");
  equal(ranges.current(), [[0, 5, "b"]], "66.01");
});

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

test("67 - CURRENT() - calling on blank yields null", () => {
  let ranges = new Ranges();
  equal(ranges.current(), null, "67.01");
});

test("68 - CURRENT() - multiple calls on the same should yield the same", () => {
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
    "68.01"
  );
});

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

test("69 - WIPE() - wipes correctly", () => {
  let ranges = new Ranges();
  ranges.add(10, 10, "aaa");
  ranges.wipe();
  ranges.add(1, 2, "bbb");
  equal(ranges.current(), [[1, 2, "bbb"]], "69.01");
});

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

test("70 - LAST() - fetches the last range from empty", () => {
  let ranges = new Ranges();
  equal(ranges.last(), null, "70.01");
});

test("71 - LAST() - fetches the last range from non-empty", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, "bbb");
  equal(ranges.last(), [1, 2, "bbb"], "71.01");
});

// -----------------------------------------------------------------------------
// 07. opts.limitToBeAddedWhitespace
// -----------------------------------------------------------------------------

test("72 - opts.limitToBeAddedWhitespace - spaces grouped - #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " ");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "72.01");
});

test("73 - opts.limitToBeAddedWhitespace - spaces grouped - #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "73.01");
});

test("74 - opts.limitToBeAddedWhitespace - spaces grouped - #3", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2);
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "74.01");
});

test("75 - opts.limitToBeAddedWhitespace - spaces grouped - #4", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "75.01");
});

test("76 - opts.limitToBeAddedWhitespace - spaces grouped - #5", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, " \t\t\t        ");
  equal(ranges.current(), [[1, 4, " "]], "76.01");
});

test("77 - opts.limitToBeAddedWhitespace - spaces grouped - #6", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4);
  equal(ranges.current(), [[1, 4, " "]], "77.01");
});

test("78 - opts.limitToBeAddedWhitespace - spaces grouped - #7", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4, " "]], "78.01");
});

test("79 - opts.limitToBeAddedWhitespace - spaces grouped - #8", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4, " "]], "79.01");
});

test("80 - opts.limitToBeAddedWhitespace - linebreaks - #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "    ");
  equal(ranges.current(), [[1, 4, "\n"]], "80.01");
});

test("81 - opts.limitToBeAddedWhitespace - linebreaks - #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "  \n  ");
  equal(ranges.current(), [[1, 4, "\n"]], "81.01");
});

test("82 - opts.limitToBeAddedWhitespace - linebreaks - #3", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "  \n  ");
  equal(ranges.current(), [[1, 4, "\n"]], "82.01");
});

test("83 - opts.limitToBeAddedWhitespace - linebreaks - #4", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4]], "83.01");
});

test("84 - opts.limitToBeAddedWhitespace - null negates 3rd arg #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, null);
  ranges.add(2, 4, " z  ");
  equal(ranges.current(), [[1, 4, null]], "84.01");
});

test("85 - opts.limitToBeAddedWhitespace - null negates 3rd arg #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, null);
  equal(ranges.current(), [[1, 4, null]], "85.01");
});

test("86 - opts.limitToBeAddedWhitespace - null negates 3rd arg #1", () => {
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
    "86.01"
  );
});

test("87 - opts.limitToBeAddedWhitespace - null negates 3rd arg #2", () => {
  let ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, null);
  equal(ranges.current(), [[1, 4, null]], "87.01");
});

test("88 - opts.limitToBeAddedWhitespace - null wipes third arg values", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, "aaa");
  ranges.add(2, 4, "zzz");
  ranges.add(1, 6, null);
  equal(ranges.current(), [[1, 6, null]], "88.01");
});

test("89 - opts.limitToBeAddedWhitespace - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "89.01"
  );
});

test("90 - opts.limitToBeAddedWhitespace - leading whitespace - control", () => {
  let ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, "   z "]], "90.01");
});

test("91 - opts.limitToBeAddedWhitespace - leading whitespace #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, " z "]], "91.01");
});

test("92 - opts.limitToBeAddedWhitespace - leading whitespace #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(1, 2, " \n  ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, "\nz "]], "92.01");
});

test("93 - opts.limitToBeAddedWhitespace - leading whitespace #3", () => {
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
    "93.01"
  );
});

test("94 - opts.limitToBeAddedWhitespace - nbsp replacement", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: false });
  ranges.add(1, 2, " ");
  ranges.add(2, 3, nbsp);
  ranges.add(3, 4, " ");
  equal(ranges.current(), [[1, 4, ` ${nbsp} `]], "94.01");
});

test("95 - opts.limitToBeAddedWhitespace - inserting a raw nbsp", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, nbsp);
  equal(ranges.current(), [[1, 2, nbsp]], "95.01");
});

// -----------------------------------------------------------------------------
// 08. opts.limitLinebreaksCount
// -----------------------------------------------------------------------------

test("96 - opts.limitLinebreaksCount #1 - control", () => {
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
    "96.01"
  );
});

test("97 - opts.limitLinebreaksCount #2 - hardcoded defaults", () => {
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
    "97.01"
  );
});

test("98 - opts.limitLinebreaksCount #3 - hardcoded defaults", () => {
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
    "98.01"
  );
});

test("99 - opts.limitLinebreaksCount #4 - hardcoded defaults", () => {
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
    "99.01"
  );
});

// -----------------------------------------------------------------------------
// 09. replace()
// -----------------------------------------------------------------------------

test("100 - REPLACE() - replaces ranges with ranges", () => {
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
    "100.01"
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
    "100.02"
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
    "100.03"
  );
});

test("101 - REPLACE() - replaces ranges with null", () => {
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
    "101.01"
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  equal(oldRanges.current(), null, "101.02");
});

test("102 - REPLACE() - replaces ranges with empty array", () => {
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
    "102.01"
  );

  // replace:
  oldRanges.replace([]);

  // ensure oldRanges is now same as newRanges:
  equal(oldRanges.current(), null, "102.02");
});

test("103 - REPLACE() - replaces ranges with single range (throws)", () => {
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
    "103.01"
  );

  // with third element, "what to insert"
  throws(
    () => {
      oldRanges.replace([6, 8, "zzz"]);
    },
    /THROW_ID_11/,
    "103.02"
  );

  // but range or ranges does work fine:
  oldRanges.replace([[6, 8, "zzz"]]);
  equal(oldRanges.current(), [[6, 8, "zzz"]], "103.03");
});

test.run();
