import { createMatcher, formatDiagnosticValue } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

export interface CompletionStats {
  /** Number of prepared-pattern comparisons performed. */
  patternComparisons: number;
  /** Number of source positions read before the result was known. */
  sourceItemsVisited: number;
  /** Best-effort elapsed time for user-facing completion feedback. */
  timeTakenInMilliseconds: number;
}

export interface Opts {
  arrayVsArrayAllMustBeFound: "any" | "all";
  caseSensitive: boolean;
  reportCompletionFunc: null | ((stats: CompletionStats) => void);
  reportProgressFunc: null | ((percentageDone: number) => void);
  reportProgressFuncFrom: number;
  reportProgressFuncTo: number;
}

export interface InputOpts {
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

const canonicalDefaults: Opts = {
  arrayVsArrayAllMustBeFound: "any",
  caseSensitive: true,
  reportCompletionFunc: null,
  reportProgressFunc: null,
  reportProgressFuncFrom: 0,
  reportProgressFuncTo: 100,
};

const defaults: Readonly<Opts> = Object.freeze({ ...canonicalDefaults });

interface PreparedPredicate {
  matches: (input: string) => boolean;
  negative: boolean;
}

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
function includesWithGlob(
  input: string | readonly unknown[],
  findThis: string | readonly string[],
  opts?: InputOpts | null,
): boolean {
  if (typeof input !== "string" && !Array.isArray(input)) {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_01] The first argument must be a string or an array; received ${formatDiagnosticValue(input, 4)}.`,
    );
  }
  if (typeof findThis !== "string" && !Array.isArray(findThis)) {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_02] The second argument must be a string or an array of strings; received ${formatDiagnosticValue(findThis, 4)}.`,
    );
  }
  if (opts != null && (typeof opts !== "object" || Array.isArray(opts))) {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_03] The third argument must be an options object, null, or undefined; received ${formatDiagnosticValue(opts, 4)}.`,
    );
  }

  const arrayVsArrayAllMustBeFound =
    opts?.arrayVsArrayAllMustBeFound ??
    canonicalDefaults.arrayVsArrayAllMustBeFound;
  if (
    arrayVsArrayAllMustBeFound !== "any" &&
    arrayVsArrayAllMustBeFound !== "all"
  ) {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_04] opts.arrayVsArrayAllMustBeFound must be "any", "all", null, or undefined; received ${formatDiagnosticValue(arrayVsArrayAllMustBeFound, 4)}.`,
    );
  }

  const caseSensitive = opts?.caseSensitive ?? canonicalDefaults.caseSensitive;
  if (typeof caseSensitive !== "boolean") {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_05] opts.caseSensitive must be a Boolean, null, or undefined; received ${formatDiagnosticValue(caseSensitive, 4)}.`,
    );
  }

  const reportProgressFunc =
    opts?.reportProgressFunc ?? canonicalDefaults.reportProgressFunc;
  if (reportProgressFunc !== null && typeof reportProgressFunc !== "function") {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_06] opts.reportProgressFunc must be a function, null, or undefined; received ${formatDiagnosticValue(reportProgressFunc, 4)}.`,
    );
  }

  const reportProgressFuncFrom =
    opts?.reportProgressFuncFrom ?? canonicalDefaults.reportProgressFuncFrom;
  if (!Number.isFinite(reportProgressFuncFrom)) {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_07] opts.reportProgressFuncFrom must be a finite number, null, or undefined; received ${formatDiagnosticValue(reportProgressFuncFrom, 4)}.`,
    );
  }

  const reportProgressFuncTo =
    opts?.reportProgressFuncTo ?? canonicalDefaults.reportProgressFuncTo;
  if (!Number.isFinite(reportProgressFuncTo)) {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_08] opts.reportProgressFuncTo must be a finite number, null, or undefined; received ${formatDiagnosticValue(reportProgressFuncTo, 4)}.`,
    );
  }
  if (reportProgressFuncFrom > reportProgressFuncTo) {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_09] opts.reportProgressFuncFrom cannot exceed opts.reportProgressFuncTo; received ${reportProgressFuncFrom} and ${reportProgressFuncTo}.`,
    );
  }

  const reportCompletionFunc =
    opts?.reportCompletionFunc ?? canonicalDefaults.reportCompletionFunc;
  if (
    reportCompletionFunc !== null &&
    typeof reportCompletionFunc !== "function"
  ) {
    throw new TypeError(
      `array-includes-with-glob/includesWithGlob(): [THROW_ID_10] opts.reportCompletionFunc must be a function, null, or undefined; received ${formatDiagnosticValue(reportCompletionFunc, 4)}.`,
    );
  }

  const rawPatterns =
    typeof findThis === "string" ? [findThis] : Array.from(findThis);
  for (const pattern of rawPatterns) {
    if (typeof pattern !== "string") {
      throw new TypeError(
        `array-includes-with-glob/includesWithGlob(): [THROW_ID_11] The second argument's array must contain only strings and no holes; received ${formatDiagnosticValue(pattern, 4)}.`,
      );
    }
  }

  const startedAt = reportCompletionFunc ? Date.now() : 0;
  const sourceLength = typeof input === "string" ? 1 : input.length;
  let lastProgress: number | undefined;
  let patternComparisons = 0;
  let sourceItemsVisited = 0;

  function reportProgress(value: number): void {
    if (reportProgressFunc && value !== lastProgress) {
      lastProgress = value;
      reportProgressFunc(value);
    }
  }

  function finish(result: boolean): boolean {
    reportProgress(reportProgressFuncTo);
    reportCompletionFunc?.({
      patternComparisons,
      sourceItemsVisited,
      timeTakenInMilliseconds: Date.now() - startedAt,
    });
    return result;
  }

  reportProgress(reportProgressFuncFrom);

  const uniquePatterns = Array.from(new Set(rawPatterns));
  if (sourceLength === 0 || uniquePatterns.length === 0) {
    return finish(false);
  }

  const matchOptions = { caseSensitiveMatch: caseSensitive };
  const preparedPatterns: PreparedPredicate[] = uniquePatterns.map(
    (pattern) => ({
      matches: createMatcher(pattern, matchOptions),
      negative: pattern.charCodeAt(0) === 33,
    }),
  );
  const negativePatterns = preparedPatterns.filter(
    (pattern) => pattern.negative,
  );
  const positivePatterns = preparedPatterns.filter(
    (pattern) => !pattern.negative,
  );
  const foundPositivePatterns = new Uint8Array(positivePatterns.length);
  let positivePatternsRemaining = positivePatterns.length;

  for (let sourceIndex = 0; sourceIndex < sourceLength; sourceIndex++) {
    const sourceValue = typeof input === "string" ? input : input[sourceIndex];
    sourceItemsVisited++;

    if (typeof sourceValue === "string") {
      let allowed = true;

      for (const pattern of negativePatterns) {
        patternComparisons++;
        if (!pattern.matches(sourceValue)) {
          allowed = false;
          break;
        }
      }

      if (allowed) {
        if (positivePatterns.length === 0) {
          return finish(true);
        }

        if (arrayVsArrayAllMustBeFound === "any") {
          for (const pattern of positivePatterns) {
            patternComparisons++;
            if (pattern.matches(sourceValue)) {
              return finish(true);
            }
          }
        } else {
          for (
            let patternIndex = 0;
            patternIndex < positivePatterns.length;
            patternIndex++
          ) {
            if (!foundPositivePatterns[patternIndex]) {
              patternComparisons++;
              if (positivePatterns[patternIndex].matches(sourceValue)) {
                foundPositivePatterns[patternIndex] = 1;
                positivePatternsRemaining--;
              }
            }
          }
          if (positivePatternsRemaining === 0) {
            return finish(true);
          }
        }
      }
    }

    reportProgress(
      reportProgressFuncFrom +
        Math.floor(
          ((sourceIndex + 1) / sourceLength) *
            (reportProgressFuncTo - reportProgressFuncFrom),
        ),
    );
  }

  return finish(false);
}

export { defaults, includesWithGlob, version };
