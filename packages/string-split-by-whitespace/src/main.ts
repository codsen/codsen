import { isIndexWithin } from "ranges-is-index-within";

import { version as v } from "../package.json";
import { Range } from "../../../ops/typedefs/common";

const version: string = v;

interface Opts {
  ignoreRanges: Range[];
}
const defaults: Opts = {
  ignoreRanges: [],
};

function splitByW(str: string, originalOpts?: Partial<Opts>): string[] {
  if (str === undefined) {
    throw new Error(
      "string-split-by-whitespace: [THROW_ID_01] The input is missing!"
    );
  }
  if (typeof str !== "string") {
    return str;
  }
  // early ending:
  if (str.trim() === "") {
    return [];
  }
  let opts: Opts = { ...defaults, ...originalOpts };
  if (
    opts.ignoreRanges.length > 0 &&
    !opts.ignoreRanges.every((arr) => Array.isArray(arr))
  ) {
    throw new Error(
      "string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!"
    );
  }

  // if reached this far, traverse and slice accordingly
  let nonWhitespaceSubStringStartsAt = null;
  let res = [];
  for (let i = 0, len = str.length; i < len; i++) {
    // catch the first non-whitespace character
    if (
      nonWhitespaceSubStringStartsAt === null &&
      str[i].trim() &&
      (!opts ||
        !opts.ignoreRanges ||
        !opts.ignoreRanges.length ||
        (opts.ignoreRanges.length &&
          !isIndexWithin(
            i,
            opts.ignoreRanges.map((arr) => [arr[0], arr[1] - 1]),
            {
              inclusiveRangeEnds: true,
            }
          )))
    ) {
      nonWhitespaceSubStringStartsAt = i;
    }
    // catch the first whitespace char when recording substring
    if (nonWhitespaceSubStringStartsAt !== null) {
      if (!str[i].trim()) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
        nonWhitespaceSubStringStartsAt = null;
      } else if (
        opts.ignoreRanges.length &&
        isIndexWithin(i, opts.ignoreRanges)
      ) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i - 1));
        nonWhitespaceSubStringStartsAt = null;
      } else if (str[i + 1] === undefined) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
      }
    }
  }
  return res;
}

export { splitByW, defaults, version };
