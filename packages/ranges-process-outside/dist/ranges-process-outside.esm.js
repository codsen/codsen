/**
 * ranges-process-outside
 * Iterate through string and optionally a given ranges as if they were one
 * Version: 2.0.9
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-process-outside
 */

import mergeRanges from 'ranges-merge';

const isArr = Array.isArray;
function processOutside(str, originalRanges, cb, skipChecks) {
  function isFunction(functionToCheck) {
    return (
      functionToCheck &&
      {}.toString.call(functionToCheck) === "[object Function]"
    );
  }
  if (typeof str !== "string") {
    if (str === undefined) {
      throw new Error(
        `ranges-process-outside: [THROW_ID_01] the first input argument must be string! It's missing currently (undefined)!`
      );
    } else {
      throw new Error(
        `ranges-process-outside: [THROW_ID_02] the first input argument must be string! It was given as:\n${JSON.stringify(
          str,
          null,
          4
        )} (type ${typeof str})`
      );
    }
  }
  if (originalRanges !== null && !isArr(originalRanges)) {
    throw new Error(
      `ranges-process-outside: [THROW_ID_03] the second input argument must be array of ranges or null! It was given as:\n${JSON.stringify(
        originalRanges,
        null,
        4
      )} (type ${typeof originalRanges})`
    );
  }
  if (!isArr(originalRanges) || originalRanges.length === 0) {
    cb({
      from: 0,
      to: str.length,
      value: str
    });
    return;
  }
  if (!isFunction(cb)) {
    throw new Error(
      `ranges-process-outside: [THROW_ID_04] the third input argument must be a function! It was given as:\n${JSON.stringify(
        cb,
        null,
        4
      )} (type ${typeof cb})`
    );
  }
  let ranges;
  if (skipChecks) {
    ranges = originalRanges;
  } else {
    ranges = mergeRanges(originalRanges);
  }
  let previousTo = 0;
  ranges.forEach(([receivedFrom, receivedTo], i, wholeArr) => {
    if (receivedFrom < previousTo) {
      throw new Error(
        `ranges-process-outside: [THROW_ID_05] the ranges array is not sorted/merged. It's equal to:\n${JSON.stringify(
          originalRanges,
          null,
          4
        )}\n\nNotice ranges at index ${i} and ${i - 1}: [... ${JSON.stringify(
          ranges[i - 1],
          null,
          0
        )}, ${JSON.stringify(
          ranges[i],
          null,
          0
        )}...] - use ranges-merge, ranges-sort or ranges-push npm libraries to process your ranges array upfont.`
      );
    }
    if (receivedFrom !== null && receivedFrom !== 0) {
      cb({
        from: previousTo,
        to: receivedFrom,
        value: str.slice(previousTo, receivedFrom)
      });
    }
    previousTo = receivedTo <= str.length ? receivedTo : null;
    if (previousTo !== null && i === wholeArr.length - 1) {
      cb({
        from: previousTo,
        to: str.length,
        value: str.slice(previousTo, str.length)
      });
    }
  });
}

export default processOutside;
