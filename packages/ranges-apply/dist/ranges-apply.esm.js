/**
 * ranges-apply
 * Take an array of string index ranges, delete/replace the string according to them
 * Version: 3.2.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-apply/
 */

import rangesMerge from 'ranges-merge';

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function rangesApply(str, originalRangesArr, progressFn) {
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
  if (originalRangesArr && !Array.isArray(originalRangesArr)) {
    throw new TypeError(
      `ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ${typeof originalRangesArr}, equal to: ${JSON.stringify(
        originalRangesArr,
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
    !originalRangesArr ||
    !originalRangesArr.filter((range) => range).length
  ) {
    return str;
  }
  let rangesArr;
  if (
    Array.isArray(originalRangesArr) &&
    ((Number.isInteger(originalRangesArr[0]) && originalRangesArr[0] >= 0) ||
      /^\d*$/.test(originalRangesArr[0])) &&
    ((Number.isInteger(originalRangesArr[1]) && originalRangesArr[1] >= 0) ||
      /^\d*$/.test(originalRangesArr[1]))
  ) {
    rangesArr = [Array.from(originalRangesArr)];
  } else {
    rangesArr = Array.from(originalRangesArr);
  }
  const len = rangesArr.length;
  let counter = 0;
  rangesArr
    .filter((range) => range)
    .forEach((el, i) => {
      if (progressFn) {
        percentageDone = Math.floor((counter / len) * 10);
        /* istanbul ignore else */
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }
      if (!Array.isArray(el)) {
        throw new TypeError(
          `ranges-apply: [THROW_ID_05] ranges array, second input arg., has ${i}th element not an array: ${JSON.stringify(
            el,
            null,
            4
          )}, which is ${typeof el}`
        );
      }
      if (!Number.isInteger(el[0]) || el[0] < 0) {
        if (/^\d*$/.test(el[0])) {
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
      if (!Number.isInteger(el[1])) {
        if (/^\d*$/.test(el[1])) {
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
      counter += 1;
    });
  const workingRanges = rangesMerge(rangesArr, {
    progressFn: (perc) => {
      if (progressFn) {
        percentageDone = 10 + Math.floor(perc / 10);
        /* istanbul ignore else */
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }
    },
  });
  if (!workingRanges) {
    return str;
  }
  const len2 = workingRanges.length;
  /* istanbul ignore else */
  if (len2 > 0) {
    const tails = str.slice(workingRanges[len2 - 1][1]);
    str = workingRanges.reduce((acc, val, i, arr) => {
      if (progressFn) {
        percentageDone = 20 + Math.floor((i / len2) * 80);
        /* istanbul ignore else */
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
