import stringifySafe from "json-stringify-safe";
import { deleteKey } from "object-delete-key";

// declare let DEV: boolean;

export interface Obj {
  [key: string]: any;
}

export const uvuAsserts = new Set([
  "equal",
  "is",
  "ok",
  "type",
  "match",
  "throws",
]);

export function pad(num: number) {
  return String(num).padStart(2, "0");
}

export function containsNumber(something: unknown): boolean {
  if (typeof something !== "string" || !something.trim()) {
    return false;
  }
  return /\d/.test(something);
}

// compiled from https://node-tap.org/docs/api/asserts/
export const messageIsSecondArg = new Set([
  "ok",
  "notOk",
  "true",
  "false",
  "assert",
  "assertNot",
  "error",
  "ifErr",
  "ifError",
  "rejects", // "rejects" message can be 2nd or 3rd arg!!!
  "resolves",
  "resolveMatchSnapshot",
  "throws", // "throws" message can be 2nd or 3rd arg!!!
  "throw", // "throw" message can be 2nd or 3rd arg!!!
  "doesNotThrow",
  "notThrow",
  "expectUncaughtException", // "expectUncaughtException" message can be 2nd or 3rd arg!!!
]);

// compiled from https://node-tap.org/docs/api/asserts/
export const messageIsThirdArg = new Set([
  "emits",
  "rejects", // "rejects" message can be 2nd or 3rd arg!!!
  "resolveMatch",
  "throws", // "throws" message can be 2nd or 3rd arg!!!
  "throw", // "throw" message can be 2nd or 3rd arg!!!
  "expectUncaughtException", // "expectUncaughtException" message can be 2nd or 3rd arg!!!
  "equal",
  "equals",
  "isEqual",
  "is",
  "strictEqual",
  "strictEquals",
  "strictIs",
  "isStrict",
  "isStrictly",
  "notEqual",
  "inequal",
  "notEqual",
  "notEquals",
  "notStrictEqual",
  "notStrictEquals",
  "isNotEqual",
  "isNot",
  "doesNotEqual",
  "isInequal",
  "same",
  "equivalent",
  "looseEqual",
  "looseEquals",
  "deepEqual",
  "deepEquals",
  "isLoose",
  "looseIs",
  "notSame",
  "inequivalent",
  "looseInequal",
  "notDeep",
  "deepInequal",
  "notLoose",
  "looseNot",
  "strictSame",
  "strictEquivalent",
  "strictDeepEqual",
  "sameStrict",
  "deepIs",
  "isDeeply",
  "isDeep",
  "strictDeepEquals",
  "strictNotSame",
  "strictInequivalent",
  "strictDeepInequal",
  "notSameStrict",
  "deepNot",
  "notDeeply",
  "strictDeepInequals",
  "notStrictSame",
  "hasStrict",
  "match",
  "has",
  "hasFields",
  "matches",
  "similar",
  "like",
  "isLike",
  "includes",
  "include",
  "contains",
  "notMatch",
  "dissimilar",
  "unsimilar",
  "notSimilar",
  "unlike",
  "isUnlike",
  "notLike",
  "isNotLike",
  "doesNotHave",
  "isNotSimilar",
  "isDissimilar",
  "type",
  "isa",
  "isA",
]);

export const stringify = (obj: Obj) => {
  if (!obj) {
    return "";
  }
  let res = "";
  try {
    res = JSON.stringify(
      deleteKey(
        deleteKey(JSON.parse(stringifySafe(obj) || ""), {
          key: "parent",
        }) || {},
        {
          key: "loc",
        }
      ),
      null,
      4
    );
  } catch (error) {
    console.log(
      `${`\u001b[${33}m${`stringify() error`}\u001b[${39}m`} = ${JSON.stringify(
        error,
        null,
        4
      )}; input was: ${JSON.stringify(obj, null, 4)}`
    );
  }
  return res;
};

export function identifyAssertsMessageArgPos(
  assertsName: string
): "" | "1" | "2" {
  if (messageIsThirdArg.has(assertsName)) {
    return "2"; // argument at zero-indexed third position
  }
  if (messageIsSecondArg.has(assertsName)) {
    return "1"; // argument at zero-indexed second position
  }
  return "";
}
