// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { Buffer } from "node:buffer";
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { deepClone, deepCloneWithMetadata } from "../dist/codsen-utils.esm.js";

test("01 - nested objects and arrays get distinct references", () => {
  let input = {
    nested: { value: 1 },
    list: [{ value: 2 }],
  };
  let result = deepClone(input);

  equal(result, input, "01.01");
  is.not(result, input, "01.02");
  is.not(result.nested, input.nested, "01.03");
  is.not(result.list, input.list, "01.04");
  is.not(result.list[0], input.list[0], "01.05");
});

test("02 - own enumerable array properties are cloned", () => {
  let input = [{ value: 1 }];
  input.note = { value: 2 };
  let result = deepClone(input);

  equal(result, input, "02.01");
  is.not(result.note, input.note, "02.02");
});

test("03 - undefined, functions and symbols are retained", () => {
  let fn = () => "value";
  let marker = Symbol("marker");
  let input = { missing: undefined, fn, marker };
  let result = deepClone(input);

  equal(Object.hasOwn(result, "missing"), true, "03.01");
  is(result.missing, undefined, "03.02");
  is(result.fn, fn, "03.03");
  is(result.marker, marker, "03.04");
});

test("04 - dates are cloned", () => {
  let input = new Date("2024-01-02T03:04:05.000Z");
  let result = deepClone(input);

  equal(result, input, "04.01");
  is.not(result, input, "04.02");
});

test("05 - map keys and values are cloned", () => {
  let key = { id: 1 };
  let value = { nested: { value: 2 } };
  let input = new Map([[key, value]]);
  let result = deepClone(input);
  let [[resultKey, resultValue]] = result;

  equal([...result], [...input], "05.01");
  is.not(result, input, "05.02");
  is.not(resultKey, key, "05.03");
  is.not(resultValue, value, "05.04");
  is.not(resultValue.nested, value.nested, "05.05");
});

test("06 - set values are cloned", () => {
  let value = { nested: { value: 1 } };
  let input = new Set([value]);
  let result = deepClone(input);
  let [resultValue] = result;

  equal([...result], [...input], "06.01");
  is.not(result, input, "06.02");
  is.not(resultValue, value, "06.03");
  is.not(resultValue.nested, value.nested, "06.04");
});

test("07 - typed array views get independent backing buffers", () => {
  let input = new Uint8Array(new ArrayBuffer(6), 2, 2);
  input.set([3, 4]);
  let result = deepClone(input);

  equal([...result], [3, 4], "07.01");
  equal(result.byteOffset, 2, "07.02");
  is.not(result, input, "07.03");
  is.not(result.buffer, input.buffer, "07.04");

  result[0] = 9;
  equal(input[0], 3, "07.05");
});

test("08 - DataView and ArrayBuffer get independent backing data", () => {
  let inputBuffer = new ArrayBuffer(8);
  let input = new DataView(inputBuffer, 2, 4);
  input.setUint16(0, 513);
  let result = deepClone(input);

  equal(result.getUint16(0), 513, "08.01");
  equal(result.byteOffset, 2, "08.02");
  equal(result.byteLength, 4, "08.03");
  is.not(result, input, "08.04");
  is.not(result.buffer, input.buffer, "08.05");

  result.setUint8(0, 9);
  equal(input.getUint8(0), 2, "08.06");

  let clonedBuffer = deepClone(inputBuffer);
  equal(
    [...new Uint8Array(clonedBuffer)],
    [...new Uint8Array(inputBuffer)],
    "08.07",
  );
  is.not(clonedBuffer, inputBuffer, "08.08");
});

test("09 - buffers are cloned as buffers", () => {
  let input = Buffer.from([1, 2, 3]);
  let result = deepClone(input);

  equal([...result], [1, 2, 3], "09.01");
  equal(Buffer.isBuffer(result), true, "09.02");
  is.not(result, input, "09.03");

  result[0] = 9;
  equal(input[0], 1, "09.04");
});

test("10 - changing a clone does not mutate its input", () => {
  let input = {
    nested: { value: 1 },
    list: [1, 2],
  };
  let result = deepClone(input);

  result.nested.value = 9;
  result.list.push(3);

  equal(
    input,
    {
      nested: { value: 1 },
      list: [1, 2],
    },
    "10.01",
  );
});

test("11 - cycles are retained within the cloned graph", () => {
  let input = { name: "root" };
  input.self = input;
  input.map = new Map([[input, input]]);
  input.set = new Set([input]);

  let result = deepClone(input);
  let [[resultKey, resultValue]] = result.map;
  let [resultSetValue] = result.set;

  equal(result.name, "root", "11.01");
  is.not(result, input, "11.02");
  is(result.self, result, "11.03");
  is(resultKey, result, "11.04");
  is(resultValue, result, "11.05");
  is(resultSetValue, result, "11.06");
});

test("12 - repeated references share one clone", () => {
  let shared = { nested: { value: 1 } };
  let input = { left: shared, right: shared };

  let result = deepClone(input);

  is.not(result.left, shared, "12.01");
  is(result.left, result.right, "12.02");
  is(result.left.nested, result.right.nested, "12.03");
});

test("13 - sibling views retain their shared cloned backing buffer", () => {
  let buffer = new ArrayBuffer(8);
  new Uint8Array(buffer).set([0, 1, 2, 3, 4, 5, 6, 7]);
  let first = new Uint8Array(buffer, 1, 4);
  let second = new DataView(buffer, 2, 3);
  let input = { first, second, buffer };

  let result = deepClone(input);

  is.not(result.buffer, buffer, "13.01");
  is(result.first.buffer, result.buffer, "13.02");
  is(result.second.buffer, result.buffer, "13.03");
  equal(result.first.byteOffset, 1, "13.04");
  equal(result.second.byteOffset, 2, "13.05");

  result.first[1] = 99;
  equal(result.second.getUint8(0), 99, "13.06");
  equal(first[1], 2, "13.07");
});

test("14 - large graphs retain shared references after memo promotion", () => {
  let shared = { marker: true };
  let input = {
    nodes: Array.from({ length: 40 }, (_, id) => ({ id, shared })),
    nullPrototype: Object.assign(Object.create(null), { shared }),
    shared,
  };
  input.self = input;

  let result = deepClone(input);

  equal(result.nodes.length, 40, "14.01");
  is.not(result.shared, shared, "14.02");
  equal(
    result.nodes.every((node) => node.shared === result.shared),
    true,
    "14.03",
  );
  is(result.self, result, "14.04");
  is(result.nullPrototype.shared, result.shared, "14.05");
});

test("15 - class instances retain enumerable data as plain records", () => {
  class Wrapper {
    constructor() {
      this.value = { marker: true };
    }
  }

  let input = new Wrapper();
  let result = deepClone(input);

  equal(result, { value: { marker: true } }, "15.01");
  is.not(result, input, "15.02");
  is.not(result.value, input.value, "15.03");
  is(Object.getPrototypeOf(result), Object.prototype, "15.04");
});

test("16 - clone metadata identifies reused source objects", () => {
  let shared = { marker: true };
  let tree = deepCloneWithMetadata({ left: { marker: true } });
  let graph = deepCloneWithMetadata({ left: shared, right: shared });

  equal(tree.hasRepeatedReferences, false, "16.01");
  equal(tree.value, { left: { marker: true } }, "16.02");
  equal(graph.hasRepeatedReferences, true, "16.03");
  is.not(graph.value.left, shared, "16.04");
  is(graph.value.left, graph.value.right, "16.05");
});

test.run();
