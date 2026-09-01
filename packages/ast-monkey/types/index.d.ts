export { DELETE, traverse } from "ast-monkey-traverse";

declare const version: string;
type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonObject
  | JsonArray;
type JsonObject = {
  [Key in string]?: JsonValue;
};
type JsonArray = JsonValue[];
type Only =
  | undefined
  | null
  | "any"
  | "all"
  | "everything"
  | "both"
  | "either"
  | "each"
  | "whatever"
  | "whatevs"
  | "e"
  | "array"
  | "arrays"
  | "arr"
  | "aray"
  | "a"
  | "object"
  | "objects"
  | "obj"
  | "ob"
  | "o";
/** Numeric traversal index, or its unsigned decimal string spelling. */
type TraversalIndex = number | string;
type FindCriteria =
  | {
      kind: "key";
      key: unknown;
    }
  | {
      kind: "value";
      value: unknown;
    }
  | {
      kind: "entry";
      key: unknown;
      value: unknown;
    };
interface OnlyOpts {
  only?: Only;
}
type LegacyFindOpts =
  | {
      criteria?: never;
      key: string;
      val?: unknown;
    }
  | {
      criteria?: never;
      key?: null;
      val: unknown;
    };
type FindOpts = OnlyOpts &
  (
    | LegacyFindOpts
    | {
        criteria: FindCriteria;
        key?: never;
        val?: never;
      }
  );
interface GetOpts extends OnlyOpts {
  index: TraversalIndex;
}
type LegacySetOpts =
  | {
      key: string;
      val?: JsonValue;
    }
  | {
      key?: null;
      val: JsonValue;
    };
type SetOpts = {
  index: TraversalIndex;
} & LegacySetOpts;
interface DropOpts {
  index: TraversalIndex;
}
type DelOpts = FindOpts;
interface Finding {
  index: number;
  key: JsonValue;
  val: JsonValue | undefined;
  path: number[];
}
declare function find(input: JsonValue, opts: FindOpts): Finding[];
declare function get(input: JsonValue, opts: GetOpts): JsonValue;
declare function set(input: JsonValue, opts: SetOpts): JsonValue;
declare function drop(input: JsonValue, opts: DropOpts): JsonValue;
declare function del(input: JsonValue, opts: DelOpts): JsonValue;
declare function arrayFirstOnly(input: JsonValue): JsonValue;

export { arrayFirstOnly, del, drop, find, get, set, version };
export type {
  DelOpts,
  DropOpts,
  FindCriteria,
  FindOpts,
  Finding,
  GetOpts,
  JsonArray,
  JsonObject,
  JsonValue,
  Only,
  SetOpts,
  TraversalIndex,
};
