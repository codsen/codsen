/**
 * ranges-apply
 * Take an array of string slice ranges, delete/replace the string according to them
 * Version: 3.0.48
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply
 */

import isNumStr from 'is-natural-number-string';
import rangesMerge from 'ranges-merge';

const isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function rangesApply(str, rangesArr, progressFn) {
  let percentageDone = 0;
  let lastPercentageDone = 0;
  if (arguments.length === 0) {
    throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
  }
  if (!isStr(str)) {
    throw new TypeError(
      `ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ${typeof str}, equal to: ${JSON.stringify(
        str,
        null,
        4
      )}`
    );
  }
  if (rangesArr === null) {
    return str;
  } else if (!isArr(rangesArr)) {
    throw new TypeError(
      `ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof rangesArr}, equal to: ${JSON.stringify(
        rangesArr,
        null,
        4
      )}`
    );
  }
  if (progressFn && typeof progressFn !== "function") {
    throw new TypeError(
      `ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ${typeof progressFn}, equal to: ${JSON.stringify(
        progressFn,
        null,
        4
      )}`
    );
  }
  if (
    isArr(rangesArr) &&
    (Number.isInteger(rangesArr[0], { includeZero: true }) ||
      isNumStr(rangesArr[0], { includeZero: true })) &&
    (Number.isInteger(rangesArr[1], { includeZero: true }) ||
      isNumStr(rangesArr[1], { includeZero: true }))
  ) {
    rangesArr = [rangesArr];
  }
  const len = rangesArr.length;
  let counter = 0;
  rangesArr.forEach((el, i) => {
    if (progressFn) {
      percentageDone = Math.floor((counter / len) * 10);
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        progressFn(percentageDone);
      }
    }
    if (!isArr(el)) {
      throw new TypeError(
        `ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${i}th element not an array: ${JSON.stringify(
          el,
          null,
          4
        )}, which is ${typeof el}`
      );
    }
    if (!Number.isInteger(el[0], { includeZero: true })) {
      if (isNumStr(el[0], { includeZero: true })) {
        rangesArr[i][0] = Number.parseInt(rangesArr[i][0], 10);
      } else {
        throw new TypeError(
          `ranges-apply: [THROW_ID_06] ranges array, second input arg. has ${i}th element, array [${
            el[0]
          },${
            el[1]
          }]. That array has first element not an integer, but ${typeof el[0]}, equal to: ${JSON.stringify(
            el[0],
            null,
            4
          )}. Computer doesn't like this.`
        );
      }
    }
    if (!Number.isInteger(el[1], { includeZero: true })) {
      if (isNumStr(el[1], { includeZero: true })) {
        rangesArr[i][1] = Number.parseInt(rangesArr[i][1], 10);
      } else {
        throw new TypeError(
          `ranges-apply: [THROW_ID_07] ranges array, second input arg. has ${i}th element, array [${
            el[0]
          },${
            el[1]
          }]. That array has second element not an integer, but ${typeof el[1]}, equal to: ${JSON.stringify(
            el[1],
            null,
            4
          )}. Computer doesn't like this.`
        );
      }
    }
    counter++;
  });
  const workingRanges = rangesMerge(rangesArr, {
    progressFn: perc => {
      if (progressFn) {
        percentageDone = 10 + Math.floor(perc / 10);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }
    }
  });
  const len2 = workingRanges.length;
  if (len2 > 0) {
    const tails = str.slice(workingRanges[len2 - 1][1]);
    str = workingRanges.reduce((acc, val, i, arr) => {
      if (progressFn) {
        percentageDone = 20 + Math.floor((i / len2) * 80);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }
      const beginning = i === 0 ? 0 : arr[i - 1][1];
      const ending = arr[i][0];
      return (
        acc +
        str.slice(beginning, ending) +
        (existy(arr[i][2]) ? arr[i][2] : "")
      );
    }, "");
    str += tails;
  }
  return str;
}

export default rangesApply;
