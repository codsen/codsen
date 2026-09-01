import { runInNewContext } from "node:vm";

import { test } from "uvu";
import { equal, is, not, ok, throws } from "uvu/assert";

import { defaults, isEmpty } from "../dist/ast-is-empty.esm.js";

// ==============================
// strict strings and tri-state semantics
// ==============================

test("01 - strings are strictly empty", () => {
  equal(isEmpty(""), true, "01.01");
  equal(isEmpty(" "), false, "01.02");
  equal(isEmpty("\n\t"), false, "01.03");
  equal(isEmpty("."), false, "01.04");
});

test("02 - recursively empty supported trees return true", () => {
  equal(isEmpty([]), true, "02.01");
  equal(isEmpty({}), true, "02.02");
  equal(isEmpty(["", [""], { value: ["", {}] }]), true, "02.03");
});

test("03 - supported content returns false", () => {
  equal(isEmpty(["", [" "]]), false, "03.01");
  equal(isEmpty({ first: "", nested: { value: "." } }), false, "03.02");
});

test("04 - unsupported leaves return null at every depth", () => {
  const values = [
    null,
    undefined,
    false,
    true,
    0,
    1n,
    Symbol("leaf"),
    () => {},
    new String(""),
    new Number(0),
    new Boolean(false),
    new Date(0),
    /x/u,
    new Map(),
    new Set(),
    new (class Example {
      value = "";
    })(),
  ];
  ok(
    values.every((value) => isEmpty(value) === null),
    "04.01",
  );
  ok(
    values.every((value) => isEmpty({ value }) === null),
    "04.02",
  );
});

test("05 - array tri-state aggregation is commutative", () => {
  equal(isEmpty(["", "x"]), false, "05.01");
  equal(isEmpty(["x", ""]), false, "05.02");
  equal(isEmpty(["", 0]), null, "05.03");
  equal(isEmpty([0, ""]), null, "05.04");
  equal(isEmpty(["x", 0]), null, "05.05");
  equal(isEmpty([0, "x"]), null, "05.06");
});

test("06 - object tri-state aggregation ignores insertion order", () => {
  equal(isEmpty({ empty: "", content: "x" }), false, "06.01");
  equal(isEmpty({ content: "x", empty: "" }), false, "06.02");
  equal(isEmpty({ empty: "", unsupported: 0 }), null, "06.03");
  equal(isEmpty({ unsupported: 0, empty: "" }), null, "06.04");
  equal(isEmpty({ content: "x", unsupported: 0 }), null, "06.05");
  equal(isEmpty({ unsupported: 0, content: "x" }), null, "06.06");
});

test("07 - nested unsupported values dominate at every position", () => {
  equal(isEmpty([0, "", { content: "x" }]), null, "07.01");
  equal(isEmpty(["", { unsupported: 0 }, "x"]), null, "07.02");
  equal(isEmpty([{ content: "x" }, "", { unsupported: 0 }]), null, "07.03");
});

// ==============================
// object and array property domains
// ==============================

test("08 - symbol and non-enumerable object properties are ignored", () => {
  const input = { visible: "" };
  input[Symbol("hidden")] = 0;
  Object.defineProperty(input, "hidden", {
    enumerable: false,
    value: 0,
  });
  equal(isEmpty(input), true, "08.01");

  const decorated = { visible: "x", [Symbol.toStringTag]: "Record" };
  equal(isEmpty(decorated), false, "08.02");
});

test("09 - null-prototype and cross-realm records are supported", () => {
  const nullPrototype = Object.create(null);
  nullPrototype.value = "";
  equal(isEmpty(nullPrototype), true, "09.01");
  nullPrototype.value = "x";
  equal(isEmpty(nullPrototype), false, "09.02");

  equal(isEmpty(runInNewContext("({ value: '' })")), true, "09.03");
  equal(isEmpty(runInNewContext("({ value: 'x' })")), false, "09.04");
});

test("10 - array iterators are never consulted", () => {
  const hidden = ["x"];
  hidden[Symbol.iterator] = function* () {};
  equal(isEmpty(hidden), false, "10.01");

  const invented = [""];
  invented[Symbol.iterator] = function* () {
    yield 0;
  };
  equal(isEmpty(invented), true, "10.02");

  const poisoned = [""];
  Object.defineProperty(poisoned, Symbol.iterator, {
    get() {
      throw new Error("iterator accessed");
    },
  });
  equal(isEmpty(poisoned), true, "10.03");
  equal(isEmpty(runInNewContext("['']")), true, "10.04");
});

test("11 - sparse holes are unsupported slots", () => {
  equal(isEmpty(new Array(1)), null, "11.01");

  const middle = [""];
  middle.length = 3;
  middle[2] = "";
  equal(isEmpty(middle), null, "11.02");

  const trailing = [""];
  trailing.length = 2;
  equal(isEmpty(trailing), null, "11.03");

  const inherited = new Array(1);
  const prototype = Object.create(Array.prototype);
  prototype[0] = "";
  Object.setPrototypeOf(inherited, prototype);
  equal(isEmpty(inherited), null, "11.04");
});

test("12 - extra array properties are ignored", () => {
  const input = [];
  input.extra = 0;
  input[Symbol("extra")] = 0;
  Object.defineProperty(input, "hidden", {
    enumerable: false,
    value: 0,
  });
  equal(isEmpty(input), true, "12.01");

  const nonEnumerableSlot = [];
  Object.defineProperty(nonEnumerableSlot, 0, {
    enumerable: false,
    value: "",
  });
  equal(isEmpty(nonEnumerableSlot), true, "12.02");
});

test("13 - indexed accessors are read once", () => {
  let reads = 0;
  const input = [];
  Object.defineProperty(input, 0, {
    enumerable: true,
    get() {
      reads++;
      return "";
    },
  });
  input.length = 1;
  equal(isEmpty(input), true, "13.01");
  equal(reads, 1, "13.02");
});

// ==============================
// depth, cycles, aliases and immutability
// ==============================

test("14 - deep trees do not use the JavaScript call stack", () => {
  let emptyObjectTree = "";
  let contentArrayTree = "x";
  let unsupportedTree = 0;
  for (let index = 0; index < 10_000; index++) {
    emptyObjectTree = { value: emptyObjectTree };
    contentArrayTree = [contentArrayTree];
    unsupportedTree =
      index % 2 === 0 ? [unsupportedTree] : { value: unsupportedTree };
  }
  equal(isEmpty(emptyObjectTree), true, "14.01");
  equal(isEmpty(contentArrayTree), false, "14.02");
  equal(isEmpty(unsupportedTree), null, "14.03");
});

test("15 - direct and indirect cycles return null", () => {
  const objectCycle = {};
  objectCycle.self = objectCycle;
  equal(isEmpty(objectCycle), null, "15.01");

  const arrayCycle = [];
  arrayCycle.push(arrayCycle);
  equal(isEmpty(arrayCycle), null, "15.02");

  const first = {};
  const second = { first };
  first.second = second;
  equal(isEmpty(first), null, "15.03");

  const contentFirst = { content: "x", self: null };
  contentFirst.self = contentFirst;
  equal(isEmpty(contentFirst), null, "15.04");

  const cycleFirst = { self: null, content: "x" };
  cycleFirst.self = cycleFirst;
  equal(isEmpty(cycleFirst), null, "15.05");
});

test("16 - completed empty and content aliases are evaluated once", () => {
  let emptyReads = 0;
  const emptyLeaf = {};
  Object.defineProperty(emptyLeaf, "value", {
    enumerable: true,
    get() {
      emptyReads++;
      return "";
    },
  });
  equal(isEmpty([emptyLeaf, emptyLeaf]), true, "16.01");
  equal(emptyReads, 1, "16.02");

  let contentReads = 0;
  const contentLeaf = {};
  Object.defineProperty(contentLeaf, "value", {
    enumerable: true,
    get() {
      contentReads++;
      return "x";
    },
  });
  equal(isEmpty([contentLeaf, contentLeaf]), false, "16.03");
  equal(contentReads, 1, "16.04");
});

test("17 - compact shared graphs take unique-graph work", () => {
  let reads = 0;
  const leaf = {};
  Object.defineProperty(leaf, "value", {
    enumerable: true,
    get() {
      reads++;
      return "";
    },
  });
  let graph = leaf;
  for (let index = 0; index < 30; index++) graph = [graph, graph];
  equal(isEmpty(graph), true, "17.01");
  equal(reads, 1, "17.02");

  const unsupported = { value: 0 };
  equal(isEmpty([unsupported, unsupported]), null, "17.03");
});

test("18 - traversal leaves inputs and their property domains unchanged", () => {
  const shared = Object.freeze({ second: "", first: "" });
  const input = Object.freeze([shared, shared]);
  const before = JSON.stringify(input);
  const keys = Object.keys(shared);
  equal(isEmpty(input), true, "18.01");
  equal(JSON.stringify(input), before, "18.02");
  equal(Object.keys(shared), keys, "18.03");
  ok(Object.isFrozen(input), "18.04");
  ok(Object.isFrozen(shared), "18.05");
  is(input[0], shared, "18.06");
  is(input[1], shared, "18.07");

  const sparse = new Array(2);
  sparse[1] = "";
  const descriptor = Object.getOwnPropertyDescriptor(sparse, "1");
  equal(isEmpty(sparse), null, "18.08");
  equal(Object.getOwnPropertyDescriptor(sparse, "1"), descriptor, "18.09");
  equal(0 in sparse, false, "18.10");
  equal(sparse.length, 2, "18.11");
});

test("19 - known content cannot hide a later unsupported value", () => {
  let laterReads = 0;
  const input = {
    content: "x",
    get unsupported() {
      laterReads++;
      return 0;
    },
  };
  equal(isEmpty(input), null, "19.01");
  equal(laterReads, 1, "19.02");
});

// ==============================
// options and observability
// ==============================

test("20 - defaults are inert and frozen", () => {
  ok(Object.isFrozen(defaults), "20.01");
  equal(defaults.reportCompletionFunc, null, "20.02");
  equal(defaults.reportProgressFunc, null, "20.03");
  equal(defaults.reportProgressFuncFrom, 0, "20.04");
  equal(defaults.reportProgressFuncTo, 100, "20.05");
});

test("21 - null and explicitly undefined options use defaults", () => {
  equal(isEmpty([""], null), true, "21.01");
  equal(isEmpty("x", null), false, "21.02");
  equal(isEmpty(0, null), null, "21.03");
  equal(
    isEmpty([""], {
      reportCompletionFunc: undefined,
      reportProgressFunc: undefined,
      reportProgressFuncFrom: undefined,
      reportProgressFuncTo: undefined,
    }),
    true,
    "21.04",
  );

  const inherited = runInNewContext("Object.prototype.unknown = true; ({})");
  inherited[Symbol("unknown")] = true;
  equal(isEmpty("", inherited), true, "21.05");
});

test("22 - option validation uses ordered package-scoped identifiers", () => {
  throws(() => isEmpty("", []), /THROW_ID_01/u, "22.01");
  throws(() => isEmpty("", new Date(0)), /THROW_ID_01/u, "22.02");
  throws(() => isEmpty("", { unknown: true }), /THROW_ID_02/u, "22.03");
  throws(
    () => isEmpty("", { reportCompletionFunc: true }),
    /THROW_ID_03/u,
    "22.04",
  );
  throws(
    () => isEmpty("", { reportProgressFunc: true }),
    /THROW_ID_04/u,
    "22.05",
  );
  throws(
    () => isEmpty("", { reportProgressFuncFrom: Number.NaN }),
    /THROW_ID_05/u,
    "22.06",
  );
  throws(
    () => isEmpty("", { reportProgressFuncTo: Number.POSITIVE_INFINITY }),
    /THROW_ID_06/u,
    "22.07",
  );
  throws(
    () =>
      isEmpty("", {
        reportProgressFuncFrom: 51,
        reportProgressFuncTo: 50,
      }),
    /THROW_ID_07/u,
    "22.08",
  );
  throws(
    () =>
      isEmpty("", {
        reportProgressFunc() {},
        reportProgressFuncFrom: -Number.MAX_VALUE,
        reportProgressFuncTo: Number.MAX_VALUE,
      }),
    /THROW_ID_08/u,
    "22.09",
  );
});

test("23 - completion reports frozen deterministic statistics", () => {
  const shared = { value: "" };
  const input = { first: shared, list: ["", shared] };
  let completion;
  let completionCalls = 0;
  const originalNow = Date.now;
  let clockReads = 0;
  Date.now = () => {
    clockReads++;
    return clockReads === 1 ? 100 : 117;
  };
  try {
    equal(
      isEmpty(input, {
        reportCompletionFunc(stats) {
          completionCalls++;
          completion = stats;
        },
      }),
      true,
      "23.01",
    );
  } finally {
    Date.now = originalNow;
  }
  equal(
    completion,
    {
      aliasesSkipped: 1,
      arrayElementsVisited: 2,
      maxDepth: 2,
      objectPropertiesVisited: 3,
      timeTakenInMilliseconds: 17,
      uniqueContainersVisited: 3,
    },
    "23.02",
  );
  equal(completionCalls, 1, "23.03");
  equal(clockReads, 2, "23.04");
  ok(Object.isFrozen(completion), "23.05");
});

test("24 - null completion is reported exactly once", () => {
  let completion;
  let calls = 0;
  equal(
    isEmpty(["x", 0, "unreached"], {
      reportCompletionFunc(stats) {
        calls++;
        completion = stats;
      },
    }),
    null,
    "24.01",
  );
  equal(calls, 1, "24.02");
  equal(completion.arrayElementsVisited, 2, "24.03");
  equal(completion.maxDepth, 1, "24.04");
  equal(completion.uniqueContainersVisited, 1, "24.05");

  let rootCompletion;
  equal(
    isEmpty(null, {
      reportCompletionFunc(stats) {
        rootCompletion = stats;
      },
    }),
    null,
    "24.06",
  );
  equal(rootCompletion.uniqueContainersVisited, 0, "24.07");

  let objectCompletion;
  equal(
    isEmpty(
      { value: 0 },
      {
        reportCompletionFunc(stats) {
          objectCompletion = stats;
        },
      },
    ),
    null,
    "24.08",
  );
  equal(objectCompletion.objectPropertiesVisited, 1, "24.09");
});

test("25 - observed sparse holes count as inspected slots", () => {
  let completion;
  equal(
    isEmpty(new Array(2), {
      reportCompletionFunc(stats) {
        completion = stats;
      },
    }),
    null,
    "25.01",
  );
  equal(completion.arrayElementsVisited, 1, "25.02");
  equal(completion.maxDepth, 1, "25.03");
});

test("26 - observed cycles and aliases remain distinct", () => {
  const cycle = [];
  cycle.push(cycle);
  let cycleCompletion;
  equal(
    isEmpty(cycle, {
      reportCompletionFunc(stats) {
        cycleCompletion = stats;
      },
    }),
    null,
    "26.01",
  );
  equal(cycleCompletion.aliasesSkipped, 0, "26.02");
  equal(cycleCompletion.uniqueContainersVisited, 1, "26.03");

  const emptyShared = [];
  let emptyAliasCompletion;
  equal(
    isEmpty([emptyShared, emptyShared], {
      reportCompletionFunc(stats) {
        emptyAliasCompletion = stats;
      },
    }),
    true,
    "26.04",
  );
  equal(emptyAliasCompletion.aliasesSkipped, 1, "26.05");

  const contentShared = ["x"];
  let contentAliasCompletion;
  equal(
    isEmpty([contentShared, contentShared], {
      reportCompletionFunc(stats) {
        contentAliasCompletion = stats;
      },
    }),
    false,
    "26.06",
  );
  equal(contentAliasCompletion.aliasesSkipped, 1, "26.07");
});

test("27 - observed root strings preserve all three entry outcomes", () => {
  equal(isEmpty("", { reportProgressFunc() {} }), true, "27.01");
  equal(isEmpty("x", { reportProgressFunc() {} }), false, "27.02");
  equal(isEmpty(0, { reportProgressFunc() {} }), null, "27.03");
  equal(
    isEmpty(
      { nested: { value: "x" } },
      {
        reportProgressFunc() {},
      },
    ),
    false,
    "27.04",
  );
});

test("28 - large traversals report finite monotonic range progress", () => {
  const progress = [];
  const input = Array.from({ length: 2200 }, () => "x");
  equal(
    isEmpty(input, {
      reportProgressFunc(value) {
        progress.push(value);
      },
      reportProgressFuncFrom: 20,
      reportProgressFuncTo: 40,
    }),
    false,
    "28.01",
  );
  equal(progress[0], 20, "28.02");
  equal(progress[progress.length - 1], 40, "28.03");
  ok(progress.length > 2, "28.04");
  ok(progress.every(Number.isFinite), "28.05");
  ok(
    progress.every(
      (value, index) => index === 0 || value >= progress[index - 1],
    ),
    "28.06",
  );
  ok(
    progress.every((value) => value >= 20 && value <= 40),
    "28.07",
  );
});

test("29 - a zero-width progress range is reported without duplicates", () => {
  const progress = [];
  equal(
    isEmpty("", {
      reportProgressFunc(value) {
        progress.push(value);
      },
      reportProgressFuncFrom: 25,
      reportProgressFuncTo: 25,
    }),
    true,
    "29.01",
  );
  equal(progress, [25], "29.02");
});

test("30 - callback errors cannot change traversal semantics", () => {
  equal(
    isEmpty([""], {
      reportCompletionFunc() {
        throw new Error("completion failed");
      },
      reportProgressFunc() {
        throw new Error("progress failed");
      },
    }),
    true,
    "30.01",
  );
});

test("31 - failed clock readings yield zero elapsed time", () => {
  const originalNow = Date.now;
  let reads = 0;
  let failedStartCompletion;
  Date.now = () => {
    reads++;
    if (reads === 1) throw new Error("clock failed");
    return 117;
  };
  try {
    equal(
      isEmpty("", {
        reportCompletionFunc(stats) {
          failedStartCompletion = stats;
        },
      }),
      true,
      "31.01",
    );
  } finally {
    Date.now = originalNow;
  }
  equal(failedStartCompletion.timeTakenInMilliseconds, 0, "31.02");

  reads = 0;
  let failedEndCompletion;
  Date.now = () => {
    reads++;
    return reads === 1 ? 100 : Number.NaN;
  };
  try {
    equal(
      isEmpty("", {
        reportCompletionFunc(stats) {
          failedEndCompletion = stats;
        },
      }),
      true,
      "31.03",
    );
  } finally {
    Date.now = originalNow;
  }
  equal(failedEndCompletion.timeTakenInMilliseconds, 0, "31.04");
});

test("32 - a backwards clock cannot report a negative duration", () => {
  const originalNow = Date.now;
  let reads = 0;
  let completion;
  Date.now = () => (++reads === 1 ? 100 : 90);
  try {
    equal(
      isEmpty(
        {},
        {
          reportCompletionFunc(stats) {
            completion = stats;
          },
        },
      ),
      true,
      "32.01",
    );
  } finally {
    Date.now = originalNow;
  }
  equal(completion.timeTakenInMilliseconds, 0, "32.02");

  reads = 0;
  let overflowCompletion;
  Date.now = () => (++reads === 1 ? -Number.MAX_VALUE : Number.MAX_VALUE);
  try {
    equal(
      isEmpty("", {
        reportCompletionFunc(stats) {
          overflowCompletion = stats;
        },
      }),
      true,
      "32.03",
    );
  } finally {
    Date.now = originalNow;
  }
  equal(overflowCompletion.timeTakenInMilliseconds, 0, "32.04");
});

test("33 - progress-only reporting does not read the clock", () => {
  const originalNow = Date.now;
  Date.now = () => {
    throw new Error("clock should not be read");
  };
  try {
    not.throws(
      () =>
        isEmpty([], {
          reportProgressFunc() {},
        }),
      "33.01",
    );
  } finally {
    Date.now = originalNow;
  }
});

// ==============================
// shallow-to-iterative handoff
// ==============================

test("34 - a large completed recursive branch is reused", () => {
  let reads = 0;
  const leaf = {};
  Object.defineProperty(leaf, "value", {
    enumerable: true,
    get() {
      reads++;
      return "";
    },
  });
  let branch = leaf;
  for (let index = 0; index < 40; index++) branch = { child: branch };
  equal(isEmpty([branch, branch]), true, "34.01");
  equal(reads, 1, "34.02");
});

test("35 - a back-edge crossing the handoff remains a cycle", () => {
  const root = { child: null };
  let cursor = root;
  for (let index = 0; index < 40; index++) {
    const child = { child: null };
    cursor.child = child;
    cursor = child;
  }
  cursor.child = root;
  equal(isEmpty(root), null, "35.01");
});

test("36 - aliases completed in iterative mode are skipped", () => {
  let reads = 0;
  const shared = {};
  Object.defineProperty(shared, "value", {
    enumerable: true,
    get() {
      reads++;
      return "";
    },
  });
  const input = Array.from({ length: 40 }, () => ({}));
  input.push(shared, shared);
  equal(isEmpty(input), true, "36.01");
  equal(reads, 1, "36.02");
});

test("37 - an iterative sibling entry still detects an active ancestor", () => {
  const root = { deep: null, self: null };
  let branch = {};
  root.deep = branch;
  for (let index = 0; index < 40; index++) {
    const child = {};
    branch.child = child;
    branch = child;
  }
  root.self = root;
  equal(isEmpty(root), null, "37.01");
});

test.run();
