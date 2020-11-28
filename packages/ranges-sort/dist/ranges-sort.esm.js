/**
 * ranges-sort
 * Sort string index ranges
 * Version: 3.14.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-sort/
 */

function rangesSort(arrOfRanges, originalOptions) {
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return arrOfRanges;
  }
  const defaults = {
    strictlyTwoElementsInRangeArrays: false,
    progressFn: null,
  };
  const opts = { ...defaults, ...originalOptions };
  let culpritsIndex;
  let culpritsLen;
  if (
    opts.strictlyTwoElementsInRangeArrays &&
    !arrOfRanges
      .filter((range) => range)
      .every((rangeArr, indx) => {
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
    !arrOfRanges
      .filter((range) => range)
      .every((rangeArr, indx) => {
        if (
          !Number.isInteger(rangeArr[0]) ||
          rangeArr[0] < 0 ||
          !Number.isInteger(rangeArr[1]) ||
          rangeArr[1] < 0
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
  const maxPossibleIterations =
    arrOfRanges.filter((range) => range).length ** 2;
  let counter = 0;
  return Array.from(arrOfRanges)
    .filter((range) => range)
    .sort((range1, range2) => {
      if (opts.progressFn) {
        counter += 1;
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
