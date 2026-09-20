import type { Range } from "../../../ops/typedefs/common";
import { version as v } from "../package.json";

const version: string = v;

export interface Opts {
  ignoreRanges: Range[];
}
const defaults: Opts = {
  ignoreRanges: [],
};

function splitByW(str: string, opts?: Partial<Opts>): string[] {
  if (str === undefined) {
    throw new Error(
      "string-split-by-whitespace/splitByW(): [THROW_ID_01] The input is missing!",
    );
  }
  if (typeof str !== "string") {
    return str;
  }
  let trimmed = str.trim();
  if (!trimmed) {
    return [];
  }
  let ignoreRanges = opts?.ignoreRanges;
  if (ignoreRanges === undefined) {
    ignoreRanges = defaults.ignoreRanges;
  }
  if (ignoreRanges.length && !ignoreRanges.every((arr) => Array.isArray(arr))) {
    throw new Error(
      "string-split-by-whitespace/splitByW(): [THROW_ID_02] The resolvedOpts.ignoreRanges contains elements which are not arrays!",
    );
  }
  if (!ignoreRanges.length) {
    return trimmed.split(/\s+/);
  }

  // Sort a local list; callers keep ownership of both the list and its tuples.
  // Empty/reversed spans cover no index. Overlapping spans are consumed by
  // the same forward cursor without revisiting earlier ranges.
  let ranges = ignoreRanges
    .filter(([from, to]) => from < to)
    .sort((a, b) => a[0] - b[0]);
  let rangeIndex = 0;
  let tokenStart: number | null = null;
  let res: string[] = [];
  for (let i = 0; i < str.length; ) {
    while (rangeIndex < ranges.length && ranges[rangeIndex][1] <= i) {
      rangeIndex += 1;
    }
    if (rangeIndex < ranges.length && ranges[rangeIndex][0] <= i) {
      if (tokenStart !== null) {
        res.push(str.slice(tokenStart, i));
        tokenStart = null;
      }
      i = Math.min(str.length, ranges[rangeIndex][1]);
      rangeIndex += 1;
      continue;
    }
    if (str[i].trim()) {
      if (tokenStart === null) {
        tokenStart = i;
      }
    } else if (tokenStart !== null) {
      res.push(str.slice(tokenStart, i));
      tokenStart = null;
    }
    i += 1;
  }
  if (tokenStart !== null) {
    res.push(str.slice(tokenStart));
  }
  return res;
}

export { defaults, type Range, splitByW, version };
