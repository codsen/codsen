import { runInNewContext } from "node:vm";

import { test } from "uvu";
import { equal, is, not, ok, throws } from "uvu/assert";

import { defaults, empty } from "../dist/ast-contains-only-empty-space.esm.js";

// ==============================
// strings and recursive containers
// ==============================

test("01 - whitespace strings", () => {
  equal(empty(""), true, "01.01");
  equal(empty("\n\t  \r"), true, "01.02");
  equal(empty("."), false, "01.03");
});

test("02 - nested arrays and records", () => {
  equal(empty([]), true, "02.01");
  equal(empty({}), true, "02.02");
  equal(empty([" ", { a: ["\n", {}] }]), true, "02.03");
  equal(empty([" ", { a: ["\n", { b: "x" }] }]), false, "02.04");
});

test("03 - every non-string leaf is non-empty at every depth", () => {
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
    new Map(),
    new Set(),
  ];
  ok(
    values.every((value) => empty(value) === false),
    "03.01",
  );
  ok(
    values.every((value) => empty({ value }) === false),
    "03.02",
  );
});

test("04 - class instances are opaque non-empty leaves", () => {
  class Example {
    value = " ";
  }
  equal(empty(new Example()), false, "04.01");
  equal(empty([new Example()]), false, "04.02");
});

// ==============================
// object and array property domains
// ==============================

test("05 - symbol metadata does not hide ordinary record properties", () => {
  equal(empty({ text: "x", [Symbol.iterator]: undefined }), false, "05.01");
  equal(empty({ text: "x", [Symbol.toStringTag]: "Record" }), false, "05.02");

  const inheritedWhitespace = runInNewContext(
    "Object.prototype[Symbol.iterator] = undefined; ({ text: ' ' })",
  );
  const inheritedVisible = runInNewContext(
    "Object.prototype[Symbol.toStringTag] = 'Record'; ({ text: 'x' })",
  );
  equal(empty(inheritedWhitespace), true, "05.03");
  equal(empty(inheritedVisible), false, "05.04");
});

test("06 - symbol and non-enumerable record values are ignored", () => {
  const input = { visible: " " };
  input[Symbol("hidden")] = "x";
  Object.defineProperty(input, "hidden", {
    enumerable: false,
    value: "x",
  });
  equal(empty(input), true, "06.01");
});

test("07 - null-prototype and cross-realm records are traversed", () => {
  const nullPrototype = Object.create(null);
  nullPrototype.text = " ";
  equal(empty(nullPrototype), true, "07.01");
  nullPrototype.text = "x";
  equal(empty(nullPrototype), false, "07.02");

  equal(empty(runInNewContext("({ text: ' ' })")), true, "07.03");
  equal(empty(runInNewContext("({ text: 'x' })")), false, "07.04");
});

test("08 - array iterators are never consulted", () => {
  const hidden = ["x"];
  hidden[Symbol.iterator] = function* () {};
  equal(empty(hidden), false, "08.01");

  const invented = [" "];
  invented[Symbol.iterator] = function* () {
    yield "x";
  };
  equal(empty(invented), true, "08.02");

  const poisoned = [" "];
  Object.defineProperty(poisoned, Symbol.iterator, {
    get() {
      throw new Error("iterator accessed");
    },
  });
  equal(empty(poisoned), true, "08.03");

  const deleted = [" "];
  deleted[Symbol.iterator] = undefined;
  equal(empty(deleted), true, "08.04");
});

test("09 - sparse holes are non-empty", () => {
  equal(empty(new Array(1)), false, "09.01");
  const sparseWithTail = new Array(2);
  sparseWithTail[1] = " ";
  equal(empty(sparseWithTail), false, "09.02");

  const sparse = new Array(1);
  const prototype = Object.create(Array.prototype);
  prototype[0] = " ";
  Object.setPrototypeOf(sparse, prototype);
  equal(empty(sparse), false, "09.03");
});

test("10 - extra array properties are ignored", () => {
  const input = [];
  input.extra = "x";
  input[Symbol("extra")] = "x";
  Object.defineProperty(input, "hidden", {
    enumerable: false,
    value: "x",
  });
  equal(empty(input), true, "10.01");
});

test("11 - indexed accessors are read once without mutation", () => {
  let reads = 0;
  const input = [];
  Object.defineProperty(input, 0, {
    enumerable: true,
    get() {
      reads++;
      return " ";
    },
  });
  input.length = 1;
  equal(empty(input), true, "11.01");
  equal(reads, 1, "11.02");
  equal(input.length, 1, "11.03");
});

// ==============================
// depth, cycles and aliases
// ==============================

test("12 - object, array and alternating depth do not use the call stack", () => {
  let objectTree = " ";
  let arrayTree = " ";
  let alternatingTree = " ";
  for (let index = 0; index < 10_000; index++) {
    objectTree = { value: objectTree };
    arrayTree = [arrayTree];
    alternatingTree =
      index % 2 === 0 ? [alternatingTree] : { value: alternatingTree };
  }
  equal(empty(objectTree), true, "12.01");
  equal(empty(arrayTree), true, "12.02");
  equal(empty(alternatingTree), true, "12.03");

  let mismatch = "x";
  for (let index = 0; index < 10_000; index++) mismatch = { value: mismatch };
  equal(empty(mismatch), false, "12.04");
});

test("13 - active object and array cycles are non-empty", () => {
  const objectCycle = {};
  objectCycle.self = objectCycle;
  equal(empty(objectCycle), false, "13.01");

  const arrayCycle = [];
  arrayCycle.push(arrayCycle);
  equal(empty(arrayCycle), false, "13.02");

  const first = {};
  const second = { first };
  first.second = second;
  equal(empty(first), false, "13.03");

  const withSibling = { blank: " ", self: null, visible: "x" };
  withSibling.self = withSibling;
  equal(empty(withSibling), false, "13.04");
});

test("14 - completed shared subtrees are evaluated once", () => {
  let getterReads = 0;
  const leaf = {};
  Object.defineProperty(leaf, "text", {
    enumerable: true,
    get() {
      getterReads++;
      return " ";
    },
  });

  let graph = leaf;
  for (let index = 0; index < 30; index++) graph = [graph, graph];
  equal(empty(graph), true, "14.01");
  equal(getterReads, 1, "14.02");
});

test("15 - an aliased non-empty subtree still short-circuits", () => {
  let getterReads = 0;
  const leaf = {};
  Object.defineProperty(leaf, "text", {
    enumerable: true,
    get() {
      getterReads++;
      return "x";
    },
  });
  equal(empty([leaf, leaf]), false, "15.01");
  equal(getterReads, 1, "15.02");
});

test("16 - traversal leaves inputs and key order unchanged", () => {
  const shared = Object.freeze({ second: "\n", first: " " });
  const input = Object.freeze([shared, shared]);
  const before = JSON.stringify(input);
  const keys = Object.keys(shared);
  equal(empty(input), true, "16.01");
  equal(JSON.stringify(input), before, "16.02");
  equal(Object.keys(shared), keys, "16.03");
  ok(Object.isFrozen(input), "16.04");
  ok(Object.isFrozen(shared), "16.05");
  is(input[0], shared, "16.06");
  is(input[1], shared, "16.07");

  const sparse = new Array(2);
  sparse[1] = " ";
  const descriptor = Object.getOwnPropertyDescriptor(sparse, "1");
  equal(empty(sparse), false, "16.08");
  equal(Object.getOwnPropertyDescriptor(sparse, "1"), descriptor, "16.09");
  equal(0 in sparse, false, "16.10");
  equal(sparse.length, 2, "16.11");
});

test("17 - first failure preserves property-read short circuiting", () => {
  let laterReads = 0;
  const input = {
    first: "x",
    get later() {
      laterReads++;
      return " ";
    },
  };
  equal(empty(input), false, "17.01");
  equal(laterReads, 0, "17.02");
});

// ==============================
// options and observability
// ==============================

test("18 - defaults are inert and frozen", () => {
  ok(Object.isFrozen(defaults), "18.01");
  equal(defaults.reportCompletionFunc, null, "18.02");
  equal(defaults.reportProgressFunc, null, "18.03");
  equal(defaults.reportProgressFuncFrom, 0, "18.04");
  equal(defaults.reportProgressFuncTo, 100, "18.05");
});

test("19 - null and explicitly undefined options use defaults", () => {
  equal(empty([" "], null), true, "19.01");
  equal(
    empty([" "], {
      reportCompletionFunc: undefined,
      reportProgressFunc: undefined,
      reportProgressFuncFrom: undefined,
      reportProgressFuncTo: undefined,
    }),
    true,
    "19.02",
  );
});

test("20 - option validation uses ordered package-scoped identifiers", () => {
  throws(() => empty(" ", []), /THROW_ID_01/u, "20.01");
  throws(() => empty(" ", new Date(0)), /THROW_ID_01/u, "20.02");
  throws(() => empty(" ", { unknown: true }), /THROW_ID_02/u, "20.03");
  throws(
    () => empty(" ", { reportCompletionFunc: true }),
    /THROW_ID_03/u,
    "20.04",
  );
  throws(
    () => empty(" ", { reportProgressFunc: true }),
    /THROW_ID_04/u,
    "20.05",
  );
  throws(
    () => empty(" ", { reportProgressFuncFrom: Number.NaN }),
    /THROW_ID_05/u,
    "20.06",
  );
  throws(
    () => empty(" ", { reportProgressFuncTo: Number.POSITIVE_INFINITY }),
    /THROW_ID_06/u,
    "20.07",
  );
  throws(
    () =>
      empty(" ", {
        reportProgressFuncFrom: 51,
        reportProgressFuncTo: 50,
      }),
    /THROW_ID_07/u,
    "20.08",
  );
  throws(
    () =>
      empty(" ", {
        reportProgressFunc() {},
        reportProgressFuncFrom: -Number.MAX_VALUE,
        reportProgressFuncTo: Number.MAX_VALUE,
      }),
    /THROW_ID_08/u,
    "20.09",
  );
});

test("21 - completion reports frozen deterministic statistics", () => {
  const shared = { text: " " };
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
      empty(input, {
        reportCompletionFunc(stats) {
          completionCalls++;
          completion = stats;
        },
      }),
      true,
      "21.01",
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
    "21.02",
  );
  equal(completionCalls, 1, "21.03");
  equal(clockReads, 2, "21.04");
  ok(Object.isFrozen(completion), "21.05");
});

test("22 - early false completion is reported exactly once", () => {
  let completion;
  let calls = 0;
  equal(
    empty([" ", 1, "unreached"], {
      reportCompletionFunc(stats) {
        calls++;
        completion = stats;
      },
    }),
    false,
    "22.01",
  );
  equal(calls, 1, "22.02");
  equal(completion.arrayElementsVisited, 2, "22.03");
  equal(completion.maxDepth, 1, "22.04");
  equal(completion.uniqueContainersVisited, 1, "22.05");

  let rootCompletion;
  equal(
    empty(null, {
      reportCompletionFunc(stats) {
        rootCompletion = stats;
      },
    }),
    false,
    "22.06",
  );
  equal(rootCompletion.uniqueContainersVisited, 0, "22.07");

  let objectCompletion;
  equal(
    empty(
      { value: 1 },
      {
        reportCompletionFunc(stats) {
          objectCompletion = stats;
        },
      },
    ),
    false,
    "22.08",
  );
  equal(objectCompletion.objectPropertiesVisited, 1, "22.09");
});

test("23 - observed sparse holes count as inspected slots", () => {
  let completion;
  equal(
    empty(new Array(2), {
      reportCompletionFunc(stats) {
        completion = stats;
      },
    }),
    false,
    "23.01",
  );
  equal(completion.arrayElementsVisited, 1, "23.02");
  equal(completion.maxDepth, 1, "23.03");
});

test("24 - observed cycles and aliases remain distinct", () => {
  const cycle = [];
  cycle.push(cycle);
  let cycleCompletion;
  equal(
    empty(cycle, {
      reportCompletionFunc(stats) {
        cycleCompletion = stats;
      },
    }),
    false,
    "24.01",
  );
  equal(cycleCompletion.aliasesSkipped, 0, "24.02");
  equal(cycleCompletion.uniqueContainersVisited, 1, "24.03");

  const shared = [];
  let aliasCompletion;
  equal(
    empty([shared, shared], {
      reportCompletionFunc(stats) {
        aliasCompletion = stats;
      },
    }),
    true,
    "24.04",
  );
  equal(aliasCompletion.aliasesSkipped, 1, "24.05");
  equal(aliasCompletion.uniqueContainersVisited, 2, "24.06");
});

test("25 - large traversals report finite monotonic range progress", () => {
  const progress = [];
  const input = Array.from({ length: 2200 }, () => " ");
  equal(
    empty(input, {
      reportProgressFunc(value) {
        progress.push(value);
      },
      reportProgressFuncFrom: 20,
      reportProgressFuncTo: 40,
    }),
    true,
    "25.01",
  );
  equal(progress[0], 20, "25.02");
  equal(progress[progress.length - 1], 40, "25.03");
  ok(progress.length > 2, "25.04");
  ok(progress.every(Number.isFinite), "25.05");
  ok(
    progress.every(
      (value, index) => index === 0 || value >= progress[index - 1],
    ),
    "25.06",
  );
  ok(
    progress.every((value) => value >= 20 && value <= 40),
    "25.07",
  );
});

test("26 - a zero-width progress range is reported without duplicates", () => {
  const progress = [];
  equal(
    empty(" ", {
      reportProgressFunc(value) {
        progress.push(value);
      },
      reportProgressFuncFrom: 25,
      reportProgressFuncTo: 25,
    }),
    true,
    "26.01",
  );
  equal(progress, [25], "26.02");
});

test("27 - callback errors cannot change traversal semantics", () => {
  equal(
    empty([" "], {
      reportCompletionFunc() {
        throw new Error("completion failed");
      },
      reportProgressFunc() {
        throw new Error("progress failed");
      },
    }),
    true,
    "27.01",
  );
});

test("28 - either failed clock reading yields zero elapsed time", () => {
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
      empty(" ", {
        reportCompletionFunc(stats) {
          failedStartCompletion = stats;
        },
      }),
      true,
      "28.01",
    );
  } finally {
    Date.now = originalNow;
  }
  equal(failedStartCompletion.timeTakenInMilliseconds, 0, "28.02");

  reads = 0;
  let failedEndCompletion;
  Date.now = () => {
    reads++;
    return reads === 1 ? 100 : Number.NaN;
  };
  try {
    equal(
      empty(" ", {
        reportCompletionFunc(stats) {
          failedEndCompletion = stats;
        },
      }),
      true,
      "28.03",
    );
  } finally {
    Date.now = originalNow;
  }
  equal(failedEndCompletion.timeTakenInMilliseconds, 0, "28.04");
});

test("29 - a backwards clock cannot report a negative duration", () => {
  const originalNow = Date.now;
  let reads = 0;
  let completion;
  Date.now = () => (++reads === 1 ? 100 : 90);
  try {
    equal(
      empty(
        {},
        {
          reportCompletionFunc(stats) {
            completion = stats;
          },
        },
      ),
      true,
      "29.01",
    );
  } finally {
    Date.now = originalNow;
  }
  equal(completion.timeTakenInMilliseconds, 0, "29.02");
});

test("30 - progress-only reporting does not read the clock", () => {
  const originalNow = Date.now;
  Date.now = () => {
    throw new Error("clock should not be read");
  };
  try {
    not.throws(
      () =>
        empty([], {
          reportProgressFunc() {},
        }),
      "30.01",
    );
  } finally {
    Date.now = originalNow;
  }
});

test.run();
