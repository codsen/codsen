import test from "ava";
import deepContains from "../dist/ast-deep-contains.esm";

// 01. basic functionality
// -----------------------------------------------------------------------------

test("01 - second is a subset of the first", t => {
  const gathered = [];
  const errors = [];

  deepContains(
    { a: "1", b: "2", c: "3" },
    { a: "1", b: "2" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    }
  );

  t.deepEqual(
    gathered,
    [
      ["1", "1"],
      ["2", "2"]
    ],
    "01.01"
  );
  t.deepEqual(errors, [], "01.02");
});

test("02 - first is a subset of the second (error)", t => {
  const gathered = [];
  const errors = [];

  deepContains(
    { a: "1", b: "2" },
    { a: "1", b: "2", c: "3" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    }
  );

  t.deepEqual(
    gathered,
    [
      ["1", "1"],
      ["2", "2"]
    ],
    "02.01"
  );
  t.is(errors.length, 1, "02.02");
  t.regex(errors[0], /does not have the path "c"/g, "02.03");
});

test("03 - types mismatch", t => {
  const gathered = [];
  const errors = [];

  deepContains(
    "z",
    { a: "1", b: "2", c: "3" },
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    }
  );

  t.deepEqual(gathered, [], "02.01");
  t.is(errors.length, 1, "02.02");
  t.regex(errors[0], /1st input arg is of a type string/g, "02.03");
});

test("04 - arrays with string values, OK", t => {
  const gathered = [];
  const errors = [];

  deepContains(
    ["1", "2", "3"],
    ["4", "5", "6"],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    }
  );

  t.deepEqual(
    gathered,
    [
      ["1", "4"],
      ["2", "5"],
      ["3", "6"]
    ],
    "04.01"
  );
  t.deepEqual(errors, [], "04.02");
});

test("05 - arrays with string values, not OK", t => {
  const gathered = [];
  const errors = [];

  deepContains(
    ["1", "2"],
    ["4", "5", "6"],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    }
  );

  t.deepEqual(
    gathered,
    [
      ["1", "4"],
      ["2", "5"]
    ],
    "04.01"
  );
  t.is(errors.length, 1, "04.02");
  t.regex(errors[0], /first input does not have the path/g, "04.03");
});

test("06 - arrays with objects, opts.skipContainers=on (default)", t => {
  const gathered = [];
  const errors = [];

  deepContains(
    [{ a: "1" }, { b: "2" }, { c: "3" }],
    [{ a: "4" }, { b: "5" }],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    }
  );

  t.deepEqual(
    gathered,
    [
      ["1", "4"],
      ["2", "5"]
    ],
    "06.01"
  );
  t.deepEqual(errors, [], "06.02");
});

test("07 - arrays with objects, opts.skipContainers=off", t => {
  const gathered = [];
  const errors = [];

  deepContains(
    [{ a: "1" }, { b: "2" }, { c: "3" }],
    [{ a: "4" }, { b: "5" }],
    (leftSideVal, rightSideVal) => {
      gathered.push([leftSideVal, rightSideVal]);
    },
    err => {
      errors.push(err);
    },
    { skipContainers: false }
  );

  t.deepEqual(
    gathered,
    [
      [{ a: "1" }, { a: "4" }],
      ["1", "4"],
      [{ b: "2" }, { b: "5" }],
      ["2", "5"]
    ],
    "07.01"
  );
  t.deepEqual(errors, [], "07.02");
});
