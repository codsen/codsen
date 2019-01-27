/**
 * ranges-merge
 * Merge and sort arrays which mean string slice ranges
 * Version: 3.12.1
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge
 */

import sortRanges from 'ranges-sort';
import clone from 'lodash.clonedeep';

function mergeRanges(arrOfRanges, progressFn) {
  if (!Array.isArray(arrOfRanges)) {
    return arrOfRanges;
  }
  if (progressFn && typeof progressFn !== "function") {
    throw new Error(
      `ranges-merge: [THROW_ID_01] the second input argument must be a function! It was given of a type: "${typeof progressFn}", equal to ${JSON.stringify(
        progressFn,
        null,
        4
      )}`
    );
  }
  const filtered = clone(arrOfRanges).filter(
    rangeArr => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]
  );
  let sortedRanges;
  let lastPercentageDone;
  let percentageDone;
  if (progressFn) {
    sortedRanges = sortRanges(filtered, {
      progressFn: percentage => {
        percentageDone = Math.floor(percentage / 5);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          progressFn(percentageDone);
        }
      }
    });
  } else {
    sortedRanges = sortRanges(filtered);
  }
  const len = sortedRanges.length - 1;
  for (let i = len; i > 0; i--) {
    if (progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (
        percentageDone !== lastPercentageDone &&
        percentageDone > lastPercentageDone
      ) {
        lastPercentageDone = percentageDone;
        progressFn(percentageDone);
      }
    }
    if (
      sortedRanges[i][0] <= sortedRanges[i - 1][0] ||
      sortedRanges[i][0] <= sortedRanges[i - 1][1]
    ) {
      sortedRanges[i - 1][0] = Math.min(
        sortedRanges[i][0],
        sortedRanges[i - 1][0]
      );
      sortedRanges[i - 1][1] = Math.max(
        sortedRanges[i][1],
        sortedRanges[i - 1][1]
      );
      if (
        sortedRanges[i][2] !== undefined &&
        (sortedRanges[i - 1][0] >= sortedRanges[i][0] ||
          sortedRanges[i - 1][1] <= sortedRanges[i][1])
      ) {
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] !== undefined) {
            sortedRanges[i - 1][2] += sortedRanges[i][2];
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      }
      sortedRanges.splice(i, 1);
      i = sortedRanges.length;
    }
  }
  return sortedRanges;
}

export default mergeRanges;
