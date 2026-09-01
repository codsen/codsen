import { runInNewContext } from "node:vm";
import { compare } from "ast-compare";
import { DELETE as TRAVERSE_DELETE } from "ast-monkey-traverse";
import { test } from "uvu";
import { equal, is, throws } from "uvu/assert";

import {
  arrayFirstOnly,
  DELETE,
  del,
  drop,
  find,
  get,
  set,
  traverse,
} from "../dist/ast-monkey.esm.js";

const hasOwn = Object.prototype.hasOwnProperty;

test("01 - NaN remains data unless it is selected explicitly", () => {
  const input = { a: Number.NaN, b: 1 };
  const found = find(input, { key: "a" });

  equal(found.length, 1, "01.01");
  equal(Number.isNaN(found[0].val), true, "01.02");
  equal(Number.isNaN(get(input, { index: 1 }).a), true, "01.03");
  equal(
    Number.isNaN(set({ a: 1 }, { index: 1, val: Number.NaN }).a),
    true,
    "01.04",
  );
  equal(del(input, { key: "never" }), input, "01.05");
  equal(drop(input, { index: 99 }), input, "01.06");
  equal(arrayFirstOnly(input), input, "01.07");
  equal(
    del([Number.NaN, 1], {
      criteria: { kind: "value", value: Number.NaN },
    }),
    [1],
    "01.08",
  );

  equal(
    find(
      { holder: { value: Number.NaN } },
      {
        criteria: { kind: "value", value: { value: Number.NaN } },
      },
    ),
    [],
    "01.09",
  );
  equal(
    find(
      { holder: [Number.NaN] },
      {
        criteria: { kind: "value", value: [Number.NaN] },
      },
    ),
    [],
    "01.10",
  );

  const sparseCandidate = new Array(2);
  sparseCandidate[0] = Number.NaN;
  const sparsePattern = new Array(2);
  sparsePattern[0] = Number.NaN;
  equal(
    find(
      { holder: sparseCandidate },
      {
        criteria: { kind: "value", value: sparsePattern },
      },
    ),
    [],
    "01.11",
  );

  let deepCandidate = Number.NaN;
  let deepPattern = Number.NaN;
  for (let depth = 0; depth < 70; depth += 1) {
    deepCandidate = { nested: deepCandidate };
    deepPattern = { nested: deepPattern };
  }
  equal(
    find(
      { holder: deepCandidate },
      {
        criteria: { kind: "value", value: deepPattern },
      },
    ),
    [],
    "01.12",
  );
  equal(
    Object.is(set({ value: 0 }, { index: 1, val: -0 }).value, -0),
    true,
    "01.13",
  );
  equal(
    Object.is(set({ value: -0 }, { index: 1, val: 0 }).value, 0),
    true,
    "01.14",
  );
});

test("02 - get returns an own proto data property", () => {
  const result = get(JSON.parse('{"__proto__":{"polluted":true},"safe":1}'), {
    index: 1,
  });
  const descriptor = Object.getOwnPropertyDescriptor(result, "__proto__");

  equal(hasOwn.call(result, "__proto__"), true, "02.01");
  equal(Object.keys(result), ["__proto__"], "02.02");
  equal(JSON.stringify(result), '{"__proto__":{"polluted":true}}', "02.03");
  is(Object.getPrototypeOf(result), Object.prototype, "02.04");
  equal(
    descriptor,
    {
      configurable: true,
      enumerable: true,
      value: { polluted: true },
      writable: true,
    },
    "02.05",
  );
});

test("03 - get applies normalized parent filters", () => {
  equal(get({ a: 1 }, { index: 1, only: "array" }), null, "03.01");
  equal(get(["a"], { index: 1, only: "object" }), null, "03.02");
  equal(get(["a"], { index: 1, only: "arrays" }), "a", "03.03");
  equal(get({ a: 1 }, { index: 1, only: "o" }), { a: 1 }, "03.04");
  equal(get({ a: 1 }, { index: 1, only: "whatever" }), { a: 1 }, "03.05");
  throws(
    () => get({ a: 1 }, { index: 1, only: "records" }),
    /^ast-monkey\/get\(\): \[THROW_ID_10]/,
    "03.06",
  );
});

test("04 - criteria distinguish nullish keys and values", () => {
  equal(
    find([undefined, null], {
      criteria: { kind: "value", value: undefined },
    }),
    [{ index: 1, key: undefined, path: [1], val: undefined }],
    "04.01",
  );
  equal(
    find([undefined, null], { criteria: { kind: "key", key: null } }),
    [{ index: 2, key: null, path: [2], val: undefined }],
    "04.02",
  );
  equal(
    find(
      { a: undefined },
      {
        criteria: { kind: "entry", key: "a", value: undefined },
      },
    ),
    [{ index: 1, key: "a", path: [1], val: undefined }],
    "04.03",
  );
  equal(
    find({ a: undefined }, { val: undefined }),
    [{ index: 1, key: "a", path: [1], val: undefined }],
    "04.04",
  );
  equal(
    find({ a: undefined }, { key: "a", val: undefined }),
    [{ index: 1, key: "a", path: [1], val: undefined }],
    "04.05",
  );
  equal(
    del([undefined, null, "x"], {
      criteria: { kind: "value", value: undefined },
    }),
    [null, "x"],
    "04.06",
  );
});

test("05 - set distinguishes an own undefined value from the key alias", () => {
  equal(set({ a: 1 }, { index: 1, val: undefined }), { a: undefined }, "05.01");
  equal(
    set({ a: 1 }, { index: 1, key: "legacy", val: undefined }),
    { a: "legacy" },
    "05.02",
  );
  equal(set({ a: 1 }, { index: 1, key: "legacy" }), { a: "legacy" }, "05.03");
  throws(
    () => set({ a: 1 }, { index: 1, key: null }),
    /^ast-monkey\/set\(\): \[THROW_ID_14]/,
    "05.04",
  );
});

test("06 - explicit undefined entries and sparse holes stay distinct", () => {
  const input = new Array(3);
  input[1] = undefined;
  input[2] = "x";

  equal(
    find(input, { criteria: { kind: "value", value: undefined } }),
    [{ index: 1, key: undefined, path: [1], val: undefined }],
    "06.01",
  );
  is(get(input, { index: 1 }), undefined, "06.02");

  const setResult = set(input, { index: 1, val: "changed" });
  equal(hasOwn.call(setResult, 0), false, "06.03");
  const expectedSetResult = new Array(3);
  expectedSetResult[1] = "changed";
  expectedSetResult[2] = "x";
  equal(setResult, expectedSetResult, "06.04");

  const dropResult = drop(input, { index: 1 });
  equal(hasOwn.call(dropResult, 0), false, "06.05");
  const expectedDropResult = new Array(2);
  expectedDropResult[1] = "x";
  equal(dropResult, expectedDropResult, "06.06");

  const first = arrayFirstOnly([undefined, "x"]);
  equal(first, [undefined], "06.07");
  equal(hasOwn.call(first, 0), true, "06.08");

  const sparseFirst = arrayFirstOnly(input);
  equal(sparseFirst.length, 1, "06.09");
  equal(hasOwn.call(sparseFirst, 0), false, "06.10");
});

test("07 - nullish roots are values while omitted inputs throw", () => {
  equal(find(null, { key: "a" }), [], "07.01");
  equal(find(undefined, { key: "a" }), [], "07.02");
  equal(get(null, { index: 1 }), null, "07.03");
  equal(get(undefined, { index: 1 }), null, "07.04");
  equal(set(null, { index: 1, val: "x" }), null, "07.05");
  is(set(undefined, { index: 1, val: "x" }), undefined, "07.06");
  equal(drop(null, { index: 1 }), null, "07.07");
  is(drop(undefined, { index: 1 }), undefined, "07.08");
  equal(del(null, { key: "a" }), null, "07.09");
  is(del(undefined, { key: "a" }), undefined, "07.10");
  equal(arrayFirstOnly(null), null, "07.11");
  is(arrayFirstOnly(undefined), undefined, "07.12");
});

test("08 - indexes share one safe non-negative integer contract", () => {
  equal(get({ a: 1 }, { index: "0" }), null, "08.01");
  equal(set({ a: 1 }, { index: "0", val: 2 }), { a: 1 }, "08.02");
  equal(drop({ a: 1 }, { index: "0" }), { a: 1 }, "08.03");
  equal(get({ a: 1 }, { index: Number.MAX_SAFE_INTEGER }), null, "08.04");
  equal(
    set({ a: 1 }, { index: Number.MAX_SAFE_INTEGER, val: 2 }),
    { a: 1 },
    "08.05",
  );
  equal(drop({ a: 1 }, { index: Number.MAX_SAFE_INTEGER }), { a: 1 }, "08.06");

  let assertion = 7;
  for (const invalid of [
    -1,
    "-1",
    1.5,
    "1.5",
    Number.MAX_SAFE_INTEGER + 1,
    `${Number.MAX_SAFE_INTEGER + 1}`,
    Symbol("index"),
  ]) {
    for (const [fn, id] of [
      [(value) => get({ a: 1 }, { index: value }), "09"],
      [(value) => set({ a: 1 }, { index: value, val: 2 }), "16"],
      [(value) => drop({ a: 1 }, { index: value }), "22"],
    ]) {
      throws(
        () => fn(invalid),
        new RegExp(`^ast-monkey/.+\\(\\): \\[THROW_ID_${id}\\]`),
        `08.${`${assertion}`.padStart(2, "0")}`,
      );
      assertion += 1;
    }
  }
});

test("09 - arrayFirstOnly validates before trimming and scales linearly", () => {
  let getterReads = 0;
  const accessorArray = [];
  Object.defineProperty(accessorArray, "0", {
    enumerable: true,
    get() {
      getterReads += 1;
      return "unsafe";
    },
  });
  accessorArray.length = 1;
  throws(
    () => arrayFirstOnly(accessorArray),
    /^ast-monkey\/arrayFirstOnly\(\): \[THROW_ID_31]/,
    "09.01",
  );
  equal(getterReads, 0, "09.02");

  const customArray = ["a", "b"];
  Object.setPrototypeOf(customArray, {});
  throws(
    () => arrayFirstOnly(customArray),
    /^ast-monkey\/arrayFirstOnly\(\): \[THROW_ID_31]/,
    "09.03",
  );

  const depth = 400;
  let input = "leaf";
  for (let index = 0; index < depth; index += 1) {
    input = { nested: [input, "discarded"] };
  }
  const originalOwnKeys = Reflect.ownKeys;
  let ownKeyCalls = 0;
  Reflect.ownKeys = (...args) => {
    ownKeyCalls += 1;
    return originalOwnKeys(...args);
  };
  let result;
  try {
    result = arrayFirstOnly(input);
  } finally {
    Reflect.ownKeys = originalOwnKeys;
  }
  equal(ownKeyCalls <= depth * 3, true, "09.04");
  equal(input.nested.length, 2, "09.05");
  equal(result.nested.length, 1, "09.06");
});

test("10 - deep and cyclic options fail or complete under package control", () => {
  let deepValue = "leaf";
  let deepMismatch = "different";
  for (let depth = 0; depth < 10000; depth += 1) {
    deepValue = { nested: deepValue };
    deepMismatch = { nested: deepMismatch };
  }
  equal(
    find({ target: deepValue }, { key: "target", val: deepValue }).length,
    1,
    "10.01",
  );
  equal(
    find({ target: deepValue }, { key: "target", val: deepMismatch }),
    [],
    "10.02",
  );

  const setResult = set({ target: 1 }, { index: 1, val: deepValue });
  let cursor = setResult.target;
  let measuredDepth = 0;
  while (
    cursor !== null &&
    typeof cursor === "object" &&
    !Array.isArray(cursor) &&
    hasOwn.call(cursor, "nested")
  ) {
    cursor = cursor.nested;
    measuredDepth += 1;
  }
  equal([measuredDepth, cursor], [10000, "leaf"], "10.03");

  const cyclic = {};
  cyclic.self = cyclic;
  equal(
    find({ target: { self: {} } }, { key: "target", val: cyclic }),
    [],
    "10.04",
  );
  equal(
    del({ target: { self: {} } }, { key: "target", val: cyclic }),
    { target: { self: {} } },
    "10.05",
  );
  throws(
    () => set({ target: 1 }, { index: 1, val: cyclic }),
    /^ast-monkey\/set\(\): \[THROW_ID_18]/,
    "10.06",
  );
});

test("11 - invalid options and trees retain package-owned prefixes", () => {
  throws(
    () => find({ a: 1 }, { criteria: { kind: "value" } }),
    /^ast-monkey\/find\(\): \[THROW_ID_03]/,
    "11.01",
  );
  throws(
    () => del({ a: 1 }, { key: "a", only: "records" }),
    /^ast-monkey\/del\(\): \[THROW_ID_28]/,
    "11.02",
  );
  throws(
    () => find({ a: 1 }, { key: "a", only: Symbol("only") }),
    /^ast-monkey\/find\(\): \[THROW_ID_03]/,
    "11.03",
  );
  throws(
    () => get({ a: 1 }, { index: 1, only: Symbol("only") }),
    /^ast-monkey\/get\(\): \[THROW_ID_10]/,
    "11.04",
  );
  const invalidTree = Object.create(null);
  invalidTree.a = 1;
  for (const [fn, id, label] of [
    [() => find(invalidTree, { key: "a" }), "05", "11.05"],
    [() => get(invalidTree, { index: 1 }), "11", "11.06"],
    [() => set(invalidTree, { index: 1, val: 2 }), "18", "11.07"],
    [() => drop(invalidTree, { index: 1 }), "23", "11.08"],
    [() => del(invalidTree, { key: "a" }), "29", "11.09"],
    [() => arrayFirstOnly(invalidTree), "31", "11.10"],
  ]) {
    throws(fn, new RegExp(`^ast-monkey/.+\\(\\): \\[THROW_ID_${id}\\]`), label);
  }
});

test("12 - the re-exported traversal token deletes without colliding", () => {
  is(DELETE, TRAVERSE_DELETE, "12.01");
  equal(
    traverse([Number.NaN, "drop"], (key) => (key === "drop" ? DELETE : key)),
    [Number.NaN],
    "12.02",
  );
});

test("13 - the simple-tree comparator agrees with ast-compare", () => {
  const failures = [];
  for (let index = 0; index < 200; index += 1) {
    const candidate = {
      label: `value-${index % 11}`,
      nested: [index % 7, { enabled: index % 2 === 0 }],
    };
    const pattern = {
      label:
        index % 3 === 0
          ? "value-*"
          : `value-${(index + (index % 5 === 0 ? 1 : 0)) % 11}`,
      nested: [index % 7, { enabled: index % 2 === 0 }],
    };
    const expected = Boolean(
      compare(candidate, pattern, {
        matchStrictly: true,
        useWildcards: true,
      }),
    );
    const actual =
      find({ target: candidate }, { key: "target", val: pattern }).length === 1;
    if (actual !== expected) {
      failures.push({ actual, candidate, expected, pattern });
    }
  }
  equal(failures, [], "13.01");
});

test("14 - unsupported selectors and tree shapes are rejected", () => {
  equal(find({ target: [1] }, { key: "target", val: [1, 2] }), [], "14.01");

  for (const [opts, label] of [
    [{ criteria: null }, "14.02"],
    [{ criteria: { kind: "key" } }, "14.03"],
    [{ criteria: { kind: "entry", key: "a" } }, "14.04"],
    [{ criteria: { kind: "unknown" } }, "14.05"],
    [{ key: null }, "14.06"],
    [{ extra: true, key: "a" }, "14.07"],
  ]) {
    throws(
      () => find({ a: 1 }, opts),
      /^ast-monkey\/find\(\): \[THROW_ID_03]/,
      label,
    );
  }

  const missingKind = { key: "a" };
  throws(
    () => find({ a: 1 }, { criteria: missingKind }),
    /^ast-monkey\/find\(\): \[THROW_ID_03]/,
    "14.08",
  );
  throws(
    () => find({ a: 1 }, { key: "a", only: "records" }),
    /^ast-monkey\/find\(\): \[THROW_ID_04]/,
    "14.09",
  );
  throws(
    () => find(Symbol("root"), { key: "a" }),
    /^ast-monkey\/find\(\): \[THROW_ID_05]/,
    "14.10",
  );

  const symbolObject = { a: 1 };
  symbolObject[Symbol("metadata")] = true;
  throws(
    () => find(symbolObject, { key: "a" }),
    /^ast-monkey\/find\(\): \[THROW_ID_05]/,
    "14.11",
  );

  const symbolArray = [];
  symbolArray[Symbol("metadata")] = true;
  throws(
    () => find(symbolArray, { key: "a" }),
    /^ast-monkey\/find\(\): \[THROW_ID_05]/,
    "14.12",
  );

  const extendedArray = [];
  extendedArray.extra = true;
  throws(
    () => find(extendedArray, { key: "a" }),
    /^ast-monkey\/find\(\): \[THROW_ID_05]/,
    "14.13",
  );

  const hiddenObject = {};
  Object.defineProperty(hiddenObject, "hidden", { value: true });
  throws(
    () => find(hiddenObject, { key: "a" }),
    /^ast-monkey\/find\(\): \[THROW_ID_05]/,
    "14.14",
  );

  const hiddenArray = [];
  Object.defineProperty(hiddenArray, "0", { value: true });
  hiddenArray.length = 1;
  throws(
    () => find(hiddenArray, { key: "a" }),
    /^ast-monkey\/find\(\): \[THROW_ID_05]/,
    "14.15",
  );

  let getterReads = 0;
  const accessorObject = {};
  Object.defineProperty(accessorObject, "value", {
    enumerable: true,
    get() {
      getterReads += 1;
      return true;
    },
  });
  throws(
    () => find(accessorObject, { key: "a" }),
    /^ast-monkey\/find\(\): \[THROW_ID_05]/,
    "14.16",
  );
  equal(getterReads, 0, "14.17");

  throws(
    () => find({ child: Symbol("value") }, { key: "a" }),
    /^ast-monkey\/find\(\): \[THROW_ID_05]/,
    "14.18",
  );

  const customPrototypeOptions = Object.create({ key: "a" });
  customPrototypeOptions.val = 1;
  throws(
    () => find({ a: 1 }, customPrototypeOptions),
    /^ast-monkey\/find\(\): \[THROW_ID_02]/,
    "14.19",
  );
});

test("15 - plain selector options use own snapshotted values", () => {
  const valueOpts = runInNewContext('Object.prototype.key = "a"; ({ val: 1 })');
  equal(
    find({ a: 1, b: 1 }, valueOpts),
    [
      { index: 1, key: "a", val: 1, path: [1] },
      { index: 2, key: "b", val: 1, path: [2] },
    ],
    "15.01",
  );
  equal(del({ a: 1, b: 1 }, valueOpts), {}, "15.02");

  const keyOpts = runInNewContext('Object.prototype.val = 999; ({ key: "a" })');
  equal(
    find({ a: 1, b: 1 }, keyOpts),
    [{ index: 1, key: "a", val: 1, path: [1] }],
    "15.03",
  );

  const filterOpts = runInNewContext(
    'Object.prototype.only = "array"; ({ key: "a" })',
  );
  equal(
    find({ a: 1 }, filterOpts),
    [{ index: 1, key: "a", val: 1, path: [1] }],
    "15.04",
  );

  let valReads = 0;
  let onlyReads = 0;
  const accessorOpts = { key: null };
  Object.defineProperties(accessorOpts, {
    only: {
      enumerable: true,
      get() {
        onlyReads += 1;
        return "object";
      },
    },
    val: {
      enumerable: true,
      get() {
        valReads += 1;
        return 1;
      },
    },
  });
  equal(find({ a: 1, b: 2 }, accessorOpts).length, 1, "15.05");
  equal(valReads, 1, "15.06");
  equal(onlyReads, 1, "15.07");

  let kindReads = 0;
  let criteriaKeyReads = 0;
  const accessorCriteria = {};
  Object.defineProperties(accessorCriteria, {
    key: {
      enumerable: true,
      get() {
        criteriaKeyReads += 1;
        return "a";
      },
    },
    kind: {
      enumerable: true,
      get() {
        kindReads += 1;
        return "key";
      },
    },
  });
  equal(find({ a: 1 }, { criteria: accessorCriteria }).length, 1, "15.08");
  equal(kindReads, 1, "15.09");
  equal(criteriaKeyReads, 1, "15.10");
});

test("16 - option getter failures retain package-owned prefixes", () => {
  let getReads = 0;
  const getOpts = {};
  Object.defineProperty(getOpts, "index", {
    enumerable: true,
    get() {
      getReads += 1;
      throw new Error("get index failed");
    },
  });
  throws(
    () => get({ a: 1 }, getOpts),
    /^ast-monkey\/get\(\): \[THROW_ID_09]/,
    "16.01",
  );
  equal(getReads, 1, "16.02");

  let setReads = 0;
  const setOpts = { val: 2 };
  Object.defineProperty(setOpts, "index", {
    enumerable: true,
    get() {
      setReads += 1;
      throw new Error("set index failed");
    },
  });
  throws(
    () => set({ a: 1 }, setOpts),
    /^ast-monkey\/set\(\): \[THROW_ID_16]/,
    "16.03",
  );
  equal(setReads, 1, "16.04");

  let dropReads = 0;
  const dropOpts = {};
  Object.defineProperty(dropOpts, "index", {
    enumerable: true,
    get() {
      dropReads += 1;
      throw new Error("drop index failed");
    },
  });
  throws(
    () => drop({ a: 1 }, dropOpts),
    /^ast-monkey\/drop\(\): \[THROW_ID_22]/,
    "16.05",
  );
  equal(dropReads, 1, "16.06");

  throws(
    () => find({ a: 1 }, null),
    /^ast-monkey\/find\(\): \[THROW_ID_02]/,
    "16.07",
  );
});

test.run();
