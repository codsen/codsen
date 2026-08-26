// biome-ignore-all lint/correctness/noUnusedImports: convenience when writing new tests later
import { test } from "uvu";
import { equal, is, match, not, ok, throws, type } from "uvu/assert";

import { omit } from "../dist/codsen-utils.esm.js";

const hasOwn = Object.prototype.hasOwnProperty;

test("01 - empty plain object", () => {
  equal(omit(undefined, ["a", "c"]), undefined, "01.01");
  equal(omit(null, ["a", "c"]), null, "01.02");
  equal(omit({}, ["a", "c"]), {}, "01.03");
});

test("02 - throws truthy input is not a plain object", () => {
  throws(
    () => {
      omit([], ["zzz"]);
    },
    /THROW_ID_02/,
    "02.01",
  );
});

test("03", () => {
  let input = {
    a: 1,
    b: "c",
  };
  equal(
    omit(input, ["a", "c"]),
    {
      b: "c",
    },
    "03.01",
  );

  // didn't mutate:
  equal(
    input,
    {
      a: 1,
      b: "c",
    },
    "03.02",
  );
});

test("04 - retained nested values are deeply cloned", () => {
  let input = {
    keep: { nested: { value: 1 } },
    remove: { nested: { value: 2 } },
  };

  let result = omit(input, ["remove"]);

  equal(result, { keep: { nested: { value: 1 } } }, "04.01");
  is.not(result, input, "04.02");
  is.not(result.keep, input.keep, "04.03");
  is.not(result.keep.nested, input.keep.nested, "04.04");

  result.keep.nested.value = 9;
  equal(input.keep.nested.value, 1, "04.05");
});

test("05 - removed values are not read or cloned", () => {
  let reads = 0;
  let input = { keep: { value: 1 } };
  Object.defineProperty(input, "remove", {
    enumerable: true,
    get() {
      reads += 1;
      throw new Error("removed value was read");
    },
  });

  let result = omit(input, ["remove"]);

  equal(result, { keep: { value: 1 } }, "05.01");
  equal(reads, 0, "05.02");
});

test("06 - uses a Set for large objects and removal lists", () => {
  let input = Object.fromEntries(
    Array.from({ length: 130 }, (_, index) => [
      `key${index}`,
      { value: index },
    ]),
  );
  let result = omit(input, ["key1", "key3", "key5", "key7", "key9"]);

  equal(Object.keys(result).length, 125, "06.01");
  equal("key1" in result, false, "06.02");
  equal(result.key2, { value: 2 }, "06.03");
  is.not(result.key2, input.key2, "06.04");
});

test("07 - circular invalid input retains the validation error contract", () => {
  let input = [];
  input.push(input);
  let caught;
  try {
    omit(input, []);
  } catch (error) {
    caught = error;
  }

  ok(caught instanceof Error, "07.01");
  match(
    caught.message,
    /^codsen-utils\/omit\(\): \[THROW_ID_02\].*\[Circular\]/s,
    "07.02",
  );
});

test("08 - safely retains or removes a proto data key", () => {
  const protoValue = { polluted: "local" };
  const input = { keep: { value: 1 } };
  Object.defineProperty(input, "__proto__", {
    configurable: true,
    enumerable: true,
    value: protoValue,
    writable: true,
  });

  const result = omit(input);
  const resultProtoValue = Object.getOwnPropertyDescriptor(
    result,
    "__proto__",
  ).value;
  const resultProtoDescriptor = Object.getOwnPropertyDescriptor(
    result,
    "__proto__",
  );

  equal(
    {
      configurable: resultProtoDescriptor.configurable,
      enumerable: resultProtoDescriptor.enumerable,
      hasOwn: hasOwn.call(result, "__proto__"),
      writable: resultProtoDescriptor.writable,
    },
    { configurable: true, enumerable: true, hasOwn: true, writable: true },
    "08.01",
  );
  is(Object.getPrototypeOf(result), Object.prototype, "08.02");
  equal(resultProtoValue, protoValue, "08.03");
  is.not(resultProtoValue, protoValue, "08.04");
  equal(Object.prototype.polluted, undefined, "08.05");

  const removed = omit(input, ["__proto__"]);
  equal(hasOwn.call(removed, "__proto__"), false, "08.06");
  equal(removed, { keep: { value: 1 } }, "08.07");
});

test.run();
