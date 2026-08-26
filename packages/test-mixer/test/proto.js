// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { mixer, mixerLazy } from "../dist/test-mixer.esm.js";

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

function summarize(rows) {
  return rows.map((row) => ({
    enabled: row.enabled,
    proto: getProtoValue(row),
  }));
}

test("01 - mixes a boolean proto data key eagerly and lazily", () => {
  const defaultsObj = defineProto({ enabled: false }, true);
  const expected = [
    { enabled: false, proto: false },
    { enabled: true, proto: false },
    { enabled: false, proto: true },
    { enabled: true, proto: true },
  ];

  const eagerRows = mixer({}, defaultsObj);
  const lazyRows = [...mixerLazy({}, defaultsObj)];

  equal(summarize(eagerRows), expected, "01.01");
  equal(summarize(lazyRows), expected, "01.02");
  equal(
    [...eagerRows, ...lazyRows].every((row) => hasOwn.call(row, "__proto__")),
    true,
    "01.03",
  );
  equal(
    [...eagerRows, ...lazyRows].every(
      (row) => Object.getPrototypeOf(row) === Object.prototype,
    ),
    true,
    "01.04",
  );
  equal(Object.prototype.polluted, undefined, "01.05");
});

test("02 - preserves pinned and non-boolean proto values", () => {
  const booleanDefaults = defineProto({ enabled: false }, false);
  const shared = { value: "safe" };
  const protoValue = { polluted: "local", shared };
  protoValue.self = protoValue;
  const values = ["literal", true, null, protoValue];
  const cases = values.map((value, index) => {
    const ref = index % 2 ? Object.create(null) : {};
    if (value === protoValue) {
      ref.alias = shared;
    }
    defineProto(ref, value);
    return {
      eagerRows: mixer(ref, booleanDefaults),
      lazyRows: [...mixerLazy(ref, booleanDefaults)],
      ref,
      value,
    };
  });

  equal(
    cases
      .slice(0, 3)
      .map(({ eagerRows, lazyRows }) => [
        eagerRows.map((row) => getProtoValue(row)),
        lazyRows.map((row) => getProtoValue(row)),
      ]),
    [
      [
        ["literal", "literal"],
        ["literal", "literal"],
      ],
      [
        [true, true],
        [true, true],
      ],
      [
        [null, null],
        [null, null],
      ],
    ],
    "02.01",
  );
  equal(
    cases
      .flatMap(({ eagerRows, lazyRows }) => [...eagerRows, ...lazyRows])
      .every((row) => {
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
    cases
      .flatMap(({ eagerRows, lazyRows }) => [...eagerRows, ...lazyRows])
      .every((row) => Object.getPrototypeOf(row) === Object.prototype),
    true,
    "02.03",
  );
  equal(
    cases.map(
      ({ ref }, index) =>
        Object.getPrototypeOf(ref) === (index % 2 ? null : Object.prototype),
    ),
    [true, true, true, true],
    "02.04",
  );

  const { eagerRows: objectRows, lazyRows: lazyObjectRows } = cases[3];
  equal([objectRows.length, lazyObjectRows.length], [2, 2], "02.05");
  equal(
    [...objectRows, ...lazyObjectRows].every(
      (row) =>
        getProtoValue(row).polluted === "local" &&
        getProtoValue(row).self === getProtoValue(row) &&
        getProtoValue(row).shared === row.alias,
    ),
    true,
    "02.06",
  );
  equal(
    [...objectRows, ...lazyObjectRows].every(
      (row) => getProtoValue(row) !== protoValue && row.alias !== shared,
    ),
    true,
    "02.07",
  );
  is.not(getProtoValue(objectRows[0]), getProtoValue(objectRows[1]), "02.08");
  is.not(objectRows[0].alias, objectRows[1].alias, "02.09");
  is.not(
    getProtoValue(lazyObjectRows[0]),
    getProtoValue(lazyObjectRows[1]),
    "02.10",
  );
  is.not(lazyObjectRows[0].alias, lazyObjectRows[1].alias, "02.11");
  equal(Object.prototype.polluted, undefined, "02.12");
});

test("03 - accepts null-prototype defaults", () => {
  const defaultsObj = Object.create(null);
  defaultsObj.enabled = false;
  defineProto(defaultsObj, "data");

  const eagerRows = mixer({}, defaultsObj);
  const lazyRows = [...mixerLazy({}, defaultsObj)];

  equal(
    summarize(eagerRows),
    [
      { enabled: false, proto: "data" },
      { enabled: true, proto: "data" },
    ],
    "03.01",
  );
  equal(summarize(lazyRows), summarize(eagerRows), "03.02");
  equal(
    [...eagerRows, ...lazyRows].every((row) => hasOwn.call(row, "__proto__")),
    true,
    "03.03",
  );
  equal(
    [...eagerRows, ...lazyRows].every(
      (row) => Object.getPrototypeOf(row) === Object.prototype,
    ),
    true,
    "03.04",
  );
  is(Object.getPrototypeOf(defaultsObj), null, "03.05");
  equal(Object.prototype.polluted, undefined, "03.06");
});

test.run();
