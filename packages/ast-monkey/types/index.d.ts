interface LookaheadObj {
  [key: string]: any;
}
type LookaheadNextToken = [
  key: any,
  value: any,
  innerObj: {
    depth: number;
    path: string;
    parent: any;
    parentType: string;
  },
];
interface LookaheadInnerObj {
  depth: number;
  path: string;
  topmostKey?: string;
  parent?: any;
  parentType?: string;
  next?: LookaheadNextToken[];
}
type LookaheadCallback = (
  key: any,
  val: any,
  innerObj: LookaheadInnerObj,
  stop: {
    now: boolean;
  },
) => any;
declare function traverseWithLookahead(
  tree1: any,
  cb1: LookaheadCallback,
  lookahead?: number,
): void;

interface Stop {
  now: boolean;
}
type TreePrimitive = string | number | boolean | null | undefined;
type TreeValue = TreePrimitive | TreeArray | TreeObject;
interface TreeArray extends Array<TreeValue> {}
interface TreeObject {
  [key: string]: TreeValue;
}
type ReadonlyTreeValue = TreePrimitive | ReadonlyTreeArray | ReadonlyTreeObject;
interface ReadonlyTreeArray extends ReadonlyArray<ReadonlyTreeValue> {}
interface ReadonlyTreeObject {
  readonly [key: string]: ReadonlyTreeValue;
}
type ReadonlyTreeContainer = ReadonlyTreeArray | ReadonlyTreeObject;
/** Return this value from a traversal callback to delete the current node. */
declare const DELETE: unique symbol;
interface InnerObj {
  depth: number;
  path: string;
  pathSegments: readonly string[];
  topmostKey?: string;
  parent: ReadonlyTreeContainer;
  parentType: "array" | "object";
  parentKey: string | null;
}
type Callback = (
  key: string | TreeValue,
  val: TreeValue | undefined,
  innerObj: InnerObj,
  stop: Stop,
) => TreeValue | typeof DELETE;
/**
 * Utility library to traverse AST
 */
declare function traverse(tree1: TreeValue, cb1: Callback): TreeValue;

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

export {
  DELETE,
  arrayFirstOnly,
  del,
  drop,
  find,
  get,
  set,
  traverse,
  traverseWithLookahead,
  version,
};
export type {
  Callback,
  DelOpts,
  DropOpts,
  FindCriteria,
  FindOpts,
  Finding,
  GetOpts,
  InnerObj,
  JsonArray,
  JsonObject,
  JsonValue,
  LookaheadCallback,
  LookaheadInnerObj,
  LookaheadNextToken,
  LookaheadObj,
  Only,
  ReadonlyTreeArray,
  ReadonlyTreeContainer,
  ReadonlyTreeObject,
  ReadonlyTreeValue,
  SetOpts,
  Stop,
  TraversalIndex,
  TreeArray,
  TreeObject,
  TreePrimitive,
  TreeValue,
};
