declare const version: string;
interface CompletionStats {
  /** Number of links to already-completed containers that were skipped. */
  readonly aliasesSkipped: number;
  /** Number of indexed array slots inspected, including a failing sparse hole. */
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
/**
 * Check whether a value is a whitespace string or an array/plain object whose
 * recursively inspected contents satisfy the same condition.
 *
 * Arrays are read through their own indexed slots without invoking an
 * iterator. A sparse hole is non-empty. Extra array properties are ignored.
 * Plain objects contribute their own enumerable string-keyed properties;
 * symbol and non-enumerable properties are ignored. Every other value,
 * including `null`, numbers, Booleans, boxed primitives, and class instances,
 * is non-empty. Cycles are non-empty, while completed shared subtrees are
 * inspected only once.
 *
 * Reporting callbacks are observational: their errors are ignored and cannot
 * change the Boolean result. Progress is finite and monotonic within the
 * configured range, and completion statistics are frozen.
 */
declare function empty(input: unknown, opts?: InputOpts | null): boolean;

export { defaults, empty, version };
export type { CompletionStats, InputOpts, Opts };
