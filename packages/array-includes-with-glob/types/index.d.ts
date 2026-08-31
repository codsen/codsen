declare const version: string;
interface CompletionStats {
  /** Number of prepared-pattern comparisons performed. */
  patternComparisons: number;
  /** Number of source positions read before the result was known. */
  sourceItemsVisited: number;
  /** Best-effort elapsed time for user-facing completion feedback. */
  timeTakenInMilliseconds: number;
}
interface Opts {
  arrayVsArrayAllMustBeFound: "any" | "all";
  caseSensitive: boolean;
  reportCompletionFunc: null | ((stats: CompletionStats) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}
interface InputOpts {
  arrayVsArrayAllMustBeFound?:
    | Opts["arrayVsArrayAllMustBeFound"]
    | null
    | undefined;
  caseSensitive?: boolean | null | undefined;
  reportCompletionFunc?: Opts["reportCompletionFunc"] | undefined;
  reportProgressFunc?: Opts["reportProgressFunc"] | undefined;
  reportProgressFuncFrom?: number | null | undefined;
  reportProgressFuncTo?: number | null | undefined;
}
declare const defaults: Readonly<Opts>;
/**
 * Test whether source values match whole-string wildcard patterns.
 *
 * `*` matches zero or more Unicode code points, including directory separators
 * and line breaks. Consecutive stars are equivalent to one. A backslash escapes
 * the next character, so `\*` matches a literal asterisk and `\\` matches a
 * literal backslash. All other punctuation is literal. Matching is
 * case-sensitive by default; case-insensitive matching uses one-code-point
 * uppercase comparisons and is not locale-aware.
 *
 * Pattern arrays form one allow/deny list. A leading `!` excludes a matching
 * source value from every positive pattern. Escape it as `\!` to match a
 * literal leading exclamation mark. With `arrayVsArrayAllMustBeFound: "any"`,
 * one positive pattern must match an allowed source value. With `"all"`, every
 * unique positive pattern must match an allowed source value. A negative-only
 * list matches when at least one source value is not excluded.
 *
 * Empty strings are values and patterns; `""` therefore matches `""`, and `*`
 * also matches `""`. Empty and holes-only pattern arrays match nothing.
 * Non-string entries and holes in a source array are skipped. The function does
 * not mutate its inputs.
 *
 * Progress and completion callbacks are observational. Progress is finite and
 * monotonic within the configured range. Callback errors propagate to the
 * caller.
 *
 * @param input one source string or a read-only array whose non-string entries
 * are skipped
 * @param findThis one pattern or a read-only array of patterns
 * @param opts matching and reporting options
 * @returns whether the requested pattern condition was satisfied
 * @example
 * includesWithGlob(["index.js", "index.test.js"], ["*.js", "!*.test.js"]);
 * // => true
 */
declare function includesWithGlob(
  input: string | readonly unknown[],
  findThis: string | readonly string[],
  opts?: InputOpts | null,
): boolean;

export { defaults, includesWithGlob, version };
export type { CompletionStats, InputOpts, Opts };
