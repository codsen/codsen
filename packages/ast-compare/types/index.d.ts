declare const version: string;
type JsonValue = string | number | boolean | null | JsonObject | JsonArray;
type JsonObject = {
  readonly [Key in string]?: JsonValue | undefined;
};
type JsonArray = readonly (JsonValue | undefined)[];
type ComparableValue = JsonValue | undefined;
interface AnyObject {
  readonly [key: string]: unknown;
}
interface CompletionStats {
  candidateComparisons: number;
  comparisons: number;
  matchingEdges: number;
  timeTakenInMilliseconds: number;
}
interface Opts {
  arrayOrder: "ordered" | "any";
  hungryForWhitespace: boolean;
  matchStrictly: boolean;
  reportCompletionFunc: null | ((stats: CompletionStats) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
  verboseWhenMismatches: boolean;
  useWildcards: boolean;
}
type BooleanOpts = Partial<Opts> & {
  verboseWhenMismatches?: false | undefined;
};
type VerboseOpts = Partial<Opts> & {
  verboseWhenMismatches: true;
};
declare const defaults: Readonly<Opts>;
/**
 * Check whether the second value is equal to, or a subset of, the first value.
 */
declare function compare(
  b: ComparableValue,
  s: ComparableValue,
  opts: VerboseOpts,
): true | string;
declare function compare(
  b: ComparableValue,
  s: ComparableValue,
  opts?: BooleanOpts | null,
): boolean;
declare function compare(
  b: ComparableValue,
  s: ComparableValue,
  opts?: Partial<Opts> | null,
): boolean | string;

export { compare, defaults, version };
export type {
  AnyObject,
  BooleanOpts,
  ComparableValue,
  CompletionStats,
  JsonArray,
  JsonObject,
  JsonValue,
  Opts,
  VerboseOpts,
};
