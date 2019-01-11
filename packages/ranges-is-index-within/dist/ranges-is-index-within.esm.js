/**
 * ranges-is-index-within
 * Efficiently checks if index is within any of the given ranges
 * Version: 1.12.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-is-index-within
 */

import isObj from 'lodash.isplainobject';
import checkTypes from 'check-types-mini';
import isNatStr from 'is-natural-number-string';
import isNatNum from 'is-natural-number';
import ordinalSuffix from 'ordinal-number-suffix';
import rangesSort from 'ranges-sort';

const isArr = Array.isArray;
function rangesIsIndexWithin(originalIndex, rangesArr, originalOpts) {
  function existy(x) {
    return x != null;
  }
  let index;
  if (rangesArr === null) {
    return false;
  }
  if (isNatNum(originalIndex, { includeZero: true })) {
    index = originalIndex;
  } else if (isNatStr(originalIndex, { includeZero: true })) {
    index = parseInt(originalIndex, 10);
  } else {
    throw new TypeError(
      `ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_01] Input must mean an index, so it has to be either a natural number or a string containing natural number! Currently its type is: ${typeof originalIndex}, equal to: ${JSON.stringify(
        originalIndex,
        null,
        4
      )}`
    );
  }
  if (!existy(rangesArr)) {
    throw new TypeError(
      "ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_02] We're missing the second input, rangesArr. It's meant to be an array of one or more range arrays."
    );
  } else if (!isArr(rangesArr)) {
    throw new TypeError(
      `ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_03] Second input argument, rangesArr must be an array! Currently its type is: ${typeof originalIndex}, equal to: ${JSON.stringify(
        originalIndex,
        null,
        4
      )}`
    );
  } else if (rangesArr.length === 0) {
    throw new TypeError(
      "ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_04] Second input argument, rangesArr must be not empty! Currently it's empty."
    );
  }
  let culpritsIndex = null;
  if (isArr(rangesArr) && rangesArr.length > 0 && !isArr(rangesArr[0])) {
    throw new TypeError(
      `ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_05] Second input argument, rangesArr must be an array of (index range) arrays! Currently it's equal to: ${rangesArr}.`
    );
  }
  if (
    !rangesArr.every((rangeArr, indx) => {
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
      `ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_06] Second input argument, rangesArr must consist of arrays which are natural number indexes representing string index ranges. However, ${ordinalSuffix(
        culpritsIndex
      )} range (${JSON.stringify(
        rangesArr[culpritsIndex],
        null,
        4
      )}) does not consist of only natural numbers!`
    );
  }
  if (
    !rangesArr.every((rangeArr, indx) => {
      if (rangeArr[0] > rangeArr[1]) {
        culpritsIndex = indx;
        return false;
      }
      return true;
    })
  ) {
    throw new TypeError(
      `ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_07] The ${ordinalSuffix(
        culpritsIndex
      )} range (${JSON.stringify(
        rangesArr[culpritsIndex],
        null,
        4
      )}) in the ranges array has beginning of the index bigger than ending! They can be equal but in the backwards order.`
    );
  }
  if (existy(originalOpts) && !isObj(originalOpts)) {
    throw new TypeError(
      `ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_08] Options object must be a plain object! Currently its type is: ${typeof originalOpts}, equal to: ${JSON.stringify(
        originalOpts,
        null,
        4
      )}`
    );
  }
  const defaults = {
    inclusiveRangeEnds: false,
    returnMatchedRangeInsteadOfTrue: false,
    skipIncomingRangeSorting: false
  };
  const opts = Object.assign(Object.assign({}, defaults), originalOpts);
  checkTypes(opts, defaults, {
    msg: "ranges-is-index-within/rangesIsIndexWithin(): [THROW_ID_07*]"
  });
  if (rangesArr.length < 3) {
    if (rangesArr.length === 1) {
      let res;
      if (opts.inclusiveRangeEnds) {
        res = index >= rangesArr[0][0] && index <= rangesArr[0][1];
      } else {
        res = index > rangesArr[0][0] && index < rangesArr[0][1];
      }
      if (opts.returnMatchedRangeInsteadOfTrue && res) {
        return rangesArr[0];
      }
      return res;
    }
    let res1;
    let res2;
    if (opts.inclusiveRangeEnds) {
      res1 = index >= rangesArr[0][0] && index <= rangesArr[0][1];
      res2 = index >= rangesArr[1][0] && index <= rangesArr[1][1];
    } else {
      res1 = index > rangesArr[0][0] && index < rangesArr[0][1];
      res2 = index > rangesArr[1][0] && index < rangesArr[1][1];
    }
    if (opts.returnMatchedRangeInsteadOfTrue && (res1 || res2)) {
      return res1 ? rangesArr[0] : rangesArr[1];
    }
    return res1 || res2;
  }
  const rarr = opts.skipIncomingRangeSorting
    ? rangesArr
    : rangesSort(rangesArr);
  if (index < rarr[0][0] || index > rarr[rarr.length - 1][1]) {
    return false;
  } else if (index === rarr[0][0]) {
    if (opts.inclusiveRangeEnds) {
      if (opts.returnMatchedRangeInsteadOfTrue) {
        return rarr[0];
      }
      return true;
    }
    return false;
  } else if (index === rarr[rarr.length - 1][1]) {
    if (opts.inclusiveRangeEnds) {
      if (opts.returnMatchedRangeInsteadOfTrue) {
        return rarr[rarr.length - 1];
      }
      return true;
    }
    return false;
  }
  let lowerIndex = 0;
  let upperIndex = rarr.length - 1;
  let theIndexOfTheRangeInTheMiddle = Math.floor((upperIndex + lowerIndex) / 2);
  while (
    Math.floor(upperIndex - lowerIndex) > 1 &&
    theIndexOfTheRangeInTheMiddle !== 0
  ) {
    theIndexOfTheRangeInTheMiddle = Math.floor((upperIndex + lowerIndex) / 2);
    if (index < rarr[theIndexOfTheRangeInTheMiddle][0]) {
      upperIndex = theIndexOfTheRangeInTheMiddle;
    } else if (index > rarr[theIndexOfTheRangeInTheMiddle][1]) {
      lowerIndex = theIndexOfTheRangeInTheMiddle;
    } else if (
      index === rarr[theIndexOfTheRangeInTheMiddle][0] ||
      index === rarr[theIndexOfTheRangeInTheMiddle][1]
    ) {
      if (opts.inclusiveRangeEnds) {
        if (opts.returnMatchedRangeInsteadOfTrue) {
          return rarr[theIndexOfTheRangeInTheMiddle];
        }
        return true;
      }
      return false;
    } else {
      if (opts.returnMatchedRangeInsteadOfTrue) {
        return rarr[theIndexOfTheRangeInTheMiddle];
      }
      return true;
    }
  }
  let res1;
  let res2;
  if (opts.inclusiveRangeEnds) {
    res1 =
      index >= rangesArr[lowerIndex][0] && index <= rangesArr[lowerIndex][1];
    res2 =
      index >= rangesArr[upperIndex][0] && index <= rangesArr[upperIndex][1];
  } else {
    res1 = index > rangesArr[lowerIndex][0] && index < rangesArr[lowerIndex][1];
    res2 = index > rangesArr[upperIndex][0] && index < rangesArr[upperIndex][1];
  }
  if (opts.returnMatchedRangeInsteadOfTrue && (res1 || res2)) {
    return res1 ? rangesArr[lowerIndex] : rangesArr[upperIndex];
  }
  return res1 || res2;
}

export default rangesIsIndexWithin;
