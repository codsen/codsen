declare const version: string;
type argType =
  | "date"
  | "object"
  | "array"
  | "string"
  | "number"
  | "function"
  | "bigint"
  | "boolean"
  | "symbol"
  | "null"
  | "undefined";
type PathSegment = string | number;
interface InfoObj {
  path: string;
  pathSegments: readonly PathSegment[];
  key: string | null;
  type: [argType, argType];
}
interface Opts {
  cb: null | ((input1: any, input2: any, result: any, infoObj: InfoObj) => any);
  mergeObjectsOnlyWhenKeysetMatches: boolean;
  ignoreKeys: string | readonly string[];
  hardMergeKeys: string | readonly string[];
  hardArrayConcatKeys: string | readonly string[];
  mergeArraysContainingStringsToBeEmpty: boolean;
  oneToManyArrayObjectMerge: boolean;
  hardMergeEverything: boolean;
  hardArrayConcat: boolean;
  ignoreEverything: boolean;
  concatInsteadOfMerging: boolean;
  dedupeStringsInArrayValues: boolean;
  mergeBoolsUsingOrNotAnd: boolean;
  useNullAsExplicitFalse: boolean;
  /** Reuse exclusively owned input trees without repeated references. Inputs may be mutated. */
  reuseInputs: boolean;
}
type InputOpts = {
  [Key in keyof Opts]?: Opts[Key] | undefined;
};
declare const defaults: Readonly<Opts>;
/**
 * Recursively, deeply merge of anything
 */
declare function externalApi(
  input1: unknown,
  input2?: unknown,
  opts?: InputOpts | null,
): any;

export { defaults, externalApi as mergeAdvanced, version };
export type { InfoObj, InputOpts, Opts, PathSegment, argType };
