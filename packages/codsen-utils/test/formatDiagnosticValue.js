// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { formatDiagnosticValue } from "../dist/codsen-utils.esm.js";

test("01 - formats JSON primitives without calling JSON.stringify", () => {
  equal(formatDiagnosticValue(null), "null", "01.01");
  equal(formatDiagnosticValue(true), "true", "01.02");
  equal(formatDiagnosticValue(false), "false", "01.03");
  equal(formatDiagnosticValue(12.5), "12.5", "01.04");
  equal(formatDiagnosticValue(-0), "-0", "01.05");
  equal(formatDiagnosticValue(Number.NaN), "NaN", "01.06");
  equal(formatDiagnosticValue(Number.POSITIVE_INFINITY), "Infinity", "01.07");
  equal(formatDiagnosticValue('"'), '"\\""', "01.08");
  equal(formatDiagnosticValue("\\"), '"\\\\"', "01.09");
  equal(
    formatDiagnosticValue("\b\t\n\f\r\u0001\u2028\u2029\ud83d\ude00"),
    String.raw`"\b\t\n\f\r\u0001\u2028\u2029\ud83d\ude00"`,
    "01.10",
  );
});

test("02 - represents values JSON cannot serialize", () => {
  equal(formatDiagnosticValue(undefined), "undefined", "02.01");
  equal(formatDiagnosticValue(123n), "123n", "02.02");
  equal(formatDiagnosticValue(Symbol("marker")), 'Symbol("marker")', "02.03");
  equal(
    formatDiagnosticValue(() => "unused"),
    "[Function]",
    "02.04",
  );
});

test("03 - formats nested records and arrays compactly", () => {
  equal(
    formatDiagnosticValue({ one: 1, nested: { ok: true }, list: ["x", null] }),
    '{"one":1,"nested":{"ok":true},"list":["x",null]}',
    "03.01",
  );
  equal(formatDiagnosticValue({}), "{}", "03.02");
  equal(formatDiagnosticValue([]), "[]", "03.03");
});

test("04 - supports the four-space diagnostic layout", () => {
  equal(
    formatDiagnosticValue({ one: 1, list: [true, "x"] }, 4),
    [
      "{",
      '    "one": 1,',
      '    "list": [',
      "        true,",
      '        "x"',
      "    ]",
      "}",
    ].join("\n"),
    "04.01",
  );
  equal(formatDiagnosticValue({ one: 1 }, 2), '{"one":1}', "04.02");
});

test("05 - describes accessors without invoking them", () => {
  let reads = 0;
  const input = {};
  Object.defineProperties(input, {
    getOnly: {
      enumerable: true,
      get() {
        reads += 1;
        throw new Error("must not run");
      },
    },
    setOnly: {
      enumerable: true,
      set(_value) {
        reads += 1;
      },
    },
    both: {
      enumerable: true,
      get() {
        reads += 1;
        return 1;
      },
      set(_value) {
        reads += 1;
      },
    },
    hidden: { enumerable: false, value: "ignored" },
  });

  equal(
    formatDiagnosticValue(input),
    '{"getOnly":[Getter],"setOnly":[Setter],"both":[Getter/Setter]}',
    "05.01",
  );
  equal(reads, 0, "05.02");
});

test("06 - arrays preserve holes and also avoid indexed getters", () => {
  let reads = 0;
  const input = [1, 2];
  Object.defineProperty(input, "1", {
    enumerable: true,
    get() {
      reads += 1;
      throw new Error("must not run");
    },
  });
  input.length = 3;
  input.extra = "ignored like JSON array properties";

  equal(formatDiagnosticValue(input), "[1,[Getter],[Empty]]", "06.01");
  equal(reads, 0, "06.02");
});

test("07 - marks cycles but expands repeated sibling references", () => {
  const shared = { value: 1 };
  const input = { left: shared, right: shared };
  input.self = input;

  equal(
    formatDiagnosticValue(input),
    '{"left":{"value":1},"right":{"value":1},"self":[Circular]}',
    "07.01",
  );
});

test("08 - stops recursive inspection at five object levels", () => {
  const input = {};
  let cursor = input;
  for (let i = 0; i < 7; i += 1) {
    cursor.next = {};
    cursor = cursor.next;
  }

  equal(
    formatDiagnosticValue(input),
    '{"next":{"next":{"next":{"next":{"next":[MaxDepth]}}}}}',
    "08.01",
  );
});

test("09 - limits entries across the whole traversed value", () => {
  const input = { first: Array.from({ length: 49 }, () => 0), second: 2 };
  const result = formatDiagnosticValue(input);

  ok(result.includes('"first"'), "09.01");
  ok(result.endsWith(',"\u2026":[MaxEntries]}'), "09.02");
  is(result.includes('"second"'), false, "09.03");

  const arrayResult = formatDiagnosticValue(
    Array.from({ length: 51 }, (_, index) => index),
  );
  ok(arrayResult.endsWith(",[MaxEntries]]"), "09.04");

  const prettyResult = formatDiagnosticValue(
    Object.fromEntries(
      Array.from({ length: 51 }, (_, index) => [`key${index}`, index]),
    ),
    4,
  );
  ok(prettyResult.includes('    "…": [MaxEntries]'), "09.05");
});

test("10 - caps output while constructing strings and keys", () => {
  const stringResult = formatDiagnosticValue("x".repeat(10_000));
  equal(stringResult.length, 2000, "10.01");
  ok(stringResult.endsWith("\u2026"), "10.02");

  const symbolResult = formatDiagnosticValue(Symbol("x".repeat(10_000)));
  equal(symbolResult.length, 2000, "10.03");
  ok(symbolResult.endsWith("\u2026"), "10.04");

  const keyResult = formatDiagnosticValue({
    ["x".repeat(10_000)]: 1,
    after: 2,
  });
  ok(keyResult.length <= 2000, "10.05");
  ok(keyResult.endsWith("\u2026"), "10.06");
});

test("11 - contains hostile reflection and revoked proxies", () => {
  const ownKeysFailure = new Proxy(
    {},
    {
      ownKeys() {
        throw new Error("no keys");
      },
    },
  );
  equal(formatDiagnosticValue(ownKeysFailure), "[Uninspectable]", "11.01");

  const descriptorFailure = new Proxy(
    { bad: 1 },
    {
      getOwnPropertyDescriptor() {
        throw new Error("no descriptor");
      },
    },
  );
  equal(
    formatDiagnosticValue(descriptorFailure),
    '{"bad":[Uninspectable]}',
    "11.02",
  );
  equal(
    formatDiagnosticValue(descriptorFailure, 4),
    ["{", '    "bad": [Uninspectable]', "}"].join("\n"),
    "11.03",
  );

  const arrayDescriptorFailure = new Proxy([1, 2], {
    getOwnPropertyDescriptor(target, key) {
      if (key === "1") {
        throw new Error("no descriptor");
      }
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
  });
  equal(
    formatDiagnosticValue(arrayDescriptorFailure),
    "[1,[Uninspectable]]",
    "11.04",
  );

  const arrayLengthFailure = new Proxy([], {
    getOwnPropertyDescriptor(_target, key) {
      if (key === "length") {
        throw new Error("no length descriptor");
      }
    },
  });
  equal(formatDiagnosticValue(arrayLengthFailure), "[Uninspectable]", "11.05");

  const manyProperties = Object.fromEntries(
    Array.from({ length: 51 }, (_, index) => [`key${index}`, index]),
  );
  const lastDescriptorFailure = new Proxy(manyProperties, {
    getOwnPropertyDescriptor(target, key) {
      if (key === "key50") {
        throw new Error("no last descriptor");
      }
      return Reflect.getOwnPropertyDescriptor(target, key);
    },
  });
  ok(
    formatDiagnosticValue(lastDescriptorFailure).endsWith(',"…":[MaxEntries]}'),
    "11.06",
  );
  ok(
    formatDiagnosticValue(lastDescriptorFailure, 4).includes(
      '    "…": [MaxEntries]',
    ),
    "11.07",
  );

  const { proxy, revoke } = Proxy.revocable([], {});
  revoke();
  equal(formatDiagnosticValue(proxy), "[Uninspectable]", "11.08");
});

test("12 - does not invoke toJSON or mutate ordinary inputs", () => {
  let toJsonCalls = 0;
  const input = {
    nested: Object.freeze({ value: 1 }),
    toJSON() {
      toJsonCalls += 1;
      throw new Error("must not run");
    },
  };
  Object.freeze(input);
  const before = Object.getOwnPropertyDescriptors(input);

  equal(
    formatDiagnosticValue(input),
    '{"nested":{"value":1},"toJSON":[Function]}',
    "12.01",
  );
  equal(toJsonCalls, 0, "12.02");
  equal(Object.getOwnPropertyDescriptors(input), before, "12.03");
});

test("13 - includes enumerable symbol keys safely", () => {
  const marker = Symbol("marker");
  const input = { plain: 1, [marker]: 2 };

  equal(
    formatDiagnosticValue(input),
    '{"plain":1,Symbol("marker"):2}',
    "13.01",
  );
});

test("14 - contains failures in primitive conversion", () => {
  const OriginalString = globalThis.String;
  globalThis.String = (value) => {
    if (typeof value === "symbol") {
      throw new Error("conversion failed");
    }
    return OriginalString(value);
  };
  try {
    equal(formatDiagnosticValue(Symbol("x")), "[Uninspectable]", "14.01");
  } finally {
    globalThis.String = OriginalString;
  }
});

test("15 - rejects an impossible reflected array length defensively", () => {
  const originalDescriptor = Reflect.getOwnPropertyDescriptor;
  Reflect.getOwnPropertyDescriptor = (target, key) =>
    Array.isArray(target) && key === "length"
      ? { configurable: false, enumerable: false, value: -1, writable: true }
      : originalDescriptor(target, key);
  try {
    equal(formatDiagnosticValue([]), "[Uninspectable]", "15.01");
  } finally {
    Reflect.getOwnPropertyDescriptor = originalDescriptor;
  }
});

test("16 - bounds descriptor traps for non-enumerable proxy keys", () => {
  let descriptorCalls = 0;
  const input = new Proxy(
    {},
    {
      getOwnPropertyDescriptor() {
        descriptorCalls += 1;
        return undefined;
      },
      ownKeys() {
        return Array.from({ length: 100 }, (_, index) => `key${index}`);
      },
    },
  );

  equal(formatDiagnosticValue(input), '{"…":[MaxEntries]}', "16.01");
  equal(descriptorCalls, 50, "16.02");
});

test("17 - escapes symbol descriptions and labels empty accessors", () => {
  equal(
    formatDiagnosticValue(Symbol("\n\u001b[31m forged")),
    String.raw`Symbol("\n\u001b[31m forged")`,
    "17.01",
  );

  const input = {};
  Object.defineProperty(input, "accessor", {
    enumerable: true,
    get: undefined,
    set: undefined,
  });
  equal(formatDiagnosticValue(input), '{"accessor":[Accessor]}', "17.02");
});

test.run();
