/**
 * @name ranges-is-index-within
 * @fileoverview Checks if index is within any of the given string index ranges
 * @version 2.0.13
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-is-index-within/}
 */

var version$1 = "2.0.13";

const version = version$1;
const defaults = {
  inclusiveRangeEnds: false,
  returnMatchedRangeInsteadOfTrue: false
};
function isIndexWithin(originalIndex, rangesArr, originalOpts) {
  const opts = { ...defaults,
    ...originalOpts
  };
  if (!Number.isInteger(originalIndex)) {
    throw new Error(`ranges-is-index-within: [THROW_ID_01] the first input argument should be string index, a natural number (or zero). It was given as ${originalIndex} (type ${typeof originalIndex})`);
  }
  if (!Array.isArray(rangesArr)) {
    return false;
  }
  if (opts.returnMatchedRangeInsteadOfTrue) {
    return rangesArr.find(arr => opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1]) || false;
  }
  return rangesArr.some(arr => opts.inclusiveRangeEnds ? originalIndex >= arr[0] && originalIndex <= arr[1] : originalIndex > arr[0] && originalIndex < arr[1]);
}

export { defaults, isIndexWithin, version };
