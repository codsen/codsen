import { runInNewContext } from "node:vm";

import { test } from "uvu";
import { equal } from "uvu/assert";

import { nonEmpty } from "../dist/util-nonempty.esm.js";

test("01 - omitted and undefined inputs are empty", () => {
  equal(nonEmpty(), false, "01.01");
  equal(nonEmpty(undefined), false, "01.02");
  equal(nonEmpty(null), false, "01.03");
});

test("02 - strings use their shallow length", () => {
  equal(nonEmpty(""), false, "02.01");
  equal(nonEmpty("a"), true, "02.02");
  equal(nonEmpty(" "), true, "02.03");
  equal(nonEmpty("\n\t"), true, "02.04");
});

test("03 - arrays use their shallow outer length", () => {
  const sparse = new Array(1);
  const zeroLengthExpando = [];
  zeroLengthExpando.extra = true;

  equal(nonEmpty([]), false, "03.01");
  equal(nonEmpty([""]), true, "03.02");
  equal(nonEmpty([[]]), true, "03.03");
  equal(nonEmpty(sparse), true, "03.04");
  equal(nonEmpty(zeroLengthExpando), false, "03.05");
});

test("04 - every number is non-empty", () => {
  equal(nonEmpty(0), true, "04.01");
  equal(nonEmpty(-0), true, "04.02");
  equal(nonEmpty(1), true, "04.03");
  equal(nonEmpty(Number.NaN), true, "04.04");
  equal(nonEmpty(Number.POSITIVE_INFINITY), true, "04.05");
  equal(nonEmpty(Number.NEGATIVE_INFINITY), true, "04.06");
});

test("05 - unsupported values are empty", () => {
  const callable = () => "value";
  callable.extra = true;

  equal(nonEmpty(0n), false, "05.01");
  equal(nonEmpty(1n), false, "05.02");
  equal(nonEmpty(false), false, "05.03");
  equal(nonEmpty(true), false, "05.04");
  equal(nonEmpty(Symbol("value")), false, "05.05");
  equal(nonEmpty(callable), false, "05.06");
  equal(nonEmpty(new Map([["key", "value"]])), false, "05.07");
  equal(nonEmpty(new Set(["value"])), false, "05.08");
  equal(nonEmpty(new String("value")), false, "05.09");
  equal(nonEmpty(new Number(1)), false, "05.10");
  equal(nonEmpty(new Boolean(true)), false, "05.11");
  equal(nonEmpty(Object(Symbol("value"))), false, "05.12");
  equal(nonEmpty(Object(1n)), false, "05.13");

  class Box {
    constructor() {
      this.value = true;
    }
  }

  equal(nonEmpty(new Box()), false, "05.14");
});

test("06 - plain records use own enumerable string keys", () => {
  const constructed = new Object();
  const nullPrototype = Object.create(null);

  equal(nonEmpty({}), false, "06.01");
  equal(nonEmpty({ value: undefined }), true, "06.02");
  equal(nonEmpty(constructed), false, "06.03");
  constructed.value = true;
  equal(nonEmpty(constructed), true, "06.04");
  equal(nonEmpty(nullPrototype), false, "06.05");
  nullPrototype.value = true;
  equal(nonEmpty(nullPrototype), true, "06.06");
  equal(nonEmpty(runInNewContext("({})")), false, "06.07");
  equal(nonEmpty(runInNewContext("({ value: true })")), true, "06.08");
});

test("07 - custom-prototype objects are not plain records", () => {
  const ordinaryCustomPrototype = Object.create({ inherited: true });
  ordinaryCustomPrototype.own = true;

  const firstNullPrototype = Object.create(null);
  const oneLevelCustomPrototype = Object.create(firstNullPrototype);
  oneLevelCustomPrototype.own = true;

  const secondNullPrototype = Object.create(firstNullPrototype);
  const twoLevelCustomPrototype = Object.create(secondNullPrototype);
  twoLevelCustomPrototype.own = true;

  equal(nonEmpty(ordinaryCustomPrototype), false, "07.01");
  equal(nonEmpty(oneLevelCustomPrototype), false, "07.02");
  equal(nonEmpty(twoLevelCustomPrototype), false, "07.03");
});

test("08 - key discovery ignores symbols, descriptors, and values", () => {
  const symbolOnly = { [Symbol("value")]: true };
  const nonEnumerableOnly = {};
  Object.defineProperty(nonEnumerableOnly, "value", {
    enumerable: false,
    value: true,
  });

  let getterCalls = 0;
  const enumerableGetter = {};
  Object.defineProperty(enumerableGetter, "value", {
    enumerable: true,
    get() {
      getterCalls += 1;
      return true;
    },
  });

  equal(nonEmpty(symbolOnly), false, "08.01");
  equal(nonEmpty(nonEnumerableOnly), false, "08.02");
  equal(nonEmpty(enumerableGetter), true, "08.03");
  equal(getterCalls, 0, "08.04");
});

test.run();
