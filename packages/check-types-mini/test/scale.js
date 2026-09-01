import { performance } from "node:perf_hooks";

import { test } from "uvu";
import { not, ok } from "uvu/assert";

import { checkTypesMini } from "../dist/check-types-mini.esm.js";

function nestedObjects(depth) {
  const input = {};
  const reference = {};
  let inputCursor = input;
  let referenceCursor = reference;
  for (let index = 0; index < depth; index++) {
    inputCursor.next = {};
    referenceCursor.next = {};
    inputCursor = inputCursor.next;
    referenceCursor = referenceCursor.next;
  }
  inputCursor.leaf = "value";
  referenceCursor.leaf = "";
  return [input, reference];
}

function nestedSchema(depth) {
  const input = {};
  const schema = {};
  let inputCursor = input;
  let schemaCursor = schema;
  for (let index = 0; index < depth; index++) {
    inputCursor.next = {};
    schemaCursor.next = {};
    inputCursor = inputCursor.next;
    schemaCursor = schemaCursor.next;
  }
  inputCursor.leaf = 1;
  schemaCursor.leaf = "number";
  return [input, schema];
}

function anyFixture(size) {
  const input = {};
  const schema = {};
  for (let index = 0; index < size; index++) {
    input[`key${index}`] = index;
    schema[`key${index}`] = "any";
  }
  return [input, schema];
}

function median(values) {
  return [...values].sort((left, right) => left - right)[
    Math.floor(values.length / 2)
  ];
}

function measureAny(size) {
  const [input, schema] = anyFixture(size);
  const timings = [];
  for (let run = 0; run < 3; run++) {
    const startedAt = performance.now();
    checkTypesMini(input, null, { schema });
    timings.push(performance.now() - startedAt);
  }
  return median(timings);
}

test("01 - deep reference graphs do not depend on the call stack", () => {
  const [input, reference] = nestedObjects(12_000);
  not.throws(() => {
    checkTypesMini(input, reference);
  }, "01.01");
});

test("02 - deep nested schemas are normalized iteratively", () => {
  const [input, schema] = nestedSchema(8_000);
  not.throws(() => {
    checkTypesMini(input, null, { schema });
  }, "02.01");
});

test("03 - mixed object and array graphs remain iterative", () => {
  const input = {};
  const reference = {};
  let inputCursor = input;
  let referenceCursor = reference;
  for (let index = 0; index < 4_000; index++) {
    inputCursor.next = [{}];
    referenceCursor.next = [{}];
    inputCursor = inputCursor.next[0];
    referenceCursor = referenceCursor.next[0];
  }
  inputCursor.leaf = true;
  referenceCursor.leaf = false;
  not.throws(() => {
    checkTypesMini(input, reference);
  }, "03.01");
});

test("04 - blanket-schema breadth has a bounded linear shape", () => {
  measureAny(500);
  const small = measureAny(2_000);
  const medium = measureAny(4_000);
  const large = measureAny(8_000);
  ok(medium <= small * 6 + 75, "04.01");
  ok(large <= small * 8 + 100, "04.02");
  ok(large < 2_000, "04.03");
});

test.run();
