// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { deepClone } from "../dist/codsen-utils.esm.js";

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

test("01 - preserves primitive proto data values", () => {
  const results = ["literal", true, null].map((value) => {
    const input = defineProto({}, value);
    const result = deepClone(input);
    return {
      descriptor: Object.getOwnPropertyDescriptor(result, "__proto__"),
      hasOwn: hasOwn.call(result, "__proto__"),
      ordinaryPrototype: Object.getPrototypeOf(result) === Object.prototype,
      value: getProtoValue(result),
    };
  });

  equal(
    results,
    [
      {
        descriptor: {
          configurable: true,
          enumerable: true,
          value: "literal",
          writable: true,
        },
        hasOwn: true,
        ordinaryPrototype: true,
        value: "literal",
      },
      {
        descriptor: {
          configurable: true,
          enumerable: true,
          value: true,
          writable: true,
        },
        hasOwn: true,
        ordinaryPrototype: true,
        value: true,
      },
      {
        descriptor: {
          configurable: true,
          enumerable: true,
          value: null,
          writable: true,
        },
        hasOwn: true,
        ordinaryPrototype: true,
        value: null,
      },
    ],
    "01.01",
  );
  equal(Object.prototype.polluted, undefined, "01.02");
});

test("02 - clones object values, cycles, and aliases", () => {
  const shared = { value: "shared" };
  const protoValue = { polluted: "local", shared };
  protoValue.self = protoValue;
  const input = defineProto({ alias: shared }, protoValue);

  const result = deepClone(input);
  const clonedProto = getProtoValue(result);

  equal(hasOwn.call(result, "__proto__"), true, "02.01");
  is(Object.getPrototypeOf(result), Object.prototype, "02.02");
  is.not(clonedProto, protoValue, "02.03");
  is(clonedProto.self, clonedProto, "02.04");
  is(clonedProto.shared, result.alias, "02.05");
  is.not(result.alias, shared, "02.06");
  equal(Object.prototype.polluted, undefined, "02.07");
});

test("03 - normalizes a null-prototype input without losing its data key", () => {
  const shared = { value: "shared" };
  const input = Object.create(null);
  input.alias = shared;
  defineProto(input, shared);

  const result = deepClone(input);

  is(Object.getPrototypeOf(input), null, "03.01");
  is(Object.getPrototypeOf(result), Object.prototype, "03.02");
  equal(hasOwn.call(result, "__proto__"), true, "03.03");
  is(getProtoValue(result), result.alias, "03.04");
  is.not(getProtoValue(result), shared, "03.05");
  equal(Object.prototype.polluted, undefined, "03.06");
});

test.run();
