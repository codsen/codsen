/**
 * str-indexes-of-plus
 * Search for a string in another string. Get array of indexes. Full Unicode support.
 * Version: 2.9.48
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/str-indexes-of-plus
 */

import toArr from 'lodash.toarray';
import isInt from 'is-natural-number';
import isNumStr from 'is-natural-number-string';

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function strIndexesOfPlus(str, searchValue, fromIndex) {
  if (arguments.length === 0) {
    throw new Error("str-indexes-of-plus/strIndexesOfPlus(): inputs missing!");
  }
  if (!isStr(str)) {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): first input argument must be a string! Currently it's: ${typeof str}`
    );
  }
  if (!isStr(searchValue)) {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): second input argument must be a string! Currently it's: ${typeof searchValue}`
    );
  }
  if (
    arguments.length >= 3 &&
    !isInt(fromIndex, { includeZero: true }) &&
    !isNumStr(fromIndex, { includeZero: true })
  ) {
    throw new TypeError(
      `str-indexes-of-plus/strIndexesOfPlus(): third input argument must be a natural number! Currently it's: ${fromIndex}`
    );
  }
  if (isNumStr(fromIndex, { includeZero: true })) {
    fromIndex = Number(fromIndex);
  }
  const strArr = toArr(str);
  const searchValueArr = toArr(searchValue);
  if (
    strArr.length === 0 ||
    searchValueArr.length === 0 ||
    (existy(fromIndex) && fromIndex >= strArr.length)
  ) {
    return [];
  }
  if (!existy(fromIndex)) {
    fromIndex = 0;
  }
  const res = [];
  let matchMode = false;
  let potentialFinding;
  for (let i = fromIndex, len = strArr.length; i < len; i++) {
    if (matchMode) {
      if (strArr[i] === searchValueArr[i - potentialFinding]) {
        if (i - potentialFinding + 1 === searchValueArr.length) {
          res.push(potentialFinding);
        }
      } else {
        potentialFinding = null;
        matchMode = false;
      }
    }
    if (!matchMode) {
      if (strArr[i] === searchValueArr[0]) {
        if (searchValueArr.length === 1) {
          res.push(i);
        } else {
          matchMode = true;
          potentialFinding = i;
        }
      }
    }
  }
  return res;
}

export default strIndexesOfPlus;
