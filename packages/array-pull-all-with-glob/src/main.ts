import { match } from "codsen-utils";

import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  caseSensitive: boolean;
}

// Matching is case-sensitive by default.
const defaults: Opts = {
  caseSensitive: true,
};

// codsen-utils keeps 256 compiled scalar patterns. A source-major traversal
// above that boundary evicts the next pattern before it can be reused.
const matcherCacheCapacity = 256;

function pullPatternMajor(
  source: string[],
  toBeRemoved: string[],
  caseSensitive: boolean,
): string[] {
  const removed = new Uint8Array(source.length);
  const matchOptions = { caseSensitiveMatch: caseSensitive };
  let removedCount = 0;

  for (const remVal of toBeRemoved) {
    for (let index = 0; index < source.length; index++) {
      if (!removed[index] && match(source[index], remVal, matchOptions)) {
        removed[index] = 1;
        removedCount++;
      }
    }
    if (removedCount === source.length) {
      return [];
    }
  }

  return source.filter((_value, index) => !removed[index]);
}

/**
 * Return a new array without values that match any removal pattern.
 *
 * Patterns match the whole value. `*` matches zero or more Unicode code
 * points, including directory separators and line breaks; consecutive stars
 * are equivalent to one. A backslash escapes the character after it, so `\*`
 * matches a literal asterisk and `\\` matches a literal backslash. A leading
 * `!` negates that one pattern. Every removal pattern is evaluated separately,
 * and a value is removed when any resulting predicate is true. Negative
 * patterns therefore do not veto positive patterns in the same array.
 *
 * All other characters, including `?`, brackets, braces, and extglob-like
 * punctuation, are literals. To match a literal leading `!`, escape it as
 * `\!`. Case-insensitive matching uses one-code-point uppercase comparisons;
 * it is not locale-aware and does not apply multi-code-point case folding.
 *
 * @param strArr source values; this array is not mutated
 * @param toBeRemoved one removal pattern or an array of patterns; arrays are
 * not mutated
 * @param opts matching options
 * @returns a new array containing the values that no pattern removed
 * @example
 * pull(["keep.js", "remove.js", "file*"], ["remove*", "file\\*"]);
 * // => ["keep.js"]
 */
function pull(
  strArr: readonly string[],
  toBeRemoved: string | readonly string[],
  opts?: Partial<Opts> | null,
): string[] {
  // insurance
  if (!strArr.length) {
    return [];
  }
  const resolvedToBeRemoved: string[] =
    typeof toBeRemoved === "string"
      ? toBeRemoved
        ? [toBeRemoved]
        : []
      : toBeRemoved.filter(Boolean);
  if (!resolvedToBeRemoved.length) {
    return Array.from(strArr);
  }
  const resolvedOpts: Opts = {
    caseSensitive: opts?.caseSensitive ?? defaults.caseSensitive,
  };

  if (
    strArr.length > 1 &&
    resolvedToBeRemoved.length > matcherCacheCapacity
  ) {
    return pullPatternMajor(
      Array.from(strArr),
      resolvedToBeRemoved,
      resolvedOpts.caseSensitive,
    );
  }

  const res = Array.from(strArr).filter(
    (originalVal) =>
      !resolvedToBeRemoved.some((remVal) =>
        match(originalVal, remVal, {
          caseSensitiveMatch: resolvedOpts.caseSensitive,
        }),
      ),
  );
  return res;
}

export { defaults, pull, version };
