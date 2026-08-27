import {
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
