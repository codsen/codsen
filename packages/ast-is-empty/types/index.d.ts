declare const version: string;
interface CompletionStats {
  /** Number of links to already-completed containers that were skipped. */
  readonly aliasesSkipped: number;
  /** Number of array indices inspected, including a sparse hole that determines the result. */
  readonly arrayElementsVisited: number;
  /** Deepest value or array slot inspected, where the root has depth zero. */
  readonly maxDepth: number;
  /** Number of own enumerable string-keyed object properties inspected. */
  readonly objectPropertiesVisited: number;
  /** Best-effort elapsed time for user-facing completion feedback. */
  readonly timeTakenInMilliseconds: number;
  /** Number of distinct arrays and plain objects entered. */
  readonly uniqueContainersVisited: number;
}
interface Opts {
  reportCompletionFunc: null | ((stats: Readonly<CompletionStats>) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}
interface InputOpts {
  reportCompletionFunc?: Opts["reportCompletionFunc"] | undefined;
  reportProgressFunc?: Opts["reportProgressFunc"] | undefined;
  reportProgressFuncFrom?: number | undefined;
  reportProgressFuncTo?: number | undefined;
}
declare const defaults: Readonly<Opts>;
type Result = boolean | null;
/**
 * Check whether a string or recursively nested array/plain-object tree is
 * strictly empty.
 *
 * `true` means every inspected string has zero code units and every inspected
 * container is empty or contains only empty supported values. Whitespace is
 * content and therefore produces `false`. `null` means the tree contains an
 * unsupported value, a sparse array hole, or a cycle; `null` takes precedence
 * over known content regardless of traversal order.
 *
 * Arrays are read through their own indexed slots without invoking an
 * iterator, and extra array properties are ignored. Plain objects contribute
 * their own enumerable string-keyed properties; symbol and non-enumerable
 * properties are ignored. Completed shared subtrees are inspected only once.
 *
 * Reporting callbacks are observational: their errors are ignored and cannot
 * change the tri-state result. Progress is finite and monotonic within the
 * configured range, and completion statistics are frozen.
 */
declare function isEmpty(input: unknown, opts?: InputOpts | null): Result;

export { defaults, isEmpty, version };
export type { CompletionStats, InputOpts, Opts };
