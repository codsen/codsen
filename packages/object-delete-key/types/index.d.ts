declare const version: string;
type TreePrimitive = string | number | boolean | null | undefined;
interface ReadonlyTreeObject {
  readonly [key: string]: ReadonlyTreeValue;
}
interface ReadonlyTreeArray extends ReadonlyArray<ReadonlyTreeValue> {}
type ReadonlyTreeValue = TreePrimitive | ReadonlyTreeObject | ReadonlyTreeArray;
interface TreeObject {
  [key: string]: TreeValue;
}
/** @deprecated Use TreeObject. */
type Obj = TreeObject;
interface TreeArray extends Array<TreeValue> {}
type TreeValue = TreePrimitive | TreeObject | TreeArray;
type Only =
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
interface InputOpts {
  cleanup?: boolean | undefined;
  only?: Only | undefined;
  reportCompletionFunc?:
    | null
    | undefined
    | ((stats: Readonly<CompletionStats>) => void);
  reportProgressFunc?: null | undefined | ((percentageDone: number) => void);
  reportProgressFuncFrom?: number | undefined;
  reportProgressFuncTo?: number | undefined;
}
type SelectorOpts<Value = ReadonlyTreeValue> =
  | {
      key: string;
      val?: Value | undefined;
    }
  | {
      key?: null;
      val: Value;
    };
type Opts<Value = ReadonlyTreeValue> = InputOpts & SelectorOpts<Value>;
interface CompletionStats {
  /** Number of entries removed because they matched the selector directly. */
  readonly directDeletions: number;
  /** Number of affected empty containers removed during cleanup. */
  readonly cleanupPrunedContainers: number;
  /** Deepest validated entry, where the root value has depth zero. */
  readonly maxDepth: number;
  /** Number of validated object properties and array slots, including holes. */
  readonly totalEntries: number;
  /** Number of object properties and array slots visited during transformation. */
  readonly visitedEntries: number;
  /** Best-effort elapsed time from input cloning and validation through completion. */
  readonly timeTakenInMilliseconds: number;
}
interface Defaults {
  readonly cleanup: true;
  readonly key: null;
  readonly only: "any";
  readonly reportCompletionFunc: null;
  readonly reportProgressFunc: null;
  readonly reportProgressFuncFrom: 0;
  readonly reportProgressFuncTo: 100;
  readonly val: undefined;
}
type IsAny<T> = 0 extends 1 & T ? true : false;
type TreeCheck<T, Seen = never> =
  IsAny<T> extends true
    ? false
    : T extends unknown
      ? TreeCheckMember<T, Seen>
      : never;
type TreeCheckMember<T, Seen> = [T] extends [Seen]
  ? true
  : T extends TreePrimitive
    ? true
    : T extends (...args: never[]) => unknown
      ? false
      : T extends ReadonlyArray<infer Item>
        ? false extends TreeCheck<Item, Seen | T>
          ? false
          : true
        : T extends object
          ? Extract<keyof T, symbol> extends never
            ? false extends {
                [Key in keyof T]-?: TreeCheck<T[Key], Seen | T>;
              }[keyof T]
              ? false
              : true
            : false
          : false;
type TreeConstraint<T> = false extends TreeCheck<T> ? never : unknown;
type MutableTree<T> = T extends TreePrimitive
  ? T
  : T extends ReadonlyArray<infer Item>
    ? Array<MutableTree<Item>>
    : T extends object
      ? {
          -readonly [Key in keyof T]: MutableTree<T[Key]>;
        }
      : never;
declare const defaults: Readonly<Defaults>;
declare function deleteKey<T, Value = never>(
  input: T,
  opts: Opts<Value>,
  ...invalid: false extends TreeCheck<T> | TreeCheck<Value> ? [never] : []
): MutableTree<T>;

export { defaults, deleteKey, version };
export type {
  CompletionStats,
  Defaults,
  InputOpts,
  MutableTree,
  Obj,
  Only,
  Opts,
  ReadonlyTreeArray,
  ReadonlyTreeObject,
  ReadonlyTreeValue,
  SelectorOpts,
  TreeArray,
  TreeConstraint,
  TreeObject,
  TreePrimitive,
  TreeValue,
};
