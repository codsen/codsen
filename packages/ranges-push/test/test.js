/* eslint ava/no-only-test:0 */

import test from "ava";
import Ranges from "../dist/ranges-push.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01.01  -  ADD() - wrong inputs", t => {
  // missing
  const err01 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add();
  });
  t.truthy(err01.message.includes("THROW_ID_01"));

  const err02 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a");
  });
  t.truthy(err02.message.includes("THROW_ID_09"));

  // wrong types
  const err03 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a", "a");
  });
  t.truthy(err03.message.includes("THROW_ID_09"));

  const err04 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, "a");
  });
  t.truthy(err04.message.includes("THROW_ID_10"));

  const err05 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add("a", 1);
  });
  t.truthy(err05.message.includes("THROW_ID_09"));

  t.notThrows(() => {
    const ranges = new Ranges();
    ranges.add(1, 1);
  });

  // hardcoded undefined
  const err06 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add(undefined, 1);
  });
  t.truthy(err06.message.includes("THROW_ID_01"));

  // numbers but not natural integers
  const err07 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1.2, 1);
  });
  t.truthy(err07.message.includes("THROW_ID_09"));

  const err08 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, 1.3);
  });
  t.truthy(err08.message.includes("THROW_ID_10"));
});

test("01.02  -  ADD() - third input arg is not string", t => {
  const err = t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, 2, 3);
  });
  t.truthy(err.message.includes("THROW_ID_08"));
});

test("01.03  -  ADD() - overloading", t => {
  const err = t.throws(() => {
    const ranges = new Ranges();
    ranges.add(1, 2, "aaa", 1);
  });
  t.truthy(err.message.includes("THROW_ID_03"));
});

test("01.04  -  PUSH() - wrong inputs", t => {
  // missing
  const err01 = t.throws(() => {
    const ranges = new Ranges();
    ranges.push();
  });
  t.truthy(err01.message.includes("THROW_ID_01"));

  const err02 = t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a");
  });
  t.truthy(err02.message.includes("THROW_ID_09"));

  // wrong types
  const err03 = t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a", "a");
  });
  t.truthy(err03.message.includes("THROW_ID_09"));

  const err04 = t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, "a");
  });
  t.truthy(err04.message.includes("THROW_ID_10"));

  const err05 = t.throws(() => {
    const ranges = new Ranges();
    ranges.push("a", 1);
  });
  t.truthy(err05.message.includes("THROW_ID_09"));

  t.notThrows(() => {
    const ranges = new Ranges();
    ranges.push(1, 1);
  });

  // hardcoded undefined
  const err06 = t.throws(() => {
    const ranges = new Ranges();
    ranges.push(undefined, 1);
  });
  t.truthy(err06.message.includes("THROW_ID_01"));

  // numbers but not natural integers
  const err07 = t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1.2, 1);
  });
  t.truthy(err07.message.includes("THROW_ID_09"));

  const err08 = t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, 1.3);
  });
  t.truthy(err08.message.includes("THROW_ID_10"));
});

test("01.05  -  PUSH() - third input arg is not string", t => {
  const err = t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, 2, 3);
  });
  t.truthy(err.message.includes("THROW_ID_08"));
});

test("01.06  -  PUSH() - overloading", t => {
  const err = t.throws(() => {
    const ranges = new Ranges();
    ranges.push(1, 2, "aaa", 1);
  });
  t.truthy(err.message.includes("THROW_ID_03"));
});

test("01.07  -  ADD() - first argument is .current() output of ranges", t => {
  const err01 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add([[1, 2, 3]]);
  });
  t.truthy(err01.message.includes("THROW_ID_04"));

  const err02 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add([[1, 2, "z", 1]]);
  });
  t.truthy(err02.message.includes("THROW_ID_03"));

  const err03 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add([[1, "z"]]);
  });
  t.truthy(err03.message.includes("THROW_ID_05"));

  const err04 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add([["z", 1]]);
  });
  t.truthy(err04.message.includes("THROW_ID_06"));

  const err05 = t.throws(() => {
    const ranges = new Ranges();
    ranges.add([["z", 1], 1]);
  });
  t.truthy(err05.message.includes("THROW_ID_07"));
});

test("01.08  -  ADD() - null being pushed", t => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();
  t.deepEqual(
    ranges1.current(),
    null,
    "01.08 - part1 - result about-to-be-pushed is really null"
  );
  ranges2.push(ranges1.current());
  t.deepEqual(
    ranges2.current(),
    null,
    "01.08 - part2 - does not throw when null is pushed"
  );
});

// -----------------------------------------------------------------------------
// 02. BAU - no adding string, only ranges for deletion
// -----------------------------------------------------------------------------

test("02.01  -  ADD() - adds two non-overlapping ranges", t => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  t.deepEqual(ranges.current(), [[1, 2], [3, 4]], "02.01");
});

test("02.02  -  ADD() - adds two overlapping ranges", t => {
  const ranges = new Ranges();
  ranges.add(0, 5, undefined);
  ranges.add(3, 9);
  t.deepEqual(ranges.current(), [[0, 9]], "02.02");
});

test("02.03  -  ADD() - extends range", t => {
  const ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(5, 9);
  t.deepEqual(ranges.current(), [[1, 9]], "02.03");
});

test("02.04  -  ADD() - new range bypasses the last range completely", t => {
  const ranges = new Ranges();
  ranges.add(1, 5);
  ranges.add(11, 15);
  ranges.add(6, 10);
  ranges.add(16, 20);
  ranges.add(10, 30);
  t.deepEqual(ranges.current(), [[1, 5], [6, 30]], "02.04");
});

test("02.05  -  ADD() - head and tail markers in new are smaller than last one's", t => {
  const ranges = new Ranges();
  ranges.add(10, 20);
  ranges.add(1, 5);
  t.deepEqual(ranges.current(), [[1, 5], [10, 20]], "02.05");
});

test("02.06  -  ADD() - same value in heads and tails", t => {
  const ranges1 = new Ranges();
  ranges1.add(1, 1);
  t.deepEqual(ranges1.current(), [], "02.06.01");

  const ranges2 = new Ranges();
  ranges2.add(1, 1, "zzz");
  t.deepEqual(ranges2.current(), [[1, 1, "zzz"]], "02.06.02");
});

test("02.07  -  ADD() - same range again and again", t => {
  const ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  t.deepEqual(ranges.current(), [[1, 10]], "02.07");
});

test("02.08  -  ADD() - same range again and again, one had third arg", t => {
  const ranges = new Ranges();
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10);
  ranges.add(1, 10, "zzz");
  ranges.add(1, 10);
  ranges.add(1, 10);
  t.deepEqual(ranges.current(), [[1, 10, "zzz"]], "02.08");
});

test("02.09  -  ADD() - inputs as numeric strings - all OK", t => {
  const ranges = new Ranges();
  ranges.add("1", "2");
  ranges.add("3", "4");
  t.deepEqual(ranges.current(), [[1, 2], [3, 4]], "02.09");
});

test("02.10  -  ADD() - wrong order is fine", t => {
  const ranges = new Ranges();
  ranges.add("3", "4");
  ranges.add("1", "2");
  t.deepEqual(ranges.current(), [[1, 2], [3, 4]], "02.10");
});

test("02.11  -  PUSH() - adds two non-overlapping ranges", t => {
  const ranges = new Ranges();
  ranges.push(1, 2);
  ranges.push(3, 4);
  t.deepEqual(ranges.current(), [[1, 2], [3, 4]], "02.11");
});

test("02.12  -  PUSH() - adds two overlapping ranges", t => {
  const ranges = new Ranges();
  ranges.push(0, 5);
  ranges.push(3, 9);
  t.deepEqual(ranges.current(), [[0, 9]], "02.12");
});

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

test("03.01  -  ADD() - adds third argument, blank start", t => {
  const ranges = new Ranges();
  ranges.add(1, 1, "zzz");
  t.deepEqual(ranges.current(), [[1, 1, "zzz"]], "03.01");
});

test("03.02  -  ADD() - adds third argument onto existing and stops", t => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, "zzz");
  t.deepEqual(ranges.current(), [[1, 2], [3, 4, "zzz"]], "03.02");
});

test("03.03  -  ADD() - adds third argument onto existing and adds more", t => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, "zzz");
  ranges.add(5, 6);
  t.deepEqual(ranges.current(), [[1, 2], [3, 4, "zzz"], [5, 6]], "03.03");
});

test('03.04  -  ADD() - existing "add" values get concatenated with incoming-ones', t => {
  const ranges = new Ranges();
  ranges.add(1, 2, "aaa");
  ranges.add(2, 4, "zzz");
  ranges.add(5, 6);
  t.deepEqual(ranges.current(), [[1, 4, "aaazzz"], [5, 6]], "03.04");
});

test("03.05  -  ADD() - jumped over values have third args and they get concatenated", t => {
  const ranges = new Ranges();
  ranges.add(6, 10);
  ranges.add(16, 20, "bbb");
  ranges.add(11, 15, "aaa");
  ranges.add(10, 30); // this superset range will wipe the `aaa` and `bbb` above
  ranges.add(1, 5);
  t.deepEqual(ranges.current(), [[1, 5], [6, 30]], "03.05");
});

test("03.06  -  ADD() - combo of third arg and jumping behind previous range", t => {
  const ranges = new Ranges();
  ranges.add(10, 11, "aaa");
  ranges.add(3, 4, "zzz");
  t.deepEqual(ranges.current(), [[3, 4, "zzz"], [10, 11, "aaa"]], "03.06");
});

test("03.07  -  ADD() - combo of third arg merging and extending previous range (default)", t => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(2, 4, "zzz");
  t.deepEqual(ranges.current(), [[1, 4, "zzz"]], "03.07");
});

test("03.08  -  ADD() - v1.1.0 - do not merge add-only entries with deletion entries case #1", t => {
  const ranges = new Ranges();
  ranges.add(1, 3);
  ranges.add(4, 10);
  ranges.add(3, 3, "zzz");
  t.deepEqual(ranges.current(), [[1, 3, "zzz"], [4, 10]], "03.08");
});

test("03.09  -  ADD() - v2.1.0 - overlapping ranges discard their inner range to-add values", t => {
  const ranges = new Ranges();
  ranges.add(5, 6, " ");
  ranges.add(1, 10);
  t.deepEqual(ranges.current(), [[1, 10]], "03.09");
});

test("03.10  -  ADD() - adds third argument with null", t => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4, null);
  ranges.add(5, 6);
  t.deepEqual(ranges.current(), [[1, 2], [3, 4, null], [5, 6]], "03.10");
});

test("03.11  -  ADD() - pushing whole .current() output of another ranges class", t => {
  const ranges1 = new Ranges();
  ranges1.add(5, 6, " ");
  ranges1.push(1, 10);

  const ranges2 = new Ranges();
  ranges2.push(2, 8);
  ranges2.add(5, 12);

  ranges1.push(ranges2.current());

  t.deepEqual(ranges1.current(), [[1, 12]], "03.11");
});

test("03.12  -  ADD() - empty string to add", t => {
  const ranges1 = new Ranges();
  ranges1.add(1, 2, "");
  t.deepEqual(ranges1.current(), [[1, 2]], "03.12.01");

  const ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add(1, 2, "");
  t.deepEqual(ranges2.current(), [[1, 2]], "03.12.02");

  const ranges3 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges3.add(1, 2, "");
  ranges3.add(1, 2, "");
  t.deepEqual(ranges3.current(), [[1, 2]], "03.12.03");

  const ranges4 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges4.add(1, 2, "");
  ranges4.add(3, 4, "");
  t.deepEqual(ranges4.current(), [[1, 2], [3, 4]], "03.12.04");
});

test("03.13  -  ADD() - leading/trailing spaces in the third arg.", t => {
  const ranges = new Ranges();
  ranges.add("1", "2", "a");
  ranges.add("2", "2", " click here ");
  ranges.add("2", "3", "b");
  t.deepEqual(ranges.current(), [[1, 3, "a click here b"]], "03.13");

  const ranges2 = new Ranges({ limitToBeAddedWhitespace: true });
  ranges2.add("1", "2", "a");
  ranges2.add("2", "2", " click here ");
  ranges2.add("2", "3", "b");
  t.deepEqual(ranges2.current(), [[1, 3, "a click here b"]], "03.13");
});

test("03.14  -  ADD() - whole ranges array is pushed", t => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();

  ranges1.add(1, 2);
  ranges1.add(3, 4);

  ranges2.push(5, 6);
  ranges2.push(ranges1.current());
  t.deepEqual(ranges2.current(), [[1, 2], [3, 4], [5, 6]], "03.14");
});

test("03.15  -  ADD() - empty array is pushed", t => {
  const ranges1 = new Ranges();
  ranges1.push([]);
  t.is(ranges1.current(), null, "03.15");
});

test("03.16  -  ADD() - null is pushed", t => {
  const ranges1 = new Ranges();
  const ranges2 = new Ranges();
  ranges1.push(ranges2.current());
  t.is(ranges1.current(), null, "03.16.01");
  t.is(ranges1.current(), null, "03.16.02");
});

test("03.17  -  ADD() - clashing third argument, mergeType === 1", t => {
  const ranges1 = new Ranges();
  ranges1.add(0, 5, "a");
  ranges1.add(0, 5, "b");
  t.deepEqual(ranges1.current(), [[0, 5, "ab"]], "03.17.01");

  // hardcoded default:
  const ranges2 = new Ranges({
    mergeType: 1
  });
  ranges2.add(0, 5, "a");
  ranges2.add(0, 5, "b");
  t.deepEqual(ranges2.current(), [[0, 5, "ab"]], "03.17.02");
});

test("03.18  -  ADD() - clashing third argument, mergeType === 2", t => {
  const ranges = new Ranges({
    mergeType: 2
  });
  ranges.add(0, 5, "a");
  ranges.add(0, 5, "b");
  t.deepEqual(ranges.current(), [[0, 5, "b"]], "03.18");
});

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

test("04.01  -  CURRENT() - calling on blank yields null", t => {
  const ranges = new Ranges();
  t.deepEqual(ranges.current(), null, "04.01");
});

test("04.02  -  CURRENT() - multiple calls on the same should yield the same", t => {
  const ranges = new Ranges();
  ranges.add(7, 14);
  ranges.add(24, 28, " ");
  ranges.current();
  ranges.add(29, 31);
  ranges.current();
  ranges.current();
  ranges.current();
  ranges.current();
  t.deepEqual(ranges.current(), [[7, 14], [24, 28, " "], [29, 31]], "04.02");
});

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

test("05.01  -  WIPE() - wipes correctly", t => {
  const ranges = new Ranges();
  ranges.add(10, 10, "aaa");
  ranges.wipe();
  ranges.add(1, 2, "bbb");
  t.deepEqual(ranges.current(), [[1, 2, "bbb"]], "05.01");
});

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

test("06.01  -  LAST() - fetches the last range from empty", t => {
  const ranges = new Ranges();
  t.deepEqual(ranges.last(), null, "06.01");
});

test("06.02  -  LAST() - fetches the last range from non-empty", t => {
  const ranges = new Ranges();
  ranges.add(1, 2, "bbb");
  t.deepEqual(ranges.last(), [1, 2, "bbb"], "06.02");
});

// -----------------------------------------------------------------------------
// 07. opts.limitToBeAddedWhitespace
// -----------------------------------------------------------------------------

test("07.01  -  opts.limitToBeAddedWhitespace - spaces grouped - #1", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " ");
  ranges.add(2, 4, "   ");
  t.deepEqual(ranges.current(), [[1, 4, " "]], "07.01 - both with spaces only");
});

test("07.02  -  opts.limitToBeAddedWhitespace - spaces grouped - #2", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "   ");
  t.deepEqual(ranges.current(), [[1, 4, " "]], "07.02 - with tabs");
});

test("07.03  -  opts.limitToBeAddedWhitespace - spaces grouped - #3", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2);
  ranges.add(2, 4, "   ");
  t.deepEqual(ranges.current(), [[1, 4, " "]], "07.03 - first slice has none");
});

test("07.04  -  opts.limitToBeAddedWhitespace - spaces grouped - #4", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "   ");
  t.deepEqual(
    ranges.current(),
    [[1, 4, " "]],
    "07.04 - first slice has empty str"
  );
});

test("07.05  -  opts.limitToBeAddedWhitespace - spaces grouped - #5", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, " \t\t\t        ");
  t.deepEqual(
    ranges.current(),
    [[1, 4, " "]],
    "07.05 - first empty second with tabs"
  );
});

test("07.06  -  opts.limitToBeAddedWhitespace - spaces grouped - #6", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4);
  t.deepEqual(ranges.current(), [[1, 4, " "]], "07.06 - second slice has none");
});

test("07.07  -  opts.limitToBeAddedWhitespace - spaces grouped - #7", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 4, "");
  t.deepEqual(
    ranges.current(),
    [[1, 4, " "]],
    "07.07 - first slice has empty str"
  );
});

test("07.08  -  opts.limitToBeAddedWhitespace - spaces grouped - #8", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "");
  t.deepEqual(
    ranges.current(),
    [[1, 4, " "]],
    "07.08 - first empty second with tabs"
  );
});

test("07.09  -  opts.limitToBeAddedWhitespace - linebreaks - #1", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "    ");
  t.deepEqual(
    ranges.current(),
    [[1, 4, "\n"]],
    "07.09 - only 1st-one has line break"
  );
});

test("07.10  -  opts.limitToBeAddedWhitespace - linebreaks - #2", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t     \n   ");
  ranges.add(2, 4, "  \n  ");
  t.deepEqual(ranges.current(), [[1, 4, "\n"]], "07.10 - both have \\n");
});

test("07.11  -  opts.limitToBeAddedWhitespace - linebreaks - #3", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, " \t\t\t        ");
  ranges.add(2, 4, "  \n  ");
  t.deepEqual(ranges.current(), [[1, 4, "\n"]], "07.11");
});

test("07.12  -  opts.limitToBeAddedWhitespace - linebreaks - #4", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "");
  ranges.add(2, 4, "");
  t.deepEqual(ranges.current(), [[1, 4]], "07.12");
});

test("07.13  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, null);
  ranges.add(2, 4, " z  ");
  t.deepEqual(ranges.current(), [[1, 4, null]], "07.13");
});

test("07.14  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true });
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, null);
  t.deepEqual(ranges.current(), [[1, 4, null]], "07.14");
});

test("07.15  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1", t => {
  const ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, null);
  ranges.add(2, 4, " z  ");
  ranges.add(10, 20, " x  ");
  t.deepEqual(
    ranges.current(),
    [[1, 4, null], [10, 20, " x  "]],
    "07.15 - no opts"
  );
});

test("07.16  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2", t => {
  const ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, null);
  t.deepEqual(ranges.current(), [[1, 4, null]], "07.16 - no opts");
});

test("07.17  -  ADD() - null wipes third arg values", t => {
  const ranges = new Ranges();
  ranges.add(1, 2, "aaa");
  ranges.add(2, 4, "zzz");
  ranges.add(1, 6, null);
  t.deepEqual(ranges.current(), [[1, 6, null]], "07.17");
});

test("07.18  -  ADD() - adds two non-overlapping ranges", t => {
  const ranges = new Ranges();
  ranges.add(1, 2);
  ranges.add(3, 4);
  t.deepEqual(ranges.current(), [[1, 2], [3, 4]], "07.18");
});

test("07.19  -  opts.limitToBeAddedWhitespace - leading whitespace - control", t => {
  const ranges = new Ranges(); // <---- no opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  t.deepEqual(ranges.current(), [[1, 4, "   z "]], "07.19 - control, no opts");
});

test("07.20  -  opts.limitToBeAddedWhitespace - leading whitespace #1", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(1, 2, "   ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  t.deepEqual(ranges.current(), [[1, 4, " z "]], "07.20");
});

test("07.21  -  opts.limitToBeAddedWhitespace - leading whitespace #2", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(1, 2, " \n  ");
  ranges.add(2, 3, "z");
  ranges.add(2, 4, " ");
  t.deepEqual(ranges.current(), [[1, 4, "\nz "]], "07.21");
});

test("07.22  -  opts.limitToBeAddedWhitespace - leading whitespace #3", t => {
  const ranges = new Ranges({ limitToBeAddedWhitespace: true }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, " ");
  ranges.add(7, 11);
  ranges.add(14, 14, ' alt=""');
  t.deepEqual(ranges.current(), [[4, 4, null], [7, 14, ' alt=""']], "07.22");
});

// -----------------------------------------------------------------------------
// 08. opts.limitLinebreaksCount
// -----------------------------------------------------------------------------

test("08.01  -  opts.limitLinebreaksCount #1 - control", t => {
  const ranges = new Ranges(); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  t.deepEqual(
    ranges.current(),
    [[4, 4, null], [7, 14, '\n\n\n alt=""']],
    "08.01"
  );
});

test("08.02  -  opts.limitLinebreaksCount #2 - hardcoded defaults", t => {
  const ranges = new Ranges({ limitLinebreaksCount: 1 }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  t.deepEqual(
    ranges.current(),
    [[4, 4, null], [7, 14, '\n\n\n alt=""']],
    "08.02"
  );
});

test("08.03  -  opts.limitLinebreaksCount #3 - hardcoded defaults", t => {
  const ranges = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 1
  }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  t.deepEqual(ranges.current(), [[4, 4, null], [7, 14, '\nalt=""']], "08.03");
});

test("08.04  -  opts.limitLinebreaksCount #4 - hardcoded defaults", t => {
  const ranges = new Ranges({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2
  }); // <---- with opts
  ranges.add(4, 4, null);
  ranges.add(7, 14, "\n");
  ranges.add(7, 11, "\n\n");
  ranges.add(14, 14, ' alt=""');
  t.deepEqual(ranges.current(), [[4, 4, null], [7, 14, '\n\nalt=""']], "08.04");
});

// -----------------------------------------------------------------------------
// 09. replace()
// -----------------------------------------------------------------------------

test("09.01  -  REPLACE() - replaces ranges with ranges", t => {
  const oldRanges = new Ranges();
  const newRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.deepEqual(
    oldRanges.current(),
    [[1, 2, "a"], [3, 4, "b"], [9, 10]],
    "09.01.01"
  );

  newRanges.add(5, 6, "x");
  newRanges.add(7, 8, "y");
  newRanges.add(11, 12);
  // first, ensure it's been assembled correctly:
  t.deepEqual(
    newRanges.current(),
    [[5, 6, "x"], [7, 8, "y"], [11, 12]],
    "09.01.02"
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  t.deepEqual(
    oldRanges.current(),
    [[5, 6, "x"], [7, 8, "y"], [11, 12]],
    "09.01.03"
  );
});

test("09.02  -  REPLACE() - replaces ranges with null", t => {
  const oldRanges = new Ranges();
  const newRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.deepEqual(
    oldRanges.current(),
    [[1, 2, "a"], [3, 4, "b"], [9, 10]],
    "09.02.01"
  );

  // replace:
  oldRanges.replace(newRanges.current());

  // ensure that it was cloned, not linked to a value reference -
  // mutate the "original" source, the newRanges
  newRanges.wipe();

  // ensure oldRanges is now same as newRanges:
  t.deepEqual(oldRanges.current(), null, "09.02.02");
});

test("09.03  -  REPLACE() - replaces ranges with empty array", t => {
  const oldRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);
  // first, ensure it's been assembled correctly:
  t.deepEqual(
    oldRanges.current(),
    [[1, 2, "a"], [3, 4, "b"], [9, 10]],
    "09.03.01"
  );

  // replace:
  oldRanges.replace([]);

  // ensure oldRanges is now same as newRanges:
  t.deepEqual(oldRanges.current(), null, "09.03.02");
});

test("09.04  -  REPLACE() - replaces ranges with single range (throws)", t => {
  const oldRanges = new Ranges();
  oldRanges.add(1, 2, "a");
  oldRanges.add(3, 4, "b");
  oldRanges.add(9, 10);

  // without third element, "what to insert"
  const error1 = t.throws(() => {
    oldRanges.replace([6, 8]);
  });
  t.regex(error1.message, /THROW_ID_11/);

  // with third element, "what to insert"
  const error2 = t.throws(() => {
    oldRanges.replace([6, 8, "zzz"]);
  });
  t.regex(error2.message, /THROW_ID_11/);

  // but range or ranges does work fine:
  oldRanges.replace([[6, 8, "zzz"]]);
  t.deepEqual(oldRanges.current(), [[6, 8, "zzz"]], "09.04.01");
});
