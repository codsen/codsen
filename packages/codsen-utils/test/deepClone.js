// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { Buffer } from "node:buffer";
import vm from "node:vm";
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
  equal(result.fn(), "value", "03.05");
});

test("04 - dates are cloned", () => {
  let input = new Date("2024-01-02T03:04:05.000Z");
  let result = deepClone(input);

  equal(result, input, "04.01");
  equal(result.getTime(), input.getTime(), "04.02");
  is.not(result, input, "04.03");
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

test("15 - ordinary class instances retain their prototype and cloned state", () => {
  class Wrapper {
    constructor() {
      this.value = { marker: true };
    }

    read() {
      return this.value.marker;
    }
  }

  let input = new Wrapper();
  let result = deepClone(input);

  equal(result.value, { marker: true }, "15.01");
  equal(result.read(), true, "15.02");
  is.not(result, input, "15.03");
  is.not(result.value, input.value, "15.04");
  is(Object.getPrototypeOf(result), Wrapper.prototype, "15.05");
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

test("17 - regular expressions retain their behaviour and state", () => {
  let input = /a+/gi;
  input.lastIndex = 3;
  input.extra = { marker: true };

  let result = deepClone(input);

  equal(result.source, "a+", "17.01");
  equal(result.flags, "gi", "17.02");
  equal(result.lastIndex, 3, "17.03");
  equal(result.extra, { marker: true }, "17.04");
  equal(result instanceof RegExp, true, "17.05");
  is.not(result, input, "17.06");
  is.not(result.extra, input.extra, "17.07");
});

test("18 - errors retain their prototype, message, cause and own state", () => {
  let input = new TypeError("bad input");
  input.cause = { marker: true };
  input.extra = { nested: true };

  let result = deepClone(input);

  equal(result instanceof TypeError, true, "18.01");
  equal(result.name, "TypeError", "18.02");
  equal(result.message, "bad input", "18.03");
  equal(result.cause, { marker: true }, "18.04");
  equal(result.extra, { nested: true }, "18.05");
  equal(result.toString(), "TypeError: bad input", "18.06");
  is.not(result.cause, input.cause, "18.07");
  is.not(result.extra, input.extra, "18.08");
});

test("19 - URLs retain their behaviour and clone enumerable own state", () => {
  let input = new URL("https://example.com/a?q=one");
  input.extra = { marker: true };

  let result = deepClone(input);

  equal(result.href, "https://example.com/a?q=one", "19.01");
  equal(result.searchParams.get("q"), "one", "19.02");
  equal(result.extra, { marker: true }, "19.03");
  equal(result instanceof URL, true, "19.04");
  is.not(result, input, "19.05");
  is.not(result.extra, input.extra, "19.06");
});

test("20 - accessors are read once and symbol values retain identity", () => {
  let reads = 0;
  let marker = Symbol("marker");
  let computed = { nested: true };
  let input = { marker };
  Object.defineProperty(input, "computed", {
    enumerable: true,
    get() {
      reads += 1;
      return computed;
    },
  });

  let result = deepClone(input);
  let descriptor = Object.getOwnPropertyDescriptor(result, "computed");

  equal(reads, 1, "20.01");
  is(result.marker, marker, "20.02");
  equal(result.computed, { nested: true }, "20.03");
  equal(descriptor.get, undefined, "20.04");
  equal(descriptor.enumerable, true, "20.05");
  equal(descriptor.writable, true, "20.06");
  is.not(result.computed, computed, "20.07");
});

test("21 - cross-realm values retain usable built-in and class behaviour", () => {
  let input = vm.runInNewContext(`(() => {
    class Wrapper {
      constructor() {
        this.value = { marker: true };
      }
      read() {
        return this.value.marker;
      }
    }
    const buffer = new ArrayBuffer(6);
    new Uint8Array(buffer).set([0, 1, 2, 3, 4, 5]);
    return {
      record: { nested: { marker: true } },
      date: new Date(123),
      map: new Map([[{ key: 1 }, { value: 2 }]]),
      set: new Set([{ value: 3 }]),
      buffer,
      view: new Uint8Array(buffer, 1, 3),
      dataView: new DataView(buffer, 2, 2),
      regex: /a+/gi,
      error: new TypeError("bad input"),
      instance: new Wrapper()
    };
  })()`);

  let result = deepClone(input);
  let [[mapKey, mapValue]] = result.map;
  let [setValue] = result.set;

  equal(result.date.getTime(), 123, "21.01");
  equal(result.regex.test("AA"), true, "21.02");
  equal(mapKey.key, 1, "21.03");
  equal(mapValue.value, 2, "21.04");
  equal(setValue.value, 3, "21.05");
  equal([...new Uint8Array(result.buffer)], [0, 1, 2, 3, 4, 5], "21.06");
  equal([...result.view], [1, 2, 3], "21.07");
  equal(result.dataView.getUint8(0), 2, "21.08");
  equal(result.error.toString(), "TypeError: bad input", "21.09");
  equal(result.instance.read(), true, "21.10");
  is.not(result.record, input.record, "21.11");
  is.not(result.record.nested, input.record.nested, "21.12");
  is.not(result.date, input.date, "21.13");
  is.not(result.regex, input.regex, "21.14");
  is.not(result.map, input.map, "21.15");
  is.not(result.set, input.set, "21.16");
  is.not(result.buffer, input.buffer, "21.17");
  is.not(result.view, input.view, "21.18");
  is.not(result.dataView, input.dataView, "21.19");
  is(
    Object.getPrototypeOf(result.instance),
    Object.getPrototypeOf(input.instance),
    "21.20",
  );
});

test.run();
