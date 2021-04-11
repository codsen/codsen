/**
 * @name ranges-invert
 * @fileoverview Invert string index ranges
 * @version 4.0.15
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-invert/}
 */

import { rMerge } from 'ranges-merge';
import { rCrop } from 'ranges-crop';

var version$1 = "4.0.15";

const version = version$1;
function rInvert(arrOfRanges, strLen, originalOptions) {
  if (!Array.isArray(arrOfRanges) && arrOfRanges !== null) {
    throw new TypeError(`ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(arrOfRanges, null, 4)}`);
  }
  if (!Number.isInteger(strLen) || strLen < 0) {
    throw new TypeError(`ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(strLen, null, 4)}`);
  }
  if (Array.isArray(arrOfRanges) && typeof arrOfRanges[0] === "number" && typeof arrOfRanges[1] === "number") {
    throw new TypeError(`ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(arrOfRanges, null, 0)}!`);
  }
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.filter(range => Array.isArray(range) && range[0] !== range[1]).length || !strLen) {
    if (!strLen) {
      return null;
    }
    return [[0, strLen]];
  }
  const defaults = {
    strictlyTwoElementsInRangeArrays: false,
    skipChecks: false
  };
  const opts = { ...defaults,
    ...originalOptions
  };
  let culpritsIndex = 0;
  let culpritsLen;
  if (!opts.skipChecks && opts.strictlyTwoElementsInRangeArrays && !arrOfRanges.filter(range => range).every((rangeArr, indx) => {
    if (rangeArr.length !== 2) {
      culpritsIndex = indx;
      culpritsLen = rangeArr.length;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ${culpritsIndex}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) has not two but ${culpritsLen} elements!`);
  }
  if (!opts.skipChecks && !arrOfRanges.every((rangeArr, indx) => {
    if (!Number.isInteger(rangeArr[0]) || rangeArr[0] < 0 || !Number.isInteger(rangeArr[1]) || rangeArr[1] < 0) {
      culpritsIndex = indx;
      return false;
    }
    return true;
  })) {
    throw new TypeError(`ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex + 1}th range (${JSON.stringify(arrOfRanges[culpritsIndex], null, 0)}) does not consist of only natural numbers!`);
  }
  let prep;
  if (!opts.skipChecks) {
    prep = rMerge(arrOfRanges.filter(rangeArr => rangeArr[0] !== rangeArr[1]));
  } else {
    prep = arrOfRanges.filter(rangeArr => rangeArr[0] !== rangeArr[1]);
  }
  const res = prep.reduce((accum, currArr, i, arr) => {
    const res2 = [];
    if (i === 0 && arr[0][0] !== 0) {
      res2.push([0, arr[0][0]]);
    }
    const endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;
    if (currArr[1] !== endingIndex) {
      if (opts.skipChecks && currArr[1] > endingIndex) {
        throw new TypeError(`ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [${currArr[1]}, ${endingIndex}] which is backwards. For investigation, whole ranges array is:\n${JSON.stringify(arr, null, 0)}`);
      }
      res2.push([currArr[1], endingIndex]);
    }
    return accum.concat(res2);
  }, []);
  return rCrop(res, strLen);
}

export { rInvert, version };
