/**
 * ranges-invert
 * Invert string index ranges [ [1, 3] ] => [ [0, 1], [3, ...] ]
 * Version: 2.1.27
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-invert
 */

import isNatNum from 'is-natural-number';
import mergeRanges from 'ranges-merge';
import rangesCrop from 'ranges-crop';

const isArr = Array.isArray;
function rangesInvert(arrOfRanges, strLen, originalOptions) {
  if (!isArr(arrOfRanges) && arrOfRanges !== null) {
    throw new TypeError(
      `ranges-invert: [THROW_ID_01] Input's first argument must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(
        arrOfRanges,
        null,
        4
      )}`
    );
  }
  if (!isNatNum(strLen, { includeZero: true })) {
    throw new TypeError(
      `ranges-invert: [THROW_ID_02] Input's second argument must be a natural number or zero (coming from String.length)! Currently its type is: ${typeof strLen}, equal to: ${JSON.stringify(
        strLen,
        null,
        4
      )}`
    );
  }
  if (arrOfRanges === null) {
    if (strLen === 0) {
      return [];
    }
    return [[0, strLen]];
  } else if (arrOfRanges.length === 0) {
    return [];
  }
  const defaults = {
    strictlyTwoElementsInRangeArrays: false,
    skipChecks: false
  };
  const opts = Object.assign({}, defaults, originalOptions);
  let culpritsIndex;
  let culpritsLen;
  if (
    !opts.skipChecks &&
    opts.strictlyTwoElementsInRangeArrays &&
    !arrOfRanges.every((rangeArr, indx) => {
      if (rangeArr.length !== 2) {
        culpritsIndex = indx;
        culpritsLen = rangeArr.length;
        return false;
      }
      return true;
    })
  ) {
    throw new TypeError(
      `ranges-invert: [THROW_ID_04] Because opts.strictlyTwoElementsInRangeArrays was enabled, all ranges must be strictly two-element-long. However, the ${culpritsIndex}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        0
      )}) has not two but ${culpritsLen} elements!`
    );
  }
  if (
    !opts.skipChecks &&
    !arrOfRanges.every((rangeArr, indx) => {
      if (
        !isNatNum(rangeArr[0], { includeZero: true }) ||
        !isNatNum(rangeArr[1], { includeZero: true })
      ) {
        culpritsIndex = indx;
        return false;
      }
      return true;
    })
  ) {
    if (
      Array.isArray(arrOfRanges) &&
      typeof arrOfRanges[0] === "number" &&
      typeof arrOfRanges[1] === "number"
    ) {
      throw new TypeError(
        `ranges-invert: [THROW_ID_07] The first argument should be AN ARRAY OF RANGES, not a single range! Currently arrOfRanges = ${JSON.stringify(
          arrOfRanges,
          null,
          0
        )}!`
      );
    }
    throw new TypeError(
      `ranges-invert: [THROW_ID_05] The first argument should be AN ARRAY OF ARRAYS! Each sub-array means string slice indexes. In our case, here ${culpritsIndex +
        1}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        0
      )}) does not consist of only natural numbers!`
    );
  }
  let prep;
  if (!opts.skipChecks) {
    prep = mergeRanges(
      arrOfRanges.filter(rangeArr => rangeArr[0] !== rangeArr[1])
    );
  } else {
    prep = arrOfRanges.filter(rangeArr => rangeArr[0] !== rangeArr[1]);
  }
  if (prep.length === 0) {
    if (strLen === 0) {
      return [];
    }
    return [[0, strLen]];
  }
  const res = prep.reduce((accum, currArr, i, arr) => {
    const res = [];
    if (i === 0 && arr[0][0] !== 0) {
      res.push([0, arr[0][0]]);
    }
    const endingIndex = i < arr.length - 1 ? arr[i + 1][0] : strLen;
    if (currArr[1] !== endingIndex) {
      if (opts.skipChecks && currArr[1] > endingIndex) {
        throw new TypeError(
          `ranges-invert: [THROW_ID_08] The checking (opts.skipChecks) is off and input ranges were not sorted! We nearly wrote range [${
            currArr[1]
          }, ${endingIndex}] which is backwards. For investigation, whole ranges array is:\n${JSON.stringify(
            arr,
            null,
            0
          )}`
        );
      }
      res.push([currArr[1], endingIndex]);
    }
    return accum.concat(res);
  }, []);
  return rangesCrop(res, strLen);
}

export default rangesInvert;
