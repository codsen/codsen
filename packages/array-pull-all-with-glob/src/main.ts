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
 * @param toBeRemoved one removal pattern or an array of patterns
 * @param opts matching options
 * @returns a new array containing the values that no pattern removed
 * @example
 * pull(["keep.js", "remove.js", "file*"], ["remove*", "file\\*"]);
 * // => ["keep.js"]
 */
function pull(
  strArr: string[],
  toBeRemoved: string | string[],
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
