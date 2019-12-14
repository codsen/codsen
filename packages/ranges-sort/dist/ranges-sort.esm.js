/**
 * ranges-sort
 * Sort natural number index ranges [ [5, 6], [1, 3] ] => [ [1, 3], [5, 6] ]
 * Version: 3.10.46
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-sort
 */

import isNatNum from 'is-natural-number';

const isArr = Array.isArray;
function rangesSort(arrOfRanges, originalOptions) {
  if (!isArr(arrOfRanges)) {
    throw new TypeError(
      `ranges-sort: [THROW_ID_01] Input must be an array, consisting of range arrays! Currently its type is: ${typeof arrOfRanges}, equal to: ${JSON.stringify(
        arrOfRanges,
        null,
        4
      )}`
    );
  }
  if (arrOfRanges.length === 0) {
    return arrOfRanges;
  }
  const defaults = {
    strictlyTwoElementsInRangeArrays: false,
    progressFn: null
  };
  const opts = Object.assign({}, defaults, originalOptions);
  let culpritsIndex;
  let culpritsLen;
  if (
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
      `ranges-sort: [THROW_ID_03] The first argument should be an array and must consist of arrays which are natural number indexes representing TWO string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        4
      )}) has not two but ${culpritsLen} elements!`
    );
  }
  if (
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
    throw new TypeError(
      `ranges-sort: [THROW_ID_04] The first argument should be an array and must consist of arrays which are natural number indexes representing string index ranges. However, ${culpritsIndex}th range (${JSON.stringify(
        arrOfRanges[culpritsIndex],
        null,
        4
      )}) does not consist of only natural numbers!`
    );
  }
  const maxPossibleIterations = arrOfRanges.length * arrOfRanges.length;
  let counter = 0;
  return Array.from(arrOfRanges).sort((range1, range2) => {
    if (opts.progressFn) {
      counter++;
      opts.progressFn(Math.floor((counter * 100) / maxPossibleIterations));
    }
    if (range1[0] === range2[0]) {
      if (range1[1] < range2[1]) {
        return -1;
      }
      if (range1[1] > range2[1]) {
        return 1;
      }
      return 0;
    }
    if (range1[0] < range2[0]) {
      return -1;
    }
    return 1;
  });
}

export default rangesSort;
