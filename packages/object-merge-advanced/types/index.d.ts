declare const version: string;
type argType =
  | "date"
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
interface InfoObj {
  path: string | undefined;
  key: string | null;
  type: [argType, argType];
}
interface Opts {
  cb:
    | null
    | ((input1: any, input2: any, result: any, infoObj?: InfoObj) => any);
  mergeObjectsOnlyWhenKeysetMatches: boolean;
  ignoreKeys: string | string[];
  hardMergeKeys: string | string[];
  hardArrayConcatKeys: string[];
  mergeArraysContainingStringsToBeEmpty: boolean;
  oneToManyArrayObjectMerge: boolean;
  hardMergeEverything: boolean;
  hardArrayConcat: boolean;
  ignoreEverything: boolean;
  concatInsteadOfMerging: boolean;
  dedupeStringsInArrayValues: boolean;
  mergeBoolsUsingOrNotAnd: boolean;
  useNullAsExplicitFalse: boolean;
}
declare const defaults: Opts;
/**
 * Recursively, deeply merge of anything
 */
declare function externalApi(
  input1: unknown,
  input2: unknown,
  opts?: Partial<Opts>,
): any;

export {
  type InfoObj,
  type Opts,
  type argType,
  defaults,
  externalApi as mergeAdvanced,
  version,
};
