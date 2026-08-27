import {
  deepClone,
  deepCloneWithMetadata,
  hasOwnProp,
  isPlainObject,
  type JSONValue,
  type PlainObject,
} from "codsen-utils";

declare const candidate: unknown;

if (isPlainObject(candidate)) {
  const record: PlainObject = candidate;
  const property: unknown = candidate.anything;
  // @ts-expect-error plain-object values are not necessarily JSON values
  const jsonProperty: JSONValue = candidate.anything;
  void record;
  void property;
  void jsonProperty;
}

hasOwnProp([], "length");
hasOwnProp(() => {}, "prototype");
hasOwnProp(Object.create(null), Symbol.iterator);
hasOwnProp("abc", 0);

deepClone(new Date()).getTime();
deepClone(new Map<string, { value: number }>()).set("key", { value: 1 });
deepClone(new Set<string>()).add("value");
deepClone(/value/g).test("value");
deepClone(new TypeError("bad input")).message;
deepClone(new URL("https://example.com")).searchParams.get("key");
deepClone(new Uint8Array([1, 2])).subarray(1);

class CloneableClass {
  value = { marker: true };

  read(): boolean {
    return this.value.marker;
  }
}

deepClone(new CloneableClass()).read();
deepCloneWithMetadata(new CloneableClass()).value.read();
