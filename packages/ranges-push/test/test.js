// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { Ranges } from "../dist/ranges-push.esm.js";

const nbsp = "\xA0";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("001 - ADD() - empty call", () => {
  // missing
  let ranges = new Ranges();
  ranges.add();
  equal(ranges.current(), null, "001.01");
});

test("002 - ADD() - two hardcoded undefined args", () => {
  let ranges = new Ranges();
  ranges.add(undefined, undefined);
  equal(ranges.current(), null, "002.01");
});

test("003 - ADD() - three hardcoded undefined args", () => {
  let ranges = new Ranges();
  ranges.add(undefined, undefined, undefined);
  equal(ranges.current(), null, "003.01");
});

test("004 - ADD() - two null args", () => {
  let ranges = new Ranges();
  ranges.add(null, null);
  equal(ranges.current(), null, "004.01");
});

test("005 - ADD() - three null args", () => {
  let ranges = new Ranges();
  ranges.add(null, null, null);
  equal(ranges.current(), null, "005.01");
});

test("006 - ADD() - wrong input args", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add("a");
    },
    /THROW_ID_03/g,
    "06.01",
  );
});

test("007 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add("a", "a");
    },
    /THROW_ID_06/g,
    "07.01",
  );
});

test("008 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1, "a");
    },
    /THROW_ID_07/g,
    "08.01",
  );
});

test("009 - ADD() - wrong types", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add("a", 1);
    },
    /THROW_ID_06/g,
    "09.01",
  );
});

test("010 - ADD() - wrong input args", () => {
  not.throws(() => {
    let ranges = new Ranges();
    ranges.add(1, 1);
  }, "10.01");
});

test("011 - ADD() - wrong input args", () => {
  // numbers but not natural integers
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1.2, 1);
    },
    /THROW_ID_06/g,
    "11.01",
  );
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(-1, 1);
    },
    /THROW_ID_06/g,
    "11.02",
  );
});

test("012 - ADD() - wrong input args", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1, 1.3);
    },
    /THROW_ID_07/,
    "12.01",
  );
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add(1, -1);
    },
    /THROW_ID_07/,
    "12.02",
  );
});

test("013 - ADD() - third input arg is not string", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, 3);
  equal(ranges.current(), [[1, 2, 3]], "013.01");
});

test("014 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a");
    },
    /THROW_ID_03/,
    "14.01",
  );
});

test("015 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a", "a");
    },
    /THROW_ID_06/,
    "15.01",
  );
});

test("016 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, "a");
    },
    /THROW_ID_07/,
    "16.01",
  );
});

test("017 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push("a", 1);
    },
    /THROW_ID_06/,
    "17.01",
  );
});

test("018 - PUSH() - wrong inputs", () => {
  not.throws(() => {
    let ranges = new Ranges();
    ranges.push(1, 1);
  }, "18.01");
});

test("019 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(undefined, 1);
    },
    /THROW_ID_04/,
    "19.01",
  );
});

test("020 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(null, 1);
    },
    /THROW_ID_04/,
    "20.01",
  );
});

test("021 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, undefined);
    },
    /THROW_ID_03/,
    "21.01",
  );
});

test("022 - PUSH() - wrong inputs", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, null);
    },
    /THROW_ID_03/,
    "22.01",
  );
});

test("023 - PUSH() - numbers but not natural integers", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1.2, 1);
    },
    /THROW_ID_06/,
    "23.01",
  );
});

test("024 - PUSH() - numbers but not natural integers", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.push(1, 1.3);
    },
    /THROW_ID_07/,
    "24.01",
  );
});

test("025 - ADD() - third arg can be number", () => {
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
    "025.01",
  );
});

test("026 - ADD() - third arg clashes, num vs str, #1", () => {
  let ranges = new Ranges();
  ranges.add([[1, 2, 0]]);
  ranges.add([[1, 2, "9"]]);
  equal(ranges.current(), [[1, 2, "09"]], "026.01");
});

test("027 - ADD() - third arg clashes, num vs str, #2", () => {
  let ranges = new Ranges();
  ranges.add([[1, 2, "9"]]);
  ranges.add([[1, 2, 0]]);
  equal(ranges.current(), [[1, 2, "90"]], "027.01");
});

test("028 - ADD() - third arg, #3", () => {
  let ranges = new Ranges();
  ranges.add([[1, 2, 9]]);
  ranges.add([[1, 2]]);
  equal(ranges.current(), [[1, 2, 9]], "028.01");
});

test("029 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([[1, "z"]]);
    },
    /THROW_ID_07/,
    "29.01",
  );
});

test("030 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([["z", 1]]);
    },
    /THROW_ID_06/,
    "30.01",
  );
});

test("031 - ADD() - first argument is .current() output of ranges", () => {
  throws(
    () => {
      let ranges = new Ranges();
      ranges.add([["z", 1], 1]);
    },
    /THROW_ID_06/,
    "31.01",
  );
});

test("032 - ADD() - null being pushed", () => {
  let ranges1 = new Ranges();
  let ranges2 = new Ranges();
  equal(ranges1.current(), null, "032.01");
  ranges2.push(ranges1.current());
  equal(ranges2.current(), null, "032.02");
});

// -----------------------------------------------------------------------------
// 02. BAU - no adding string, only ranges for deletion
// -----------------------------------------------------------------------------

test("033 - ADD() - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "033.01",
  );
});

test("034 - ADD() - adds two overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(0, 5, undefined);
  ranges.add(3, 9);
  equal(ranges.current(), [[0, 9]], "034.01");
});

test("035 - ADD() - extends range", () => {
  let ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(5, 9);
  equal(ranges.current(), [[1, 9]], "035.01");
});

test("036 - ADD() - new range bypasses the last range completely", () => {
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
    "036.01",
  );
});

test("037 - ADD() - head and tail markers in new are smaller than last one's", () => {
  let ranges = new Ranges();
  ranges.add(10, 20);
  ranges.add(1, 5);
  equal(
    ranges.current(),
    [
      [1, 5],
      [10, 20],
    ],
    "037.01",
  );
});

test("038 - ADD() - same value in heads and tails", () => {
  let ranges1 = new Ranges();
  ranges1.add(1, 1);
  equal(ranges1.current(), null, "038.01");

  let ranges2 = new Ranges();
  ranges2.add(1, 1, "zzz");
  equal(ranges2.current(), [[1, 1, "zzz"]], "038.02");
});

test("039 - ADD() - same range again and again", () => {
  let ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10]], "039.01");
});

test("040 - ADD() - same range again and again, one had third arg", () => {
  let ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10, "zzz");
  ranges.add(1, 10);
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10, "zzz"]], "040.01");
});

test("041 - ADD() - inputs as numeric strings - all OK", () => {
  let ranges = new Ranges();
  ranges.add("1", "2");
  ranges.add("3", "4");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "041.01",
  );
});

test("042 - ADD() - wrong order is fine", () => {
  let ranges = new Ranges();
  ranges.add("3", "4");
  ranges.add("1", "2");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "042.01",
  );
});

test("043 - PUSH() - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.push(1, 2);
  ranges.push(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "043.01",
  );
});

test("044 - PUSH() - adds two overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(3, 9);
  equal(ranges.current(), [[0, 9]], "044.01");
});

test("045 - PUSH() - nulls, empty result", () => {
  let ranges = new Ranges();
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  equal(ranges.current(), null, "045.01");
});

test("046 - PUSH() - nulls, previous result retained", () => {
  let ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(null, null); // two
  ranges.push(null, null, null); // three
  equal(ranges.current(), [[0, 5]], "046.01");
});

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

test("047 - ADD() - adds a third argument, blank start", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, "zzz");
  equal(ranges.current(), [[1, 1, "zzz"]], "047.01");
});

test("048 - ADD() - adds a third argument, number", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, 9);
  equal(ranges.current(), [[1, 1, 9]], "048.01");
});

test("049 - ADD() - adds a third argument, fraction", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, 0.1);
  equal(ranges.current(), [[1, 1, 0.1]], "049.01");
});

test("050 - ADD() - adds a third argument, negative", () => {
  let ranges = new Ranges();
  ranges.add(1, 1, -0.1);
  equal(ranges.current(), [[1, 1, -0.1]], "050.01");
});

test("051 - ADD() - adds a third argument onto existing and stops", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, "zzz");
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4, "zzz"],
    ],
    "051.01",
  );
});

test("052 - ADD() - adds a third argument onto existing and adds more", () => {
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
    "052.01",
  );
});

test('053 - ADD() - existing "add" values get concatenated with incoming-ones', () => {
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
    "053.01",
  );
});

test("054 - ADD() - jumped over values have third args and they get concatenated", () => {
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
    "054.01",
  );
});

test("055 - ADD() - combo of third arg and jumping behind previous range", () => {
  let ranges = new Ranges();
  ranges.add(10, 11, "aaa");
  ranges.add(3, 4, "zzz");
  equal(
    ranges.current(),
    [
      [3, 4, "zzz"],
      [10, 11, "aaa"],
    ],
    "055.01",
  );
});

test("056 - ADD() - combo of third arg merging and extending previous range (default)", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(2, 4, "zzz");
  equal(ranges.current(), [[1, 4, "zzz"]], "056.01");
});

test("057 - ADD() - v1.1.0 - do not merge add-only entries with deletion entries case #1", () => {
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
    "057.01",
  );
});

test("058 - ADD() - v2.1.0 - overlapping ranges discard their inner range to-add values", () => {
  let ranges = new Ranges();
  ranges.add(5, 6, " ");
  ranges.add(1, 10);
  equal(ranges.current(), [[1, 10]], "058.01");
});

test("059 - ADD() - adds a third argument with null", () => {
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
    "059.01",
  );
});

test("060 - ADD() - pushing whole .current() output of another ranges class", () => {
  let ranges1 = new Ranges();
  ranges1.add(5, 6, " ");
  ranges1.push(1, 10);

  let ranges2 = new Ranges();
  ranges2.push(2, 8);
  ranges2.add(5, 12);

  ranges1.push(ranges2.current());

  equal(ranges1.current(), [[1, 12]], "060.01");
});

test("061 - ADD() - empty string to add", () => {
  let ranges1 = new Ranges();
  ranges1.add(1, 2, "");
  equal(ranges1.current(), [[1, 2]], "061.01");
});

test("062 - ADD() - empty string to add", () => {
  let ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add(1, 2, "");
  equal(ranges2.current(), [[1, 2]], "062.01");
});

test("063 - ADD() - empty string to add", () => {
  let ranges3 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges3.add(1, 2, "");
  ranges3.add(1, 2, "");
  equal(ranges3.current(), [[1, 2]], "063.01");
});

test("064 - ADD() - empty string to add", () => {
  let ranges4 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges4.add(1, 2, "");
  ranges4.add(3, 4, "");
  equal(
    ranges4.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "064.01",
  );
});

test("065 - ADD() - leading/trailing spaces in the third arg.", () => {
  let ranges = new Ranges();
  ranges.add("1", "2", "a");
  ranges.add("2", "2", " click here ");
  ranges.add("2", "3", "b");
  equal(ranges.current(), [[1, 3, "a click here b"]], "065.01");
});

test("066 - ADD() - leading/trailing spaces in the third arg.", () => {
  let ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add("1", "2", "a");
  ranges2.add("2", "2", " click here ");
  ranges2.add("2", "3", "b");
  equal(ranges2.current(), [[1, 3, "a click here b"]], "066.01");
});

test("067 - ADD() - whole ranges array is pushed", () => {
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
    "067.01",
  );
});

test("068 - ADD() - empty array is pushed", () => {
  let ranges1 = new Ranges();
  ranges1.push([]);
  equal(ranges1.current(), null, "068.01");
});

test("069 - ADD() - null is pushed", () => {
  let ranges1 = new Ranges();
  let ranges2 = new Ranges();
  ranges1.push(ranges2.current());
  equal(ranges1.current(), null, "069.01");
  equal(ranges1.current(), null, "069.02");
});

test("070 - ADD() - clashing third argument, mergeType === 1", () => {
  let ranges1 = new Ranges();
  ranges1.add(0, 5, "a");
  ranges1.add(0, 5, "b");
  equal(ranges1.current(), [[0, 5, "ab"]], "070.01");
});

test("071 - ADD() - clashing third argument, mergeType === 1", () => {
  // hardcoded default:
  let ranges2 = new Ranges({
    mergeType: 1,
  });
  ranges2.add(0, 5, "a");
  ranges2.add(0, 5, "b");
  equal(ranges2.current(), [[0, 5, "ab"]], "071.01");
});

test("072 - ADD() - clashing third argument, mergeType === 2", () => {
  let ranges = new Ranges({
    mergeType: 2,
  });
  ranges.add(0, 5, "a");
  ranges.add(0, 5, "b");
  equal(ranges.current(), [[0, 5, "b"]], "072.01");
});

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

test("073 - CURRENT() - calling on blank yields null", () => {
  let ranges = new Ranges();
  equal(ranges.current(), null, "073.01");
});

test("074 - CURRENT() - multiple calls on the same should yield the same", () => {
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
    "074.01",
  );
});

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

test("075 - WIPE() - wipes correctly", () => {
  let ranges = new Ranges();
  ranges.add(10, 10, "aaa");
  ranges.wipe();
  ranges.add(1, 2, "bbb");
  equal(ranges.current(), [[1, 2, "bbb"]], "075.01");
});

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

test("076 - LAST() - fetches the last range from empty", () => {
  let ranges = new Ranges();
  equal(ranges.last(), null, "076.01");
});

test("077 - LAST() - fetches the last range from non-empty", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, "bbb");
  equal(ranges.last(), [1, 2, "bbb"], "077.01");
});

// -----------------------------------------------------------------------------
// 07. opts.limitToBeAddedWhitespace
// -----------------------------------------------------------------------------

test("078 - opts.limitToBeAddedWhitespace - spaces grouped - #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " ");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "078.01");
});

test("079 - opts.limitToBeAddedWhitespace - spaces grouped - #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "079.01");
});

test("080 - opts.limitToBeAddedWhitespace - spaces grouped - #3", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2);
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "080.01");
});

test("081 - opts.limitToBeAddedWhitespace - spaces grouped - #4", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "   ");
  equal(ranges.current(), [[1, 4, " "]], "081.01");
});

test("082 - opts.limitToBeAddedWhitespace - spaces grouped - #5", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, " \t\t\t        ");
  equal(ranges.current(), [[1, 4, " "]], "082.01");
});

test("083 - opts.limitToBeAddedWhitespace - spaces grouped - #6", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4);
  equal(ranges.current(), [[1, 4, " "]], "083.01");
});

test("084 - opts.limitToBeAddedWhitespace - spaces grouped - #7", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4, " "]], "084.01");
});

test("085 - opts.limitToBeAddedWhitespace - spaces grouped - #8", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4, " "]], "085.01");
});

test("086 - opts.limitToBeAddedWhitespace - linebreaks - #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "    ");
  equal(ranges.current(), [[1, 4, "\n"]], "086.01");
});

test("087 - opts.limitToBeAddedWhitespace - linebreaks - #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "  \n  ");
  equal(ranges.current(), [[1, 4, "\n"]], "087.01");
});

test("088 - opts.limitToBeAddedWhitespace - linebreaks - #3", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "  \n  ");
  equal(ranges.current(), [[1, 4, "\n"]], "088.01");
});

test("089 - opts.limitToBeAddedWhitespace - linebreaks - #4", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "");
  equal(ranges.current(), [[1, 4]], "089.01");
});

test("090 - opts.limitToBeAddedWhitespace - null negates 3rd arg #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, null);
  ranges.add(2, 4, " z  ");
  equal(ranges.current(), [[1, 4, null]], "090.01");
});

test("091 - opts.limitToBeAddedWhitespace - null negates 3rd arg #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, null);
  equal(ranges.current(), [[1, 4, null]], "091.01");
});

test("092 - opts.limitToBeAddedWhitespace - null negates 3rd arg #1", () => {
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
    "092.01",
  );
});

test("093 - opts.limitToBeAddedWhitespace - null negates 3rd arg #2", () => {
  let ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, null);
  equal(ranges.current(), [[1, 4, null]], "093.01");
});

test("094 - opts.limitToBeAddedWhitespace - null wipes third arg values", () => {
  let ranges = new Ranges();
  ranges.add(1, 2, "aaa");
  ranges.add(2, 4, "zzz");
  ranges.add(1, 6, null);
  equal(ranges.current(), [[1, 6, null]], "094.01");
});

test("095 - opts.limitToBeAddedWhitespace - adds two non-overlapping ranges", () => {
  let ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "095.01",
  );
});

test("096 - opts.limitToBeAddedWhitespace - leading whitespace - control", () => {
  let ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, "   z "]], "096.01");
});

test("097 - opts.limitToBeAddedWhitespace - leading whitespace #1", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, " z "]], "097.01");
});

test("098 - opts.limitToBeAddedWhitespace - leading whitespace #2", () => {
  let ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(1, 2, " \n  ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  equal(ranges.current(), [[1, 4, "\nz "]], "098.01");
});

test("099 - opts.limitToBeAddedWhitespace - leading whitespace #3", () => {
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
    "099.01",
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
    /THROW_ID_09/,
    "109.01",
  );

  // with third element, "what to insert"
  throws(
    () => {
      oldRanges.replace([6, 8, "zzz"]);
    },
    /THROW_ID_09/,
    "109.02",
  );

  // but range or ranges does work fine:
  oldRanges.replace([[6, 8, "zzz"]]);
  equal(oldRanges.current(), [[6, 8, "zzz"]], "109.01");
});

test("110 - constructor rejects non-object options", () => {
  throws(() => new Ranges("1"), /THROW_ID_01/, "110.01");
});

test("111 - constructor normalises and validates mergeType", () => {
  const ranges = new Ranges({ mergeType: "2" });
  ranges.add(1, 2, "a");
  ranges.add(1, 3, "b");
  equal(ranges.current(), [[1, 3, "b"]], "111.01");

  const mergeTypeOneRanges = new Ranges({ mergeType: "1" });
  mergeTypeOneRanges.add(1, 2, "a");
  mergeTypeOneRanges.add(1, 3, "b");
  equal(mergeTypeOneRanges.current(), [[1, 3, "ab"]], "111.02");

  throws(() => new Ranges({ mergeType: "3" }), /THROW_ID_02/, "111.03");
});

test("112 - ADD() ignores non-range items in a ranges array", () => {
  const ranges = new Ranges();
  ranges.add([null, [1, 2], "not a range", [3, 4]]);
  equal(
    ranges.current(),
    [
      [1, 2],
      [3, 4],
    ],
    "112.01",
  );
});

// -----------------------------------------------------------------------------
// 10. firstCovers()
// -----------------------------------------------------------------------------

test("113 - FIRSTCOVERS() - nothing gathered yet", () => {
  const ranges = new Ranges();
  equal(ranges.firstCovers(0), false, "113.01");
  equal(ranges.firstCovers(5), false, "113.02");

  // an add() which gathers nothing leaves it answering the same way
  ranges.add(null, null);
  equal(ranges.firstCovers(0), false, "113.03");
});

test("114 - FIRSTCOVERS() - a single range starting at zero", () => {
  const ranges = new Ranges();
  ranges.add(0, 5);
  equal(ranges.firstCovers(0), true, "114.01");
  equal(ranges.firstCovers(4), true, "114.02");
  // the reach is inclusive - it answers ">= index", same as current()[0][1]
  equal(ranges.firstCovers(5), true, "114.03");
  equal(ranges.firstCovers(6), false, "114.04");
});

test("115 - FIRSTCOVERS() - a single range which misses zero", () => {
  const ranges = new Ranges();
  ranges.add(1, 5);
  equal(ranges.firstCovers(0), false, "115.01");
  equal(ranges.firstCovers(3), false, "115.02");
  equal(ranges.firstCovers(9), false, "115.03");
});

test("116 - FIRSTCOVERS() - touching and overlapping ranges extend the first", () => {
  // add() folds an exact extension into the last range
  const touching = new Ranges();
  touching.add(0, 5);
  touching.add(5, 9);
  equal(touching.ranges.length, 1, "116.01");
  equal(touching.firstCovers(9), true, "116.02");
  equal(touching.firstCovers(10), false, "116.03");

  // an overlap is pushed separately, yet still merges into the first range
  const overlapping = new Ranges();
  overlapping.add(0, 5);
  overlapping.add(3, 9);
  equal(overlapping.ranges.length, 2, "116.04");
  equal(overlapping.firstCovers(9), true, "116.05");
  equal(overlapping.firstCovers(10), false, "116.06");

  // a range nested inside the first one cannot shorten it
  const nested = new Ranges();
  nested.add(0, 9);
  nested.add(3, 4);
  equal(nested.firstCovers(9), true, "116.07");
});

test("117 - FIRSTCOVERS() - a gap ends the first range", () => {
  const ranges = new Ranges();
  ranges.add(0, 5);
  ranges.add(6, 9);
  ranges.add(9, 12);
  equal(ranges.firstCovers(5), true, "117.01");
  equal(ranges.firstCovers(6), false, "117.02");
  equal(ranges.firstCovers(12), false, "117.03");
});

test("118 - FIRSTCOVERS() - ranges which merging discards", () => {
  // [0, 0] covers nothing and inserts nothing, so merging drops it and the
  // first range becomes [1, 8], which misses zero
  const futile = new Ranges();
  futile.add(0, 0);
  futile.add(1, 8);
  equal(futile.current(), [[1, 8]], "118.01");
  const sameAgain = new Ranges();
  sameAgain.add(0, 0);
  sameAgain.add(1, 8);
  equal(sameAgain.firstCovers(0), false, "118.02");

  // a zero-width range with something to insert survives merging
  const insert = new Ranges();
  insert.add(0, 0, "zzz");
  equal(insert.firstCovers(0), true, "118.03");
  equal(insert.firstCovers(1), false, "118.04");
});

test("119 - FIRSTCOVERS() - ranges pushed out of order", () => {
  // the second add() jumps backwards, so the leading-cluster shortcut is off
  const bridged = new Ranges();
  bridged.add(9, 12);
  bridged.add(0, 5);
  equal(bridged.firstCovers(5), true, "119.01");
  equal(bridged.firstCovers(6), false, "119.02");

  // ... and a later range can still bridge the gap between the two
  bridged.add(5, 9);
  equal(bridged.firstCovers(12), true, "119.03");
  equal(bridged.firstCovers(13), false, "119.04");

  // current() sorts the ranges, which puts the shortcut back on
  equal(bridged.current(), [[0, 12]], "119.05");
  equal(bridged.firstCovers(12), true, "119.06");

  // out-of-order ranges which never reach zero
  const unanchored = new Ranges();
  unanchored.add(9, 12);
  unanchored.add(1, 5);
  equal(unanchored.firstCovers(0), false, "119.07");
});

test("120 - FIRSTCOVERS() - WIPE() and REPLACE()", () => {
  const ranges = new Ranges();
  ranges.add(0, 5);
  equal(ranges.firstCovers(5), true, "120.01");
  ranges.wipe();
  equal(ranges.firstCovers(0), false, "120.02");

  ranges.replace([
    [0, 3],
    [3, 7],
  ]);
  equal(ranges.firstCovers(7), true, "120.03");
  equal(ranges.firstCovers(8), false, "120.04");

  // replace() accepts out-of-order and malformed members
  ranges.replace([[6, 9], null, [0, 6]]);
  equal(ranges.firstCovers(9), true, "120.05");
  equal(ranges.firstCovers(10), false, "120.06");

  // a negative index sorts ahead of zero, so the first range is not at zero
  ranges.replace([
    [0, 9],
    [-3, 0],
  ]);
  equal(ranges.firstCovers(0), false, "120.07");

  ranges.replace([]);
  equal(ranges.firstCovers(0), false, "120.08");
});

test("121 - FIRSTCOVERS() - does not merge, sort or collapse", () => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(9, 12);
  ranges.add(0, 5, "\n\n\n\n");
  const snapshot = JSON.stringify(ranges.ranges);
  equal(ranges.firstCovers(5), true, "121.01");
  equal(JSON.stringify(ranges.ranges), snapshot, "121.02");
});

test("122 - FIRSTCOVERS() - agrees with CURRENT() on assorted range sets", () => {
  const sets = [
    [],
    [[0, 0]],
    [[0, 0, "a"]],
    [[0, 5]],
    [[1, 5]],
    [
      [0, 5],
      [5, 9],
    ],
    [
      [0, 5],
      [6, 9],
    ],
    [
      [0, 5],
      [3, 9],
    ],
    [
      [0, 5],
      [5, 5],
    ],
    [
      [5, 9],
      [0, 5],
    ],
    [
      [5, 9],
      [0, 3],
    ],
    [
      [9, 12],
      [4, 6],
      [0, 2],
      [2, 4],
    ],
    [
      [3, 4],
      [0, 1],
    ],
    [
      [0, 2],
      [2, 2],
      [2, 6],
    ],
    [
      [2, 2],
      [0, 1],
    ],
  ];
  const actual = [];
  const expected = [];
  for (const set of sets) {
    for (const index of [0, 1, 5, 9, 12]) {
      const probe = new Ranges();
      const reference = new Ranges();
      for (const range of set) {
        probe.add(...range);
        reference.add(...range);
      }
      // current() is the semantics being matched, so ask it the same question
      const merged = reference.current();
      const label = `${JSON.stringify(set)} @ ${index}`;
      actual.push(`${label} = ${probe.firstCovers(index)}`);
      expected.push(
        `${label} = ${Boolean(merged) && merged[0][0] === 0 && merged[0][1] >= index}`,
      );
    }
  }
  equal(actual, expected, "122.01");
});

test("123 - FIRSTCOVERS() - rejects an index which is not a natural number", () => {
  const ranges = new Ranges();
  ranges.add(0, 5);
  throws(() => ranges.firstCovers("5"), /THROW_ID_08/, "123.01");
  throws(() => ranges.firstCovers(null), /THROW_ID_08/, "123.02");
  throws(() => ranges.firstCovers(1.5), /THROW_ID_08/, "123.03");
  throws(() => ranges.firstCovers(-1), /THROW_ID_08/, "123.04");
  throws(() => ranges.firstCovers(), /THROW_ID_08/, "123.05");
});

test.run();
