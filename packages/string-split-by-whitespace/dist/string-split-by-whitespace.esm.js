/**
 * string-split-by-whitespace
 * Split string into array by chunks of whitespace
 * Version: 1.7.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/string-split-by-whitespace/
 */

import within from 'ranges-is-index-within';

function split(str, originalOpts) {
  if (str === undefined) {
    throw new Error(
      "string-split-by-whitespace: [THROW_ID_01] The input is missing!"
    );
  }
  if (typeof str !== "string") {
    return str;
  }
  if (str.trim() === "") {
    return [];
  }
  const defaults = {
    ignoreRanges: [],
  };
  const opts = { ...defaults, ...originalOpts };
  if (
    opts.ignoreRanges.length > 0 &&
    !opts.ignoreRanges.every((arr) => Array.isArray(arr))
  ) {
    throw new Error(
      "string-split-by-whitespace: [THROW_ID_03] The opts.ignoreRanges contains elements which are not arrays!"
    );
  }
  let nonWhitespaceSubStringStartsAt = null;
  const res = [];
  for (let i = 0, len = str.length; i < len; i++) {
    if (
      nonWhitespaceSubStringStartsAt === null &&
      str[i].trim() &&
      (!opts.ignoreRanges.length ||
        (opts.ignoreRanges.length &&
          !within(
            i,
            opts.ignoreRanges.map((arr) => [arr[0], arr[1] - 1]),
            {
              inclusiveRangeEnds: true,
            }
          )))
    ) {
      nonWhitespaceSubStringStartsAt = i;
    }
    if (nonWhitespaceSubStringStartsAt !== null) {
      if (!str[i].trim()) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i));
        nonWhitespaceSubStringStartsAt = null;
      } else if (opts.ignoreRanges.length && within(i, opts.ignoreRanges)) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i - 1));
        nonWhitespaceSubStringStartsAt = null;
      } else if (str[i + 1] === undefined) {
        res.push(str.slice(nonWhitespaceSubStringStartsAt, i + 1));
      }
    }
  }
  return res;
}

export default split;
