/* eslint ava/no-only-test:0 */

import test from "ava";
import Slices from "../dist/ranges-push.esm";

// -----------------------------------------------------------------------------
// group 01. various throws
// -----------------------------------------------------------------------------

test("01.01  -  ADD() - wrong inputs", t => {
  // missing
  const err01 = t.throws(() => {
    const slices = new Slices();
    slices.add();
  });
  t.truthy(err01.message.includes("THROW_ID_01"));

  const err02 = t.throws(() => {
    const slices = new Slices();
    slices.add("a");
  });
  t.truthy(err02.message.includes("THROW_ID_09"));

  // wrong types
  const err03 = t.throws(() => {
    const slices = new Slices();
    slices.add("a", "a");
  });
  t.truthy(err03.message.includes("THROW_ID_09"));

  const err04 = t.throws(() => {
    const slices = new Slices();
    slices.add(1, "a");
  });
  t.truthy(err04.message.includes("THROW_ID_10"));

  const err05 = t.throws(() => {
    const slices = new Slices();
    slices.add("a", 1);
  });
  t.truthy(err05.message.includes("THROW_ID_09"));

  t.notThrows(() => {
    const slices = new Slices();
    slices.add(1, 1);
  });

  // hardcoded undefined
  const err06 = t.throws(() => {
    const slices = new Slices();
    slices.add(undefined, 1);
  });
  t.truthy(err06.message.includes("THROW_ID_01"));

  // numbers but not natural integers
  const err07 = t.throws(() => {
    const slices = new Slices();
    slices.add(1.2, 1);
  });
  t.truthy(err07.message.includes("THROW_ID_09"));

  const err08 = t.throws(() => {
    const slices = new Slices();
    slices.add(1, 1.3);
  });
  t.truthy(err08.message.includes("THROW_ID_10"));
});

test("01.02  -  ADD() - third input arg is not string", t => {
  const err = t.throws(() => {
    const slices = new Slices();
    slices.add(1, 2, 3);
  });
  t.truthy(err.message.includes("THROW_ID_08"));
});

test("01.03  -  ADD() - overloading", t => {
  const err = t.throws(() => {
    const slices = new Slices();
    slices.add(1, 2, "aaa", 1);
  });
  t.truthy(err.message.includes("THROW_ID_03"));
});

test("01.04  -  PUSH() - wrong inputs", t => {
  // missing
  const err01 = t.throws(() => {
    const slices = new Slices();
    slices.push();
  });
  t.truthy(err01.message.includes("THROW_ID_01"));

  const err02 = t.throws(() => {
    const slices = new Slices();
    slices.push("a");
  });
  t.truthy(err02.message.includes("THROW_ID_09"));

  // wrong types
  const err03 = t.throws(() => {
    const slices = new Slices();
    slices.push("a", "a");
  });
  t.truthy(err03.message.includes("THROW_ID_09"));

  const err04 = t.throws(() => {
    const slices = new Slices();
    slices.push(1, "a");
  });
  t.truthy(err04.message.includes("THROW_ID_10"));

  const err05 = t.throws(() => {
    const slices = new Slices();
    slices.push("a", 1);
  });
  t.truthy(err05.message.includes("THROW_ID_09"));

  t.notThrows(() => {
    const slices = new Slices();
    slices.push(1, 1);
  });

  // hardcoded undefined
  const err06 = t.throws(() => {
    const slices = new Slices();
    slices.push(undefined, 1);
  });
  t.truthy(err06.message.includes("THROW_ID_01"));

  // numbers but not natural integers
  const err07 = t.throws(() => {
    const slices = new Slices();
    slices.push(1.2, 1);
  });
  t.truthy(err07.message.includes("THROW_ID_09"));

  const err08 = t.throws(() => {
    const slices = new Slices();
    slices.push(1, 1.3);
  });
  t.truthy(err08.message.includes("THROW_ID_10"));
});

test("01.05  -  PUSH() - third input arg is not string", t => {
  const err = t.throws(() => {
    const slices = new Slices();
    slices.push(1, 2, 3);
  });
  t.truthy(err.message.includes("THROW_ID_08"));
});

test("01.06  -  PUSH() - overloading", t => {
  const err = t.throws(() => {
    const slices = new Slices();
    slices.push(1, 2, "aaa", 1);
  });
  t.truthy(err.message.includes("THROW_ID_03"));
});

test("01.07  -  ADD() - first argument is .current() output of ranges", t => {
  const err01 = t.throws(() => {
    const slices = new Slices();
    slices.add([[1, 2, 3]]);
  });
  t.truthy(err01.message.includes("THROW_ID_04"));

  const err02 = t.throws(() => {
    const slices = new Slices();
    slices.add([[1, 2, "z", 1]]);
  });
  t.truthy(err02.message.includes("THROW_ID_03"));

  const err03 = t.throws(() => {
    const slices = new Slices();
    slices.add([[1, "z"]]);
  });
  t.truthy(err03.message.includes("THROW_ID_05"));

  const err04 = t.throws(() => {
    const slices = new Slices();
    slices.add([["z", 1]]);
  });
  t.truthy(err04.message.includes("THROW_ID_06"));

  const err05 = t.throws(() => {
    const slices = new Slices();
    slices.add([["z", 1], 1]);
  });
  t.truthy(err05.message.includes("THROW_ID_07"));
});

test("01.08  -  ADD() - null being pushed", t => {
  const slices1 = new Slices();
  const slices2 = new Slices();
  t.deepEqual(
    slices1.current(),
    null,
    "01.08 - part1 - result about-to-be-pushed is really null"
  );
  slices2.push(slices1.current());
  t.deepEqual(
    slices2.current(),
    null,
    "01.08 - part2 - does not throw when null is pushed"
  );
});

// -----------------------------------------------------------------------------
// 02. BAU - no adding string, only ranges for deletion
// -----------------------------------------------------------------------------

test("02.01  -  ADD() - adds two non-overlapping ranges", t => {
  const slices = new Slices();
  slices.add(1, 2);
  slices.add(3, 4);
  t.deepEqual(slices.current(), [[1, 2], [3, 4]], "02.01");
});

test("02.02  -  ADD() - adds two overlapping ranges", t => {
  const slices = new Slices();
  slices.add(0, 5, undefined);
  slices.add(3, 9);
  t.deepEqual(slices.current(), [[0, 9]], "02.02");
});

test("02.03  -  ADD() - extends range", t => {
  const slices = new Slices();
  slices.add(1, 5);
  slices.add(5, 9);
  t.deepEqual(slices.current(), [[1, 9]], "02.03");
});

test("02.04  -  ADD() - new range bypasses the last range completely", t => {
  const slices = new Slices();
  slices.add(1, 5);
  slices.add(11, 15);
  slices.add(6, 10);
  slices.add(16, 20);
  slices.add(10, 30);
  t.deepEqual(slices.current(), [[1, 5], [6, 30]], "02.04");
});

test("02.05  -  ADD() - head and tail markers in new are smaller than last one's", t => {
  const slices = new Slices();
  slices.add(10, 20);
  slices.add(1, 5);
  t.deepEqual(slices.current(), [[1, 5], [10, 20]], "02.05");
});

test("02.06  -  ADD() - same value in heads and tails", t => {
  const slices = new Slices();
  slices.add(1, 1);
  t.deepEqual(slices.current(), [[1, 1]], "02.06");
});

test("02.07  -  ADD() - same range again and again", t => {
  const slices = new Slices();
  slices.add(1, 10);
  slices.add(1, 10);
  slices.add(1, 10);
  slices.add(1, 10);
  slices.add(1, 10);
  slices.add(1, 10);
  t.deepEqual(slices.current(), [[1, 10]], "02.07");
});

test("02.08  -  ADD() - same range again and again, one had third arg", t => {
  const slices = new Slices();
  slices.add(1, 10);
  slices.add(1, 10);
  slices.add(1, 10);
  slices.add(1, 10, "zzz");
  slices.add(1, 10);
  slices.add(1, 10);
  t.deepEqual(slices.current(), [[1, 10, "zzz"]], "02.08");
});

test("02.09  -  ADD() - inputs as numeric strings - all OK", t => {
  const slices = new Slices();
  slices.add("1", "2");
  slices.add("3", "4");
  t.deepEqual(slices.current(), [[1, 2], [3, 4]], "02.09");
});

test("02.10  -  ADD() - wrong order is fine", t => {
  const slices = new Slices();
  slices.add("3", "4");
  slices.add("1", "2");
  t.deepEqual(slices.current(), [[1, 2], [3, 4]], "02.10");
});

test("02.11  -  PUSH() - adds two non-overlapping ranges", t => {
  const slices = new Slices();
  slices.push(1, 2);
  slices.push(3, 4);
  t.deepEqual(slices.current(), [[1, 2], [3, 4]], "02.11");
});

test("02.12  -  PUSH() - adds two overlapping ranges", t => {
  const slices = new Slices();
  slices.push(0, 5);
  slices.push(3, 9);
  t.deepEqual(slices.current(), [[0, 9]], "02.12");
});

// -----------------------------------------------------------------------------
// 03. adding with third argument, various cases
// -----------------------------------------------------------------------------

test("03.01  -  ADD() - adds third argument, blank start", t => {
  const slices = new Slices();
  slices.add(1, 1, "zzz");
  t.deepEqual(slices.current(), [[1, 1, "zzz"]], "03.01");
});

test("03.02  -  ADD() - adds third argument onto existing and stops", t => {
  const slices = new Slices();
  slices.add(1, 2);
  slices.add(3, 4, "zzz");
  t.deepEqual(slices.current(), [[1, 2], [3, 4, "zzz"]], "03.02");
});

test("03.03  -  ADD() - adds third argument onto existing and adds more", t => {
  const slices = new Slices();
  slices.add(1, 2);
  slices.add(3, 4, "zzz");
  slices.add(5, 6);
  t.deepEqual(slices.current(), [[1, 2], [3, 4, "zzz"], [5, 6]], "03.03");
});

test('03.04  -  ADD() - existing "add" values get concatenated with incoming-ones', t => {
  const slices = new Slices();
  slices.add(1, 2, "aaa");
  slices.add(2, 4, "zzz");
  slices.add(5, 6);
  t.deepEqual(slices.current(), [[1, 4, "aaazzz"], [5, 6]], "03.04");
});

test("03.05  -  ADD() - jumped over values have third args and they get concatenated", t => {
  const slices = new Slices();
  slices.add(6, 10);
  slices.add(16, 20, "bbb");
  slices.add(11, 15, "aaa");
  slices.add(10, 30); // this superset range will wipe the `aaa` and `bbb` above
  slices.add(1, 5);
  t.deepEqual(slices.current(), [[1, 5], [6, 30]], "03.05");
});

test("03.06  -  ADD() - combo of third arg and jumping behind previous range", t => {
  const slices = new Slices();
  slices.add(10, 11, "aaa");
  slices.add(3, 4, "zzz");
  t.deepEqual(slices.current(), [[3, 4, "zzz"], [10, 11, "aaa"]], "03.06");
});

test("03.07  -  ADD() - combo of third arg merging and extending previous range (default)", t => {
  const slices = new Slices();
  slices.add(1, 2);
  slices.add(2, 4, "zzz");
  t.deepEqual(slices.current(), [[1, 4, "zzz"]], "03.07");
});

test("03.08  -  ADD() - v1.1.0 - do not merge add-only entries with deletion entries case #1", t => {
  const slices = new Slices();
  slices.add(1, 3);
  slices.add(4, 10);
  slices.add(3, 3, "zzz");
  t.deepEqual(slices.current(), [[1, 3, "zzz"], [4, 10]], "03.08");
});

test("03.09  -  ADD() - v2.1.0 - overlapping ranges discard their inner range to-add values", t => {
  const slices = new Slices();
  slices.add(5, 6, " ");
  slices.add(1, 10);
  t.deepEqual(slices.current(), [[1, 10]], "03.09");
});

test("03.10  -  ADD() - adds third argument with null", t => {
  const slices = new Slices();
  slices.add(1, 2);
  slices.add(3, 4, null);
  slices.add(5, 6);
  t.deepEqual(slices.current(), [[1, 2], [3, 4, null], [5, 6]], "03.10");
});

test("03.11  -  ADD() - pushing whole .current() output of another slices class", t => {
  const slices1 = new Slices();
  slices1.add(5, 6, " ");
  slices1.push(1, 10);

  const slices2 = new Slices();
  slices2.push(2, 8);
  slices2.add(5, 12);

  slices1.push(slices2.current());

  t.deepEqual(slices1.current(), [[1, 12]], "03.11");
});

test("03.12  -  ADD() - empty string to add", t => {
  const slices1 = new Slices();
  slices1.add(1, 2, "");
  t.deepEqual(slices1.current(), [[1, 2]], "03.12.01");

  const slices2 = new Slices({ limitToBeAddedWhitespace: true });
  slices2.add(1, 2, "");
  t.deepEqual(slices2.current(), [[1, 2]], "03.12.02");

  const slices3 = new Slices({ limitToBeAddedWhitespace: true });
  slices3.add(1, 2, "");
  slices3.add(1, 2, "");
  t.deepEqual(slices3.current(), [[1, 2]], "03.12.03");

  const slices4 = new Slices({ limitToBeAddedWhitespace: true });
  slices4.add(1, 2, "");
  slices4.add(3, 4, "");
  t.deepEqual(slices4.current(), [[1, 2], [3, 4]], "03.12.04");
});

test("03.13  -  ADD() - leading/trailing spaces in the third arg.", t => {
  const slices = new Slices();
  slices.add("1", "2", "a");
  slices.add("2", "2", " click here ");
  slices.add("2", "3", "b");
  t.deepEqual(slices.current(), [[1, 3, "a click here b"]], "03.13");

  const slices2 = new Slices({ limitToBeAddedWhitespace: true });
  slices2.add("1", "2", "a");
  slices2.add("2", "2", " click here ");
  slices2.add("2", "3", "b");
  t.deepEqual(slices2.current(), [[1, 3, "a click here b"]], "03.13");
});

// -----------------------------------------------------------------------------
// 04. current()
// -----------------------------------------------------------------------------

test("04.01  -  CURRENT() - calling on blank yields null", t => {
  const slices = new Slices();
  t.deepEqual(slices.current(), null, "04.01");
});

test("04.02  -  CURRENT() - multiple calls on the same should yield the same", t => {
  const slices = new Slices();
  slices.add(7, 14);
  slices.add(24, 28, " ");
  slices.current();
  slices.add(29, 31);
  slices.current();
  slices.current();
  slices.current();
  slices.current();
  t.deepEqual(slices.current(), [[7, 14], [24, 28, " "], [29, 31]], "04.02");
});

// -----------------------------------------------------------------------------
// 05. wipe()
// -----------------------------------------------------------------------------

test("05.01  -  WIPE() - wipes correctly", t => {
  const slices = new Slices();
  slices.add(10, 10, "aaa");
  slices.wipe();
  slices.add(1, 2, "bbb");
  t.deepEqual(slices.current(), [[1, 2, "bbb"]], "05.01");
});

// -----------------------------------------------------------------------------
// 06. last()
// -----------------------------------------------------------------------------

test("06.01  -  LAST() - fetches the last range from empty", t => {
  const slices = new Slices();
  t.deepEqual(slices.last(), null, "06.01");
});

test("06.02  -  LAST() - fetches the last range from non-empty", t => {
  const slices = new Slices();
  slices.add(1, 2, "bbb");
  t.deepEqual(slices.last(), [1, 2, "bbb"], "06.02");
});

// -----------------------------------------------------------------------------
// 07. opts.limitToBeAddedWhitespace
// -----------------------------------------------------------------------------

test("07.01  -  opts.limitToBeAddedWhitespace - spaces grouped - #1", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, " ");
  slices.add(2, 4, "   ");
  t.deepEqual(slices.current(), [[1, 4, " "]], "07.01 - both with spaces only");
});

test("07.02  -  opts.limitToBeAddedWhitespace - spaces grouped - #2", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, " \t\t\t        ");
  slices.add(2, 4, "   ");
  t.deepEqual(slices.current(), [[1, 4, " "]], "07.02 - with tabs");
});

test("07.03  -  opts.limitToBeAddedWhitespace - spaces grouped - #3", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2);
  slices.add(2, 4, "   ");
  t.deepEqual(slices.current(), [[1, 4, " "]], "07.03 - first slice has none");
});

test("07.04  -  opts.limitToBeAddedWhitespace - spaces grouped - #4", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, "");
  slices.add(2, 4, "   ");
  t.deepEqual(
    slices.current(),
    [[1, 4, " "]],
    "07.04 - first slice has empty str"
  );
});

test("07.05  -  opts.limitToBeAddedWhitespace - spaces grouped - #5", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, "");
  slices.add(2, 4, " \t\t\t        ");
  t.deepEqual(
    slices.current(),
    [[1, 4, " "]],
    "07.05 - first empty second with tabs"
  );
});

test("07.06  -  opts.limitToBeAddedWhitespace - spaces grouped - #6", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, "   ");
  slices.add(2, 4);
  t.deepEqual(slices.current(), [[1, 4, " "]], "07.06 - second slice has none");
});

test("07.07  -  opts.limitToBeAddedWhitespace - spaces grouped - #7", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, "   ");
  slices.add(2, 4, "");
  t.deepEqual(
    slices.current(),
    [[1, 4, " "]],
    "07.07 - first slice has empty str"
  );
});

test("07.08  -  opts.limitToBeAddedWhitespace - spaces grouped - #8", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, " \t\t\t        ");
  slices.add(2, 4, "");
  t.deepEqual(
    slices.current(),
    [[1, 4, " "]],
    "07.08 - first empty second with tabs"
  );
});

test("07.09  -  opts.limitToBeAddedWhitespace - linebreaks - #1", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, " \t\t\t     \n   ");
  slices.add(2, 4, "    ");
  t.deepEqual(
    slices.current(),
    [[1, 4, "\n"]],
    "07.09 - only 1st-one has line break"
  );
});

test("07.10  -  opts.limitToBeAddedWhitespace - linebreaks - #2", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, " \t\t\t     \n   ");
  slices.add(2, 4, "  \n  ");
  t.deepEqual(slices.current(), [[1, 4, "\n"]], "07.10 - both have \\n");
});

test("07.11  -  opts.limitToBeAddedWhitespace - linebreaks - #3", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, " \t\t\t        ");
  slices.add(2, 4, "  \n  ");
  t.deepEqual(slices.current(), [[1, 4, "\n"]], "07.11");
});

test("07.12  -  opts.limitToBeAddedWhitespace - linebreaks - #4", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, "");
  slices.add(2, 4, "");
  t.deepEqual(slices.current(), [[1, 4]], "07.12");
});

test("07.13  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, null);
  slices.add(2, 4, " z  ");
  t.deepEqual(slices.current(), [[1, 4, null]], "07.13");
});

test("07.14  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true });
  slices.add(1, 2, "   ");
  slices.add(2, 3, "z");
  slices.add(2, 4, null);
  t.deepEqual(slices.current(), [[1, 4, null]], "07.14");
});

test("07.15  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #1", t => {
  const slices = new Slices(); // <---- no opts
  slices.add(1, 2, null);
  slices.add(2, 4, " z  ");
  slices.add(10, 20, " x  ");
  t.deepEqual(
    slices.current(),
    [[1, 4, null], [10, 20, " x  "]],
    "07.15 - no opts"
  );
});

test("07.16  -  opts.limitToBeAddedWhitespace - null negates 3rd arg #2", t => {
  const slices = new Slices(); // <---- no opts
  slices.add(1, 2, "   ");
  slices.add(2, 3, "z");
  slices.add(2, 4, null);
  t.deepEqual(slices.current(), [[1, 4, null]], "07.16 - no opts");
});

test("07.17  -  ADD() - null wipes third arg values", t => {
  const slices = new Slices();
  slices.add(1, 2, "aaa");
  slices.add(2, 4, "zzz");
  slices.add(1, 6, null);
  t.deepEqual(slices.current(), [[1, 6, null]], "07.17");
});

test("07.18  -  ADD() - adds two non-overlapping ranges", t => {
  const slices = new Slices();
  slices.add(1, 2);
  slices.add(3, 4);
  t.deepEqual(slices.current(), [[1, 2], [3, 4]], "07.18");
});

test("07.19.01  -  opts.limitToBeAddedWhitespace - leading whitespace - control", t => {
  const slices = new Slices(); // <---- no opts
  slices.add(1, 2, "   ");
  slices.add(2, 3, "z");
  slices.add(2, 4, " ");
  t.deepEqual(
    slices.current(),
    [[1, 4, "   z "]],
    "07.19.01 - control, no opts"
  );
});

test("07.20.02  -  opts.limitToBeAddedWhitespace - leading whitespace #1", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true }); // <---- with opts
  slices.add(1, 2, "   ");
  slices.add(2, 3, "z");
  slices.add(2, 4, " ");
  t.deepEqual(slices.current(), [[1, 4, " z "]], "07.20.02");
});

test("07.21.03  -  opts.limitToBeAddedWhitespace - leading whitespace #2", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true }); // <---- with opts
  slices.add(1, 2, " \n  ");
  slices.add(2, 3, "z");
  slices.add(2, 4, " ");
  t.deepEqual(slices.current(), [[1, 4, "\nz "]], "07.21.03");
});

test("07.21.04  -  opts.limitToBeAddedWhitespace - leading whitespace #3", t => {
  const slices = new Slices({ limitToBeAddedWhitespace: true }); // <---- with opts
  slices.add(4, 4, null);
  slices.add(7, 14, " ");
  slices.add(7, 11);
  slices.add(14, 14, ' alt=""');
  t.deepEqual(slices.current(), [[4, 4, null], [7, 14, ' alt=""']], "07.21.04");
});

// -----------------------------------------------------------------------------
// 08. opts.limitLinebreaksCount
// -----------------------------------------------------------------------------

test("08.01.01  -  opts.limitLinebreaksCount #1 - control", t => {
  const slices = new Slices(); // <---- with opts
  slices.add(4, 4, null);
  slices.add(7, 14, "\n");
  slices.add(7, 11, "\n\n");
  slices.add(14, 14, ' alt=""');
  t.deepEqual(
    slices.current(),
    [[4, 4, null], [7, 14, '\n\n\n alt=""']],
    "08.01.01"
  );
});

test("08.01.02  -  opts.limitLinebreaksCount #2 - hardcoded defaults", t => {
  const slices = new Slices({ limitLinebreaksCount: 1 }); // <---- with opts
  slices.add(4, 4, null);
  slices.add(7, 14, "\n");
  slices.add(7, 11, "\n\n");
  slices.add(14, 14, ' alt=""');
  t.deepEqual(
    slices.current(),
    [[4, 4, null], [7, 14, '\n\n\n alt=""']],
    "08.01.02"
  );
});

test("08.01.03  -  opts.limitLinebreaksCount #3 - hardcoded defaults", t => {
  const slices = new Slices({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 1
  }); // <---- with opts
  slices.add(4, 4, null);
  slices.add(7, 14, "\n");
  slices.add(7, 11, "\n\n");
  slices.add(14, 14, ' alt=""');
  t.deepEqual(
    slices.current(),
    [[4, 4, null], [7, 14, '\nalt=""']],
    "08.01.03"
  );
});

test("08.01.04  -  opts.limitLinebreaksCount #4 - hardcoded defaults", t => {
  const slices = new Slices({
    limitToBeAddedWhitespace: true,
    limitLinebreaksCount: 2
  }); // <---- with opts
  slices.add(4, 4, null);
  slices.add(7, 14, "\n");
  slices.add(7, 11, "\n\n");
  slices.add(14, 14, ' alt=""');
  t.deepEqual(
    slices.current(),
    [[4, 4, null], [7, 14, '\n\nalt=""']],
    "08.01.04"
  );
});
