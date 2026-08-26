// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { combinations } from "../dist/object-boolean-combinations.esm.js";

const hasOwn = Object.prototype.hasOwnProperty;

function defineProto(target, value) {
  Object.defineProperty(target, "__proto__", {
    configurable: true,
    enumerable: true,
    value,
    writable: true,
  });
  return target;
}

function getProtoValue(target) {
  return Object.getOwnPropertyDescriptor(target, "__proto__").value;
}

test("01 - generates a boolean proto data key", () => {
  const input = defineProto({ enabled: false }, false);
  const rows = combinations(input);

  equal(
    rows.map((row) => ({ enabled: row.enabled, proto: getProtoValue(row) })),
    [
      { enabled: false, proto: false },
      { enabled: true, proto: false },
      { enabled: false, proto: true },
      { enabled: true, proto: true },
    ],
    "01.01",
  );
  equal(
    rows.every((row) => {
      const descriptor = Object.getOwnPropertyDescriptor(row, "__proto__");
      return (
        hasOwn.call(row, "__proto__") &&
        descriptor.configurable &&
        descriptor.enumerable &&
        descriptor.writable
      );
    }),
    true,
    "01.02",
  );
  equal(
    rows.every((row) => Object.getPrototypeOf(row) === Object.prototype),
    true,
    "01.03",
  );
  equal(Object.prototype.polluted, undefined, "01.04");
});

test("02 - safely applies proto overrides", () => {
  const input = defineProto({ enabled: false }, false);
  const protoValue = { polluted: "local" };
  const overrideValues = ["pinned", true, protoValue, null];
  const overrides = overrideValues.map((value, index) =>
    defineProto(index % 2 ? Object.create(null) : {}, value),
  );
  const rowGroups = overrides.map((override) => combinations(input, override));

  equal(
    rowGroups.map((rows) =>
      rows.map((row) => ({
        enabled: row.enabled,
        proto: getProtoValue(row),
      })),
    ),
    [
      [
        { enabled: false, proto: "pinned" },
        { enabled: true, proto: "pinned" },
      ],
      [
        { enabled: false, proto: true },
        { enabled: true, proto: true },
      ],
      [
        { enabled: false, proto: { polluted: "local" } },
        { enabled: true, proto: { polluted: "local" } },
      ],
      [
        { enabled: false, proto: null },
        { enabled: true, proto: null },
      ],
    ],
    "02.01",
  );
  equal(
    rowGroups.flat().every((row) => {
      const descriptor = Object.getOwnPropertyDescriptor(row, "__proto__");
      return (
        hasOwn.call(row, "__proto__") &&
        descriptor.configurable &&
        descriptor.enumerable &&
        descriptor.writable &&
        descriptor.value === getProtoValue(row)
      );
    }),
    true,
    "02.02",
  );
  equal(
    rowGroups
      .flat()
      .every((row) => Object.getPrototypeOf(row) === Object.prototype),
    true,
    "02.03",
  );
  is.not(getProtoValue(rowGroups[2][0]), protoValue, "02.04");
  is(Object.getPrototypeOf(overrides[1]), null, "02.05");
  is(Object.getPrototypeOf(overrides[3]), null, "02.06");
  equal(Object.prototype.polluted, undefined, "02.07");

  const mixedOverride = defineProto({ enabled: "fixed" }, true);
  equal(
    combinations(input, mixedOverride).map((row) => ({
      enabled: row.enabled,
      proto: getProtoValue(row),
    })),
    [{ enabled: "fixed", proto: true }],
    "02.08",
  );
});

test("03 - accepts a null-prototype input", () => {
  const input = Object.create(null);
  input.enabled = false;
  defineProto(input, true);

  const rows = combinations(input);

  is(Object.getPrototypeOf(input), null, "03.01");
  equal(rows.length, 4, "03.02");
  equal(
    rows.every((row) => hasOwn.call(row, "__proto__")),
    true,
    "03.03",
  );
  equal(
    rows.every((row) => Object.getPrototypeOf(row) === Object.prototype),
    true,
    "03.04",
  );
  equal(
    rows.map((row) => getProtoValue(row)),
    [false, false, true, true],
    "03.05",
  );
  equal(Object.prototype.polluted, undefined, "03.06");
});

test.run();
