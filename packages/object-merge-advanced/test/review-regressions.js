import { runInNewContext } from "node:vm";

import { test } from "uvu";
import { equal, is, not, ok, throws } from "uvu/assert";

import { defaults, mergeAdvanced } from "../dist/object-merge-advanced.esm.js";

test("01 - preserve hostile-looking keys as own data properties", () => {
  const incoming = JSON.parse(
    '{"__proto__":{"polluted":true},"nested":{"__proto__":{"safe":true}}}',
  );
  const left = { retained: true, nested: { retained: true } };
  const result = mergeAdvanced(left, incoming);

  ok(Object.hasOwn(result, "__proto__"), "01.01");
  ok(Object.hasOwn(result.nested, "__proto__"), "01.02");
  equal(
    Object.getOwnPropertyDescriptor(result, "__proto__"),
    {
      configurable: true,
      enumerable: true,
      value: { polluted: true },
      writable: true,
    },
    "01.03",
  );
  is(Object.getPrototypeOf(result), Object.prototype, "01.04");
  is(Object.getPrototypeOf(result.nested), Object.prototype, "01.05");
  equal(
    JSON.parse(JSON.stringify(result)),
    JSON.parse(
      '{"__proto__":{"polluted":true},"nested":{"retained":true,"__proto__":{"safe":true}},"retained":true}',
    ),
    "01.06",
  );
  is(Object.getPrototypeOf(left), Object.prototype, "01.07");

  const reused = { retained: true };
  const reusedResult = mergeAdvanced(reused, incoming, { reuseInputs: true });
  is(reusedResult, reused, "01.08");
  ok(Object.hasOwn(reused, "__proto__"), "01.09");
  is(Object.getPrototypeOf(reused), Object.prototype, "01.10");

  const clashingLeft = JSON.parse('{"__proto__":{"left":true}}');
  const clashingRight = JSON.parse('{"__proto__":{"right":true}}');
  const clashingResult = mergeAdvanced(clashingLeft, clashingRight);
  equal(
    JSON.parse(JSON.stringify(clashingResult)),
    JSON.parse('{"__proto__":{"left":true,"right":true}}'),
    "01.11",
  );
  is(Object.getPrototypeOf(clashingResult), Object.prototype, "01.12");
  is(
    Object.getPrototypeOf(Reflect.get(clashingResult, "__proto__")),
    Object.prototype,
    "01.13",
  );
});

test("02 - close matching cycles and reuse completed graph pairs", () => {
  const left = { left: true };
  left.self = left;
  const right = { right: true };
  right.self = right;

  const result = mergeAdvanced(left, right);
  is(result.self, result, "02.01");
  is(result.left, true, "02.02");
  is(result.right, true, "02.03");
  is(left.self, left, "02.04");
  is(right.self, right, "02.05");

  const leftBranch = { left: 1 };
  const rightBranch = { right: 2 };
  const dag = mergeAdvanced(
    { first: leftBranch, second: leftBranch },
    { first: rightBranch, second: rightBranch },
  );
  is(dag.first, dag.second, "02.06");
  equal(dag.first, { left: 1, right: 2 }, "02.07");

  const leftRoot = { leftRoot: true };
  const leftChild = { leftChild: true, next: leftRoot };
  leftRoot.next = leftChild;
  const rightRoot = { rightRoot: true };
  const rightChild = { rightChild: true, next: rightRoot };
  rightRoot.next = rightChild;
  const mutual = mergeAdvanced(leftRoot, rightRoot);
  is(mutual.next.next, mutual, "02.08");
  is(mutual.leftRoot, true, "02.09");
  is(mutual.rightRoot, true, "02.10");
  is(mutual.next.leftChild, true, "02.11");
  is(mutual.next.rightChild, true, "02.12");
});

test("03 - keep unequal graph pairs isolated and callbacks path-sensitive", () => {
  const sharedLeft = { value: 1 };
  const callbackPaths = [];
  const result = mergeAdvanced(
    { first: sharedLeft, second: sharedLeft },
    { first: { value: 2 }, second: { value: 3 } },
    {
      cb: (_input1, _input2, suggested, info) => {
        if (info.path.endsWith(".value")) {
          callbackPaths.push(info.path);
        }
        return suggested;
      },
    },
  );

  not.ok(result.first === result.second, "03.01");
  equal(result, { first: { value: 2 }, second: { value: 3 } }, "03.02");
  equal(callbackPaths, ["first.value", "second.value"], "03.03");
});

test("04 - identity callbacks are transparent under directional merges", () => {
  const identity = (_input1, _input2, suggested) => suggested;
  const left = { item: { leftOnly: true, clash: "left" } };
  const right = { item: { rightOnly: true, clash: "right" } };

  for (const opts of [
    { hardMergeEverything: true },
    { hardMergeKeys: "item" },
    { ignoreEverything: true },
    { ignoreKeys: "item" },
  ]) {
    equal(
      mergeAdvanced(left, right, { ...opts, cb: identity }),
      mergeAdvanced(left, right, opts),
      "04.01",
    );
  }
});

test("05 - nested callbacks receive pristine operands", () => {
  const left = { item: { leftOnly: 1 } };
  const right = { item: { rightOnly: 2 } };
  let itemOperands;

  const result = mergeAdvanced(left, right, {
    cb: (input1, input2, suggested, info) => {
      if (info.path === "item") {
        itemOperands = [input1, input2];
        return input1;
      }
      return suggested;
    },
  });

  equal(itemOperands, [{ leftOnly: 1 }, { rightOnly: 2 }], "05.01");
  equal(result, { item: { leftOnly: 1 } }, "05.02");
  equal(left, { item: { leftOnly: 1 } }, "05.03");
  equal(right, { item: { rightOnly: 2 } }, "05.04");

  const leftCycle = { leftOnly: true };
  leftCycle.self = leftCycle;
  const rightCycle = { addedBeforeBackEdge: true };
  rightCycle.self = rightCycle;
  let cycleOperand;
  const cycleResult = mergeAdvanced(leftCycle, rightCycle, {
    cb: (input1, _input2, suggested, info) => {
      if (info.path === "self") {
        cycleOperand = input1;
      }
      return suggested;
    },
  });
  not.ok(Object.hasOwn(cycleOperand, "addedBeforeBackEdge"), "05.05");
  is(cycleResult.self, cycleResult, "05.06");
});

test("06 - report actual paths and clashing operand types", () => {
  const metadata = [];
  mergeAdvanced(
    { arrayValue: [1], forced: "left" },
    { arrayValue: 2, forced: 42 },
    {
      hardMergeKeys: "forced",
      cb: (_input1, _input2, suggested, info) => {
        if (info.key === "arrayValue" || info.key === "forced") {
          metadata.push(info);
        }
        return suggested;
      },
    },
  );

  equal(
    metadata,
    [
      {
        key: "arrayValue",
        path: "arrayValue",
        pathSegments: ["arrayValue"],
        type: ["array", "number"],
      },
      {
        key: "forced",
        path: "forced",
        pathSegments: ["forced"],
        type: ["string", "number"],
      },
    ],
    "06.01",
  );
});

test("07 - treat every explicit undefined option as omitted", () => {
  const scenarios = [
    ["cb", { value: true }, { value: false }],
    ["mergeObjectsOnlyWhenKeysetMatches", [{ left: 1 }], [{ right: 2 }]],
    ["ignoreKeys", { value: "left" }, { value: "right" }],
    ["hardMergeKeys", { value: "left" }, { value: "right" }],
    ["hardArrayConcatKeys", { value: [{ a: 1 }] }, { value: [{ a: 2 }] }],
    ["mergeArraysContainingStringsToBeEmpty", ["left"], ["right"]],
    ["oneToManyArrayObjectMerge", [{ base: true }], [{ a: 1 }, { b: 2 }]],
    ["hardMergeEverything", { value: "left" }, { value: "right" }],
    ["hardArrayConcat", [{ a: 1 }], [{ a: 2 }]],
    ["ignoreEverything", { value: "left" }, { value: "right" }],
    ["concatInsteadOfMerging", ["same"], ["same"]],
    ["dedupeStringsInArrayValues", ["same"], ["same"]],
    ["mergeBoolsUsingOrNotAnd", true, false],
    ["useNullAsExplicitFalse", { value: 1 }, null],
    ["reuseInputs", { left: 1 }, { right: 2 }],
  ];

  for (const [option, input1, input2] of scenarios) {
    equal(
      mergeAdvanced(input1, input2, { [option]: undefined }),
      mergeAdvanced(input1, input2),
      `07.01 - ${option}`,
    );
  }

  const inheritedOptions = runInNewContext(
    "Object.prototype.ignoreEverything = true; ({})",
  );
  equal(
    mergeAdvanced({ value: "left" }, { value: ["right"] }, inheritedOptions),
    { value: ["right"] },
    "07.02",
  );
});

test("08 - validate all option values with package-owned diagnostics", () => {
  const selectorPrototype = Object.create(Array.prototype, {
    0: { configurable: true, value: "*" },
  });
  const prototypeFilledHole = new Array(1);
  Object.setPrototypeOf(prototypeFilledHole, selectorPrototype);
  const invalidOptions = [
    ["cb", true, "03"],
    ["mergeObjectsOnlyWhenKeysetMatches", "true", "07"],
    ["ignoreKeys", 1, "04"],
    ["ignoreKeys", ["ok", 1], "04"],
    ["ignoreKeys", new Array(1), "04"],
    ["ignoreKeys", prototypeFilledHole, "04"],
    ["hardMergeKeys", false, "05"],
    ["hardMergeKeys", ["ok", null], "05"],
    ["hardMergeKeys", new Array(1), "05"],
    ["hardArrayConcatKeys", 1, "06"],
    ["hardArrayConcatKeys", ["ok", {}], "06"],
    ["hardArrayConcatKeys", new Array(1), "06"],
    ["mergeArraysContainingStringsToBeEmpty", 1, "07"],
    ["oneToManyArrayObjectMerge", 1, "07"],
    ["hardMergeEverything", 1, "07"],
    ["hardArrayConcat", 1, "07"],
    ["ignoreEverything", 1, "07"],
    ["concatInsteadOfMerging", 1, "07"],
    ["dedupeStringsInArrayValues", 1, "07"],
    ["mergeBoolsUsingOrNotAnd", 1, "07"],
    ["useNullAsExplicitFalse", 1, "07"],
    ["reuseInputs", 1, "07"],
  ];

  for (const [option, value, throwId] of invalidOptions) {
    throws(
      () => mergeAdvanced({ value: 1 }, { value: 2 }, { [option]: value }),
      new RegExp(
        `^object-merge-advanced/mergeAdvanced\\(\\): \\[THROW_ID_${throwId}\\]`,
      ),
      `08.01 - ${option}`,
    );
  }
});

test("09 - isolate and invoke explicit-null callbacks exactly once", () => {
  for (const reversed of [false, true]) {
    const objectInput = { nested: { value: 1 } };
    let calls = 0;
    const args = reversed ? [null, objectInput] : [objectInput, null];
    const result = mergeAdvanced(...args, {
      useNullAsExplicitFalse: true,
      reuseInputs: true,
      cb: (input1, input2, suggested) => {
        calls++;
        const objectOperand =
          input1 && typeof input1 === "object" ? input1 : input2;
        objectOperand.nested.value = 99;
        return suggested;
      },
    });

    is(result, null, "09.01");
    is(calls, 1, "09.02");
    equal(objectInput, { nested: { value: 1 } }, "09.03");
  }
});

test("10 - preserve defined admitted values over undefined", () => {
  const values = [() => "value", 1n, Symbol("value")];

  for (const value of values) {
    is(mergeAdvanced(value, undefined), value, "10.01");
    is(mergeAdvanced(undefined, value), value, "10.02");
  }
});

test("11 - support one input and every documented selector form", () => {
  const input = { nested: { value: 1 } };
  const clone = mergeAdvanced(input);
  equal(clone, input, "11.01");
  not.ok(clone === input, "11.02");
  not.ok(clone.nested === input.nested, "11.03");

  equal(
    mergeAdvanced(
      { value: "left" },
      { value: ["right"] },
      {
        ignoreKeys: Object.freeze(["value"]),
      },
    ),
    { value: "left" },
    "11.04",
  );
  equal(
    mergeAdvanced(
      { value: ["left"] },
      { value: "right" },
      {
        hardMergeKeys: "value",
      },
    ),
    { value: "right" },
    "11.05",
  );

  equal(
    mergeAdvanced(
      { values: [{ left: true }] },
      { values: [{ right: true }] },
      { hardArrayConcatKeys: "values" },
    ),
    { values: [{ left: true }, { right: true }] },
    "11.06",
  );
  equal(
    mergeAdvanced(
      { values: [{ left: true }] },
      { values: [{ right: true }] },
      { hardArrayConcatKeys: Object.freeze(["values"]) },
    ),
    { values: [{ left: true }, { right: true }] },
    "11.07",
  );

  let callbackInfo;
  mergeAdvanced(1, 2, {
    cb: (_input1, _input2, suggested, info) => {
      callbackInfo = info;
      return suggested;
    },
  });
  equal(
    callbackInfo,
    { key: null, path: "", pathSegments: [], type: ["number", "number"] },
    "11.08",
  );
});

test("12 - expose lossless callback path segments", () => {
  const paths = [];
  mergeAdvanced(
    { "": 1, 0: 1, "a.b": 1, a: { b: 1 } },
    { "": 2, 0: 2, "a.b": 2, a: { b: 2 } },
    {
      cb: (_input1, _input2, suggested, info) => {
        if (info.type[0] === "number" && info.type[1] === "number") {
          paths.push([info.path, info.pathSegments]);
        }
        return suggested;
      },
    },
  );

  equal(
    paths,
    [
      ["0", ["0"]],
      ["", [""]],
      ["a.b", ["a.b"]],
      ["a.b", ["a", "b"]],
    ],
    "12.01",
  );

  let arrayPath;
  mergeAdvanced([{ value: 1 }], [{ value: 2 }], {
    cb: (_input1, _input2, suggested, info) => {
      if (info.path === "0") {
        arrayPath = info.pathSegments;
      }
      return suggested;
    },
  });
  equal(arrayPath, [0], "12.02");
});

test("13 - keep diagnostic-sensitive supported values mergeable", () => {
  const cyclic = { value: 1 };
  cyclic.self = cyclic;
  const cyclicResult = mergeAdvanced(cyclic);

  is(cyclicResult.self, cyclicResult, "13.01");
  is(mergeAdvanced(1n, 2n), 2n, "13.02");
});

test("14 - preserve no-concat Set membership semantics", () => {
  const leftObject = { left: true };
  const rightObject = { right: true };
  const result = mergeAdvanced(
    [NaN, -0, leftObject, "a"],
    [NaN, 0, rightObject, "b", "b"],
    { concatInsteadOfMerging: false },
  );

  equal(
    result,
    [NaN, -0, { left: true }, { right: true }, "a", "b", "b"],
    "14.01",
  );
  ok(Object.is(result[1], -0), "14.02");
});

test("15 - freeze complete defaults and disable reuse by default", () => {
  ok(Object.isFrozen(defaults), "15.01");
  ok(Object.isFrozen(defaults.ignoreKeys), "15.02");
  ok(Object.isFrozen(defaults.hardMergeKeys), "15.03");
  ok(Object.isFrozen(defaults.hardArrayConcatKeys), "15.04");
  is(defaults.reuseInputs, false, "15.05");
  throws(
    () => defaults.ignoreKeys.push("*"),
    (error) => error instanceof TypeError,
    "15.06",
  );

  const left = { nested: { left: 1 } };
  const right = { nested: { right: 2 } };
  const result = mergeAdvanced(left, right, {
    reuseInputs: true,
    cb: (_input1, _input2, suggested) => suggested,
  });
  not.ok(result === left, "15.07");
  equal(left, { nested: { left: 1 } }, "15.08");
  equal(right, { nested: { right: 2 } }, "15.09");
});

test("16 - keep wildcard exclusions when a selector contains literal star", () => {
  equal(
    mergeAdvanced(
      { drop: "left", keep: "left" },
      { drop: ["right"], keep: ["right"] },
      { ignoreKeys: ["*", "!keep"] },
    ),
    { drop: "left", keep: ["right"] },
    "16.01",
  );
  equal(
    mergeAdvanced(
      { drop: ["left"], keep: ["left"] },
      { drop: "right", keep: "right" },
      { hardMergeKeys: ["*", "!keep"] },
    ),
    { drop: "right", keep: ["left"] },
    "16.02",
  );
});

test("17 - define incoming keys over inherited cross-realm setters", () => {
  let setterCalls = 0;
  const left = runInNewContext(
    `
      Object.defineProperty(Object.prototype, "incoming", {
        configurable: true,
        enumerable: true,
        get: () => "inherited",
        set: markSetter,
      });
      ({ safe: 1 });
    `,
    {
      markSetter() {
        setterCalls++;
      },
    },
  );

  const result = mergeAdvanced(left, { incoming: 2 });

  is(setterCalls, 0, "17.01");
  ok(Object.hasOwn(result, "incoming"), "17.02");
  equal(
    Object.getOwnPropertyDescriptor(result, "incoming"),
    {
      configurable: true,
      enumerable: true,
      value: 2,
      writable: true,
    },
    "17.03",
  );
  equal(JSON.parse(JSON.stringify(result)), { safe: 1, incoming: 2 }, "17.04");
});

test.run();
