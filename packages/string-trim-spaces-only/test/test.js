import test from "ava";
import trim from "../dist/string-trim-spaces-only.esm";

test("1 - empty string", t => {
  t.deepEqual(
    trim(""),
    {
      res: "",
      ranges: []
    },
    "1.1"
  );
  t.deepEqual(
    trim("", { classicTrim: false }),
    {
      res: "",
      ranges: []
    },
    "1.2 - hardcoded default"
  );
  t.deepEqual(
    trim("", { classicTrim: true }),
    {
      res: "",
      ranges: []
    },
    "1.3"
  );
});

test("2 - single space", t => {
  t.deepEqual(
    trim(" "),
    {
      res: "",
      ranges: [[0, 1]]
    },
    "2.1"
  );
  t.deepEqual(
    trim(" ", { classicTrim: false }),
    {
      res: "",
      ranges: [[0, 1]]
    },
    "2.2"
  );
  t.deepEqual(
    trim(" ", { classicTrim: true }),
    {
      res: "",
      ranges: [[0, 1]]
    },
    "2.3"
  );
});

test("3 - single letter", t => {
  t.deepEqual(trim("a"), { res: "a", ranges: [] }, "3.1");
  t.deepEqual(
    trim("a", { classicTrim: false }),
    { res: "a", ranges: [] },
    "3.2"
  );
  t.deepEqual(
    trim("a", { classicTrim: true }),
    { res: "a", ranges: [] },
    "3.3"
  );
});

test("4 - leading space", t => {
  t.deepEqual(trim(" a a"), { res: "a a", ranges: [[0, 1]] }, "4.1");
  t.deepEqual(
    trim(" a a", { classicTrim: false }),
    { res: "a a", ranges: [[0, 1]] },
    "4.2"
  );
  t.deepEqual(
    trim(" a a", { classicTrim: true }),
    { res: "a a", ranges: [[0, 1]] },
    "4.3"
  );
});

test("5 - trailing space", t => {
  t.deepEqual(trim("a a "), { res: "a a", ranges: [[3, 4]] }, "5.1");
  t.deepEqual(
    trim("a a ", { classicTrim: false }),
    { res: "a a", ranges: [[3, 4]] },
    "5.2"
  );
  t.deepEqual(
    trim("a a ", { classicTrim: true }),
    { res: "a a", ranges: [[3, 4]] },
    "5.3"
  );
});

test("6 - space on both sides", t => {
  t.deepEqual(
    trim("   a a     "),
    { res: "a a", ranges: [[0, 3], [6, 11]] },
    "6.1"
  );
  t.deepEqual(
    trim("   👍     "),
    { res: "👍", ranges: [[0, 3], [5, 10]] },
    "6.2 - copes with emoji"
  );
  t.deepEqual(
    trim("   a a     ", { classicTrim: true }),
    { res: "a a", ranges: [[0, 3], [6, 11]] },
    "6.3"
  );
  t.deepEqual(
    trim("   👍     ", { classicTrim: true }),
    { res: "👍", ranges: [[0, 3], [5, 10]] },
    "6.4 - copes with emoji"
  );
});

test("7 - trimming hits the newline and stops", t => {
  t.deepEqual(
    trim("   \n  a a  \n   "),
    { res: "\n  a a  \n", ranges: [[0, 3], [12, 15]] },
    "7.1"
  );
  t.deepEqual(
    trim("   \t  a a  \t   "),
    { res: "\t  a a  \t", ranges: [[0, 3], [12, 15]] },
    "7.2"
  );
  t.deepEqual(
    trim("   \n  a a  \n   ", { classicTrim: true }),
    { res: "a a", ranges: [[0, 6], [9, 15]] }, // <---------------- !
    "7.3"
  );
  t.deepEqual(
    trim("   \t  a a  \t   ", { classicTrim: true }),
    { res: "a a", ranges: [[0, 6], [9, 15]] }, // <---------------- !
    "7.4"
  );
});

test("8 - non-string input", t => {
  const error1 = t.throws(() => {
    trim(true);
  });
  t.truthy(error1.message.includes("THROW_ID_01"));

  const error2 = t.throws(() => {
    trim(undefined);
  });
  t.truthy(error2.message.includes("THROW_ID_01"));

  const error3 = t.throws(() => {
    trim(9);
  });
  t.truthy(error3.message.includes("THROW_ID_01"));

  const input = { a: "zzz" };
  const error4 = t.throws(() => {
    trim(input);
  });
  t.truthy(error4.message.includes("THROW_ID_01"));

  const error5 = t.throws(() => {
    trim(true, { classicTrim: true });
  });
  t.truthy(error5.message.includes("THROW_ID_01"));

  const error6 = t.throws(() => {
    trim(undefined, { classicTrim: true });
  });
  t.truthy(error6.message.includes("THROW_ID_01"));

  const error7 = t.throws(() => {
    trim(9, { classicTrim: true });
  });
  t.truthy(error7.message.includes("THROW_ID_01"));

  const error8 = t.throws(() => {
    trim(input, { classicTrim: true });
  });
  t.truthy(error8.message.includes("THROW_ID_01"));
});
