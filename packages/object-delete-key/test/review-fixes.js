// biome-ignore-all lint/suspicious/noExplicitAny: runtime boundary probes
import { test } from "uvu";
import { equal, is, ok, throws } from "uvu/assert";
import { runInNewContext } from "node:vm";

import { defaults, deleteKey, version } from "../dist/object-delete-key.esm.js";

const hasOwn = Object.prototype.hasOwnProperty;

function makeDeepObject(depth, leafKey = "target", leafValue = "remove") {
  const root = {};
  let current = root;
  for (let index = 0; index < depth; index++) {
    current.next = {};
    current = current.next;
  }
  current[leafKey] = leafValue;
  return root;
}

function deepestObject(root, depth) {
  let current = root;
  for (let index = 0; index < depth; index++) {
    current = current.next;
  }
  return current;
}

test("01 - preserves and explicitly selects NaN without sentinel collisions", () => {
  const input = {
    a: NaN,
    arr: [NaN, Infinity, -Infinity, -0, 0],
    remove: true,
  };
  const cleaned = deleteKey(input, { key: "remove" });
  const uncleaned = deleteKey(input, { cleanup: false, key: "remove" });

  equal(
    [
      Number.isNaN(cleaned.a),
      Number.isNaN(cleaned.arr[0]),
      Number.isNaN(uncleaned.a),
      Number.isNaN(uncleaned.arr[0]),
      Object.is(cleaned.arr[3], -0),
      Object.is(cleaned.arr[4], 0),
    ],
    [true, true, true, true, true, true],
    "01.01",
  );
  equal(deleteKey({ a: NaN, b: 1 }, { val: NaN }), { b: 1 }, "01.02");
  equal(
    deleteKey({ a: NaN, b: 1 }, { cleanup: false, key: "a", val: NaN }),
    { b: 1 },
    "01.03",
  );
});

test("02 - preserves explicit undefined array entries and sparse holes", () => {
  const sparse = new Array(6);
  sparse[1] = undefined;
  sparse[3] = "keep";
  sparse[5] = undefined;

  const shapes = [];
  for (const cleanup of [true, false]) {
    const noMatch = deleteKey({ sparse }, { cleanup, key: "missing" });
    const unrelatedMatch = deleteKey(
      { remove: true, sparse },
      { cleanup, key: "remove" },
    );
    for (const result of [noMatch.sparse, unrelatedMatch.sparse]) {
      shapes.push([
        result.length,
        hasOwn.call(result, 0),
        hasOwn.call(result, 1),
        result[1],
        hasOwn.call(result, 2),
        hasOwn.call(result, 3),
        hasOwn.call(result, 4),
        hasOwn.call(result, 5),
      ]);
    }
  }
  equal(
    shapes,
    Array.from({ length: 4 }, () => [
      6,
      false,
      true,
      undefined,
      false,
      true,
      false,
      true,
    ]),
    "02.01",
  );
  equal(Object.keys(sparse), ["1", "3", "5"], "02.02");
});

test("03 - shifts holes exactly once after selected array elements", () => {
  const values = new Array(6);
  values[0] = "remove";
  values[2] = undefined;
  values[3] = "remove";
  values[5] = "keep";
  const result = deleteKey(values, { cleanup: false, key: "remove" });

  equal(
    [
      result.length,
      hasOwn.call(result, 0),
      hasOwn.call(result, 1),
      result[1],
      hasOwn.call(result, 2),
      result[3],
    ],
    [4, false, true, undefined, false, "keep"],
    "03.01",
  );
});

test("04 - distinguishes omitted, null and explicit undefined selectors", () => {
  equal(deleteKey({ a: 1, b: 2 }, { key: "a" }), { b: 2 }, "04.01");
  equal(
    deleteKey({ a: 1, b: 2 }, { key: "a", val: undefined }),
    { a: 1, b: 2 },
    "04.02",
  );
  equal(
    deleteKey({ a: undefined, b: 2 }, { key: "a", val: undefined }),
    { b: 2 },
    "04.03",
  );
  equal(
    deleteKey({ a: undefined, b: null, c: 2 }, { val: undefined }),
    { b: null, c: 2 },
    "04.04",
  );
  equal(
    deleteKey({ a: undefined, b: null, c: 2 }, { key: null, val: null }),
    { a: undefined, c: 2 },
    "04.05",
  );
});

test("05 - retains the legacy object and array selector asymmetry", () => {
  const input = { arr: ["x"], x: "x", y: "x" };
  equal(deleteKey(input, { val: "x" }), { arr: ["x"] }, "05.01");
  equal(deleteKey(input, { key: "x" }), { y: "x" }, "05.02");
  equal(
    deleteKey(input, { key: "x", val: "x" }),
    { arr: ["x"], y: "x" },
    "05.03",
  );
  equal(
    deleteKey(input, { key: "x", only: "arrays" }),
    { x: "x", y: "x" },
    "05.04",
  );
  equal(
    deleteKey(input, { key: "x", only: "OBJECTS" }),
    { arr: ["x"], y: "x" },
    "05.05",
  );
});

test("06 - supports every published only alias", () => {
  const objectAliases = ["object", "objects", "obj", "ob", "o"];
  const arrayAliases = ["array", "arrays", "arr", "aray", "a"];
  const anyAliases = [
    "any",
    "all",
    "everything",
    "both",
    "either",
    "each",
    "whatever",
    "whatevs",
    "e",
  ];
  equal(
    objectAliases.map((only) =>
      deleteKey({ a: "x", list: ["a"] }, { key: "a", only }),
    ),
    objectAliases.map(() => ({ list: ["a"] })),
    "06.01",
  );
  equal(
    arrayAliases.map((only) =>
      deleteKey({ a: "x", list: ["a"] }, { key: "a", only }),
    ),
    arrayAliases.map(() => ({ a: "x" })),
    "06.02",
  );
  equal(
    anyAliases.map((only) =>
      deleteKey({ a: "x", list: ["a"] }, { key: "a", only }),
    ),
    anyAliases.map(() => ({})),
    "06.03",
  );
});

test("07 - resolves defaults, inherited fields and getters deterministically", () => {
  equal(
    deleteKey({ a: { target: true } }, { cleanup: undefined, key: "target" }),
    {},
    "07.01",
  );
  equal(
    deleteKey({ a: { target: true } }, { key: "target", only: undefined }),
    {},
    "07.02",
  );

  const inheritedDescriptors = {
    cleanup: Object.getOwnPropertyDescriptor(Object.prototype, "cleanup"),
    key: Object.getOwnPropertyDescriptor(Object.prototype, "key"),
    only: Object.getOwnPropertyDescriptor(Object.prototype, "only"),
  };
  let inheritedResult;
  try {
    Object.defineProperties(Object.prototype, {
      cleanup: { configurable: true, enumerable: true, value: false },
      key: { configurable: true, enumerable: true, value: "wrong" },
      only: { configurable: true, enumerable: true, value: "array" },
    });
    inheritedResult = deleteKey({ a: { x: "remove" } }, { val: "remove" });
  } finally {
    for (const key of ["cleanup", "key", "only"]) {
      const descriptor = inheritedDescriptors[key];
      if (descriptor) {
        Object.defineProperty(Object.prototype, key, descriptor);
      } else {
        delete Object.prototype[key];
      }
    }
  }
  equal(inheritedResult, {}, "07.03");

  const reads = { cleanup: 0, key: 0, only: 0 };
  const accessors = {};
  for (const [key, value] of [
    ["key", "target"],
    ["cleanup", true],
    ["only", "any"],
  ]) {
    Object.defineProperty(accessors, key, {
      enumerable: true,
      get() {
        reads[key] += 1;
        return value;
      },
    });
  }
  equal(deleteKey({ target: true }, accessors), {}, "07.04");
  equal(reads, { cleanup: 1, key: 1, only: 1 }, "07.05");

  const nullPrototypeOptions = Object.create(null);
  nullPrototypeOptions.val = "remove";
  equal(
    deleteKey({ keep: true, remove: "remove" }, nullPrototypeOptions),
    { keep: true },
    "07.06",
  );

  const foreignOptions = runInNewContext('({ key: "remove" })');
  equal(
    deleteKey({ keep: true, remove: true }, foreignOptions),
    { keep: true },
    "07.07",
  );
});

test("08 - emits package-owned source-ordered validation errors", () => {
  const id = (number) =>
    new RegExp(`^object-delete-key/deleteKey\\(\\): \\[THROW_ID_${number}\\]`);
  throws(() => deleteKey(), id("01"), "08.01");
  throws(() => deleteKey({}, null), id("02"), "08.02");
  throws(() => deleteKey({}, []), id("02"), "08.03");
  throws(() => deleteKey({}, new Date(0)), id("02"), "08.04");

  const hostileOptions = new Proxy(
    {},
    {
      ownKeys() {
        throw new Error("no keys");
      },
    },
  );
  throws(() => deleteKey({}, hostileOptions), id("03"), "08.05");
  throws(() => deleteKey({}, { key: "x", typo: true }), id("04"), "08.06");

  const throwingGetter = {};
  Object.defineProperty(throwingGetter, "key", {
    enumerable: true,
    get() {
      throw new Error("no value");
    },
  });
  throws(() => deleteKey({}, throwingGetter), id("05"), "08.07");
  throws(() => deleteKey({}, { key: undefined }), id("06"), "08.08");
  throws(() => deleteKey({}, {}), id("07"), "08.09");
  throws(
    () => deleteKey({}, { cleanup: "false", key: "x" }),
    id("08"),
    "08.10",
  );
  throws(() => deleteKey({}, { key: "x", only: null }), id("09"), "08.11");
  throws(() => deleteKey({}, { key: "x", only: "map" }), id("10"), "08.12");
  throws(
    () => deleteKey({}, { key: "x", reportCompletionFunc: true }),
    id("11"),
    "08.13",
  );
  throws(
    () => deleteKey({}, { key: "x", reportProgressFunc: true }),
    id("12"),
    "08.14",
  );
  throws(
    () => deleteKey({}, { key: "x", reportProgressFuncFrom: NaN }),
    id("13"),
    "08.15",
  );
  throws(
    () => deleteKey({}, { key: "x", reportProgressFuncTo: Infinity }),
    id("14"),
    "08.16",
  );
  throws(
    () =>
      deleteKey(
        {},
        {
          key: "x",
          reportProgressFuncFrom: 2,
          reportProgressFuncTo: 1,
        },
      ),
    id("15"),
    "08.17",
  );
  throws(
    () =>
      deleteKey(
        {},
        {
          key: "x",
          reportProgressFuncFrom: -Number.MAX_VALUE,
          reportProgressFuncTo: Number.MAX_VALUE,
        },
      ),
    id("16"),
    "08.18",
  );

  const cyclicPattern = {};
  cyclicPattern.self = cyclicPattern;
  throws(() => deleteKey({}, { val: cyclicPattern }), id("17"), "08.19");
  const cyclicInput = {};
  cyclicInput.self = cyclicInput;
  throws(() => deleteKey(cyclicInput, { key: "x" }), id("18"), "08.20");
});

test("09 - rejects aliases, custom containers and unsafe tree fields", () => {
  const shared = { x: 1 };
  throws(
    () => deleteKey({ a: shared, b: shared }, { key: "x" }),
    /THROW_ID_18/,
    "09.01",
  );
  throws(
    () => deleteKey({ a: new Date(0) }, { key: "x" }),
    /THROW_ID_18/,
    "09.02",
  );
  throws(() => deleteKey({ a: 1n }, { key: "x" }), /THROW_ID_18/, "09.03");
  throws(
    () => deleteKey({ [Symbol("x")]: 1 }, { key: "x" }),
    /THROW_ID_18/,
    "09.04",
  );

  let reads = 0;
  const accessorInput = {};
  Object.defineProperty(accessorInput, "x", {
    enumerable: true,
    get() {
      reads += 1;
      return 1;
    },
  });
  throws(() => deleteKey(accessorInput, { key: "x" }), /THROW_ID_18/, "09.05");
  is(reads, 0, "09.06");

  throws(() => deleteKey({ a() {} }, { key: "x" }), /THROW_ID_18/, "09.07");
  throws(
    () => deleteKey({ a: Symbol("value") }, { key: "x" }),
    /THROW_ID_18/,
    "09.08",
  );
  const customPrototype = { a: 1 };
  Object.setPrototypeOf(customPrototype, { inherited: true });
  throws(
    () => deleteKey(customPrototype, { key: "x" }),
    /THROW_ID_18/,
    "09.09",
  );
  throws(
    () => deleteKey(Object.create(null), { key: "x" }),
    /THROW_ID_18/,
    "09.10",
  );
  const nonEnumerable = {};
  Object.defineProperty(nonEnumerable, "hidden", { value: 1 });
  throws(() => deleteKey(nonEnumerable, { key: "x" }), /THROW_ID_18/, "09.11");
  const expandedArray = [];
  expandedArray.extra = true;
  throws(() => deleteKey(expandedArray, { key: "x" }), /THROW_ID_18/, "09.12");
  const hostilePrototype = new Proxy(
    {},
    {
      getPrototypeOf() {
        throw new Error("no prototype");
      },
    },
  );
  throws(() => deleteKey({}, hostilePrototype), /THROW_ID_02/, "09.13");
  const sharedPattern = { x: 1 };
  throws(
    () => deleteKey({}, { val: { a: sharedPattern, b: sharedPattern } }),
    /THROW_ID_17/,
    "09.14",
  );
  let patternReads = 0;
  const accessorPattern = {};
  Object.defineProperty(accessorPattern, "x", {
    enumerable: true,
    get() {
      patternReads += 1;
      return 1;
    },
  });
  throws(() => deleteKey({}, { val: accessorPattern }), /THROW_ID_17/, "09.15");
  is(patternReads, 0, "09.16");

  const { proxy: revokedInput, revoke } = Proxy.revocable({}, {});
  revoke();
  throws(
    () => deleteKey(revokedInput, { key: "x" }),
    /THROW_ID_18.*container inspection failed/,
    "09.17",
  );

  let disappearingReads = 0;
  const disappearingField = new Proxy(
    { x: 1 },
    {
      getOwnPropertyDescriptor(target, key) {
        disappearingReads += 1;
        return disappearingReads === 1
          ? Reflect.getOwnPropertyDescriptor(target, key)
          : undefined;
      },
    },
  );
  throws(
    () => deleteKey(disappearingField, { key: "x" }),
    /THROW_ID_18.*changed during traversal/,
    "09.18",
  );

  let throwingReads = 0;
  const throwingField = new Proxy(
    { x: 1 },
    {
      getOwnPropertyDescriptor(target, key) {
        throwingReads += 1;
        if (throwingReads > 1) {
          throw new Error("descriptor changed");
        }
        return Reflect.getOwnPropertyDescriptor(target, key);
      },
    },
  );
  throws(
    () => deleteKey(throwingField, { key: "x" }),
    /THROW_ID_18.*tree inspection failed/,
    "09.19",
  );
  let nonEnumerableReads = 0;
  const changingEnumerability = new Proxy(
    { x: 1 },
    {
      getOwnPropertyDescriptor(target, key) {
        nonEnumerableReads += 1;
        const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
        return nonEnumerableReads === 1
          ? descriptor
          : { ...descriptor, enumerable: false };
      },
    },
  );
  throws(
    () => deleteKey(changingEnumerability, { key: "x" }),
    /THROW_ID_18.*changed during traversal/,
    "09.20",
  );
  throws(
    () => deleteKey(() => undefined, { key: "x" }),
    /THROW_ID_18.*unsupported function/,
    "09.21",
  );

  let lengthReads = 0;
  const unstableArray = new Proxy([1], {
    get(target, key, receiver) {
      if (key === "length") {
        lengthReads += 1;
        if (lengthReads > 1) {
          throw new Error("length changed");
        }
      }
      return Reflect.get(target, key, receiver);
    },
  });
  throws(
    () => deleteKey(unstableArray, { key: "x" }),
    /THROW_ID_18.*tree inspection failed/,
    "09.22",
  );

  const revocable = Proxy.revocable({ x: 1 }, {});
  const revokingInput = new Proxy(revocable.proxy, {
    getOwnPropertyDescriptor(target, key) {
      const descriptor = Reflect.getOwnPropertyDescriptor(target, key);
      revocable.revoke();
      return descriptor;
    },
  });
  throws(
    () => deleteKey(revokingInput, { key: "x" }),
    /THROW_ID_18.*container inspection failed/,
    "09.23",
  );

  const foreignObject = runInNewContext("({ keep: true, remove: true })");
  const foreignArray = runInNewContext('["remove", "keep"]');
  equal(deleteKey(foreignObject, { key: "remove" }), { keep: true }, "09.24");
  equal(deleteKey(foreignArray, { key: "remove" }), ["keep"], "09.25");
  const foreignPattern = runInNewContext('({ tag: "drop-*" })');
  equal(
    deleteKey(
      { drop: { tag: "drop-value" }, keep: { tag: "keep" } },
      { val: foreignPattern },
    ),
    { keep: { tag: "keep" } },
    "09.26",
  );

  const spoofedObjectPrototype = Object.create(Object.prototype, {
    constructor: { value: Object },
    inherited: { enumerable: true, value: "custom" },
  });
  const spoofedObject = Object.create(spoofedObjectPrototype);
  spoofedObject.keep = true;
  throws(
    () => deleteKey(spoofedObject, { key: "missing" }),
    /THROW_ID_18.*custom container prototypes/,
    "09.27",
  );

  const nullParentSpoof = Object.create(null, {
    constructor: { value: Object },
    inherited: { enumerable: true, value: "custom" },
  });
  const nullParentSpoofedObject = Object.create(nullParentSpoof);
  nullParentSpoofedObject.keep = true;
  throws(
    () => deleteKey(nullParentSpoofedObject, { key: "missing" }),
    /THROW_ID_18.*custom container prototypes/,
    "09.28",
  );

  const hostileTreePrototype = new Proxy(Object.prototype, {
    getOwnPropertyDescriptor() {
      throw new Error("prototype descriptor unavailable");
    },
  });
  const hostilePrototypeObject = Object.create(hostileTreePrototype);
  hostilePrototypeObject.keep = true;
  throws(
    () => deleteKey(hostilePrototypeObject, { key: "missing" }),
    /THROW_ID_18.*custom container prototypes/,
    "09.29",
  );

  const spoofedArrayPrototype = [];
  Object.defineProperty(spoofedArrayPrototype, "constructor", { value: Array });
  const spoofedArray = ["keep"];
  Object.setPrototypeOf(spoofedArray, spoofedArrayPrototype);
  throws(
    () => deleteKey(spoofedArray, { key: "missing" }),
    /THROW_ID_18.*custom container prototypes/,
    "09.30",
  );
});

test("10 - freezes exported defaults without using them as live configuration", () => {
  ok(Object.isFrozen(defaults), "10.01");
  throws(
    () => {
      defaults.cleanup = false;
    },
    TypeError,
    "10.02",
  );
  throws(
    () => {
      delete defaults.only;
    },
    TypeError,
    "10.03",
  );
  throws(
    () => {
      defaults.extra = true;
    },
    TypeError,
    "10.04",
  );
  equal(
    defaults,
    {
      cleanup: true,
      key: null,
      only: "any",
      reportCompletionFunc: null,
      reportProgressFunc: null,
      reportProgressFuncFrom: 0,
      reportProgressFuncTo: 100,
      val: undefined,
    },
    "10.05",
  );
  equal(deleteKey({ a: { target: true } }, { key: "target" }), {}, "10.06");
  is(version.length > 0, true, "10.07");
});

test("11 - prunes only affected strict-empty ancestry", () => {
  const input = {
    affected: {
      emptySibling: { nested: [""] },
      target: "remove",
    },
    falseBlocksCleanup: { target: "remove", value: false },
    holeBlocksCleanup: new Array(1),
    nanBlocksCleanup: { target: "remove", value: NaN },
    nullBlocksCleanup: { target: "remove", value: null },
    numberBlocksCleanup: { target: "remove", value: 0 },
    unrelatedEmpty: { nested: [""] },
    undefinedBlocksCleanup: { target: "remove", value: undefined },
    whitespaceBlocksCleanup: { target: "remove", value: " " },
  };
  equal(
    deleteKey(input, { key: "target" }),
    {
      falseBlocksCleanup: { value: false },
      holeBlocksCleanup: new Array(1),
      nanBlocksCleanup: { value: NaN },
      nullBlocksCleanup: { value: null },
      numberBlocksCleanup: { value: 0 },
      unrelatedEmpty: { nested: [""] },
      undefinedBlocksCleanup: { value: undefined },
      whitespaceBlocksCleanup: { value: " " },
    },
    "11.01",
  );
});

test("12 - handles nested matches and adjacent array deletions once", () => {
  equal(
    deleteKey(
      {
        remove: { remove: "remove" },
        values: ["remove", "remove", "keep", "remove"],
      },
      { cleanup: false, key: "remove" },
    ),
    { values: ["keep"] },
    "12.01",
  );
});

test("13 - handles depth 10000 with cleanup on and off", () => {
  const depth = 10_000;
  const input = makeDeepObject(depth);
  equal(deleteKey(input, { key: "target" }), {}, "13.01");

  const retained = deleteKey(input, { cleanup: false, key: "target" });
  equal(deepestObject(retained, depth), {}, "13.02");
  is(input.next === retained.next, false, "13.03");

  const noMatch = deleteKey(input, { key: "missing" });
  is(deepestObject(noMatch, depth).target, "remove", "13.04");
});

test("14 - handles deeply nested arrays without native recursion", () => {
  const depth = 10_000;
  const root = [];
  let current = root;
  for (let index = 0; index < depth; index++) {
    const child = [];
    current.push(child);
    current = child;
  }
  current.push("remove");
  equal(deleteKey(root, { key: "remove" }), [], "14.01");
});

test("15 - returns independent mutable trees from frozen and no-match inputs", () => {
  const nested = Object.freeze({ keep: "yes" });
  const input = Object.freeze([nested]);
  const result = deleteKey(input, { key: "missing" });
  is(result === input, false, "15.01");
  is(result[0] === nested, false, "15.02");
  result[0].keep = "changed";
  is(nested.keep, "yes", "15.03");
});

test("16 - accepts every explicit primitive root as an unchanged no-op", () => {
  const values = [undefined, null, false, true, 0, -0, NaN, Infinity, "x"];
  equal(
    values.map((value) => Object.is(deleteKey(value, { key: "x" }), value)),
    values.map(() => true),
    "16.01",
  );
});

test("17 - preserves wildcard matching in keys and structured values", () => {
  equal(
    deleteKey(
      {
        apples: { tag: "keep" },
        apricots: { tag: "drop-one" },
        bananas: { tag: "drop-two" },
      },
      { key: "a*", val: { tag: "drop-*" } },
    ),
    {
      apples: { tag: "keep" },
      bananas: { tag: "drop-two" },
    },
    "17.01",
  );
});

test("18 - preserves own __proto__ data without changing prototypes", () => {
  const input = {};
  Object.defineProperty(input, "__proto__", {
    enumerable: true,
    value: { keep: true },
  });
  input.remove = true;
  const result = deleteKey(input, { key: "remove" });
  is(Object.getPrototypeOf(result), Object.prototype, "18.01");
  is(hasOwn.call(result, "__proto__"), true, "18.02");
  equal(
    Object.getOwnPropertyDescriptor(result, "__proto__").value,
    { keep: true },
    "18.03",
  );
});

test("19 - completes a wide all-match transform in linear structure", () => {
  const input = {};
  for (let index = 0; index < 100_000; index++) {
    input[`drop-${index}`] = true;
  }
  let completion;
  equal(
    deleteKey(input, {
      key: "drop-*",
      reportCompletionFunc(stats) {
        completion = stats;
      },
    }),
    {},
    "19.01",
  );
  equal(
    [
      completion.cleanupPrunedContainers,
      completion.directDeletions,
      completion.maxDepth,
      completion.totalEntries,
      completion.visitedEntries,
      typeof completion.timeTakenInMilliseconds,
      Object.isFrozen(completion),
    ],
    [0, 100_000, 1, 100_000, 100_000, "number", true],
    "19.02",
  );
});

test("20 - reports composable progress and frozen completion statistics", () => {
  const originalNow = Date.now;
  const times = [100, 130];
  const progress = [];
  let completion;
  let result;
  try {
    Date.now = () => times.shift();
    result = deleteKey(
      { a: { target: "remove" }, b: "keep" },
      {
        key: "target",
        reportCompletionFunc(stats) {
          completion = stats;
        },
        reportProgressFunc(value) {
          progress.push(value);
        },
        reportProgressFuncFrom: 20,
        reportProgressFuncTo: 40,
      },
    );
  } finally {
    Date.now = originalNow;
  }
  equal(result, { b: "keep" }, "20.01");
  equal(progress, [20, 26.6, 33.2, 40], "20.02");
  equal(
    completion,
    {
      cleanupPrunedContainers: 1,
      directDeletions: 1,
      maxDepth: 2,
      timeTakenInMilliseconds: 30,
      totalEntries: 3,
      visitedEntries: 3,
    },
    "20.03",
  );
  ok(Object.isFrozen(completion), "20.04");

  equal(
    deleteKey(
      { remove: true },
      {
        key: "remove",
        reportCompletionFunc() {
          throw new Error("ignored completion error");
        },
        reportProgressFunc() {
          throw new Error("ignored progress error");
        },
      },
    ),
    {},
    "20.05",
  );

  let validationCallbacks = 0;
  const cyclic = {};
  cyclic.self = cyclic;
  throws(
    () =>
      deleteKey(cyclic, {
        key: "x",
        reportCompletionFunc() {
          validationCallbacks += 1;
        },
        reportProgressFunc() {
          validationCallbacks += 1;
        },
      }),
    /THROW_ID_18/,
    "20.06",
  );
  is(validationCallbacks, 0, "20.07");

  const emptyProgress = [];
  let emptyCompletion;
  equal(
    deleteKey(
      {},
      {
        key: "x",
        reportCompletionFunc(stats) {
          emptyCompletion = stats;
        },
        reportProgressFunc(value) {
          emptyProgress.push(value);
        },
      },
    ),
    {},
    "20.08",
  );
  equal(emptyProgress, [0, 100], "20.09");
  equal(
    [
      emptyCompletion.maxDepth,
      emptyCompletion.totalEntries,
      emptyCompletion.visitedEntries,
    ],
    [0, 0, 0],
    "20.10",
  );

  let arrayCompletion;
  equal(
    deleteKey(["remove", "keep"], {
      key: "remove",
      reportCompletionFunc(stats) {
        arrayCompletion = stats;
      },
    }),
    ["keep"],
    "20.11",
  );
  is(arrayCompletion.directDeletions, 1, "20.12");

  const clockResults = [];
  for (const fakeNow of [
    () => Number.NaN,
    (() => {
      let calls = 0;
      return () => {
        calls += 1;
        if (calls === 2) {
          throw new Error("clock unavailable");
        }
        return 50;
      };
    })(),
    (() => {
      const values = [50, 40];
      return () => values.shift() ?? 0;
    })(),
    (() => {
      const values = [-Number.MAX_VALUE, Number.MAX_VALUE];
      return () => values.shift() ?? 0;
    })(),
  ]) {
    let stats;
    try {
      Date.now = fakeNow;
      deleteKey(
        { keep: true, match: { x: 1 } },
        {
          val: { x: 1 },
          reportCompletionFunc(value) {
            stats = value;
          },
        },
      );
    } finally {
      Date.now = originalNow;
    }
    clockResults.push(stats.timeTakenInMilliseconds);
  }
  equal(clockResults, [0, 0, 0, 0], "20.13");
});

test("21 - keeps filtering and cleanup tied to containing parents", () => {
  const nonEnumerableOptions = {};
  Object.defineProperty(nonEnumerableOptions, "val", { value: "remove" });
  equal(deleteKey({ a: "remove" }, nonEnumerableOptions), {}, "21.01");

  const unknownNonEnumerable = { key: "x" };
  Object.defineProperty(unknownNonEnumerable, "typo", { value: true });
  throws(() => deleteKey({}, unknownNonEnumerable), /THROW_ID_04/, "21.02");
  throws(
    () => deleteKey({}, { key: "x", [Symbol("typo")]: true }),
    /THROW_ID_04/,
    "21.03",
  );
  equal(deleteKey(["keep", "0"], { key: "0" }), ["keep"], "21.04");
  equal(
    deleteKey({ list: [{ target: "" }] }, { key: "target", only: "object" }),
    {},
    "21.05",
  );
  equal(
    deleteKey({ holder: { list: ["x"] } }, { key: "x", only: "array" }),
    {},
    "21.06",
  );
  equal(
    deleteKey(
      { list: [{ target: "" }] },
      { cleanup: false, key: "target", only: "object" },
    ),
    { list: [{}] },
    "21.07",
  );
  equal(
    deleteKey({ a: "x", list: ["a"] }, { key: "a", only: "  ArRaYs  " }),
    { a: "x" },
    "21.08",
  );
});

test("22 - preserves negated and escaped whole-string wildcard matching", () => {
  equal(deleteKey({ x: 1, y: 2 }, { key: "!x" }), { x: 1 }, "22.01");
  equal(deleteKey({ "a*": 1, abc: 2 }, { key: "a\\*" }), { abc: 2 }, "22.02");
});

test.run();
