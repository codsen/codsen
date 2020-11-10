/**
 * ranges-merge
 * Merge and sort string index ranges
 * Version: 5.0.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-merge/
 */

import sortRanges from 'ranges-sort';

function mergeRanges(arrOfRanges, originalOpts) {
  function isStr(something) {
    return typeof something === "string";
  }
  function isObj(something) {
    return (
      something && typeof something === "object" && !Array.isArray(something)
    );
  }
  if (!Array.isArray(arrOfRanges) || !arrOfRanges.length) {
    return null;
  }
  const defaults = {
    mergeType: 1,
    progressFn: null,
    joinRangesThatTouchEdges: true,
  };
  let opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = { ...defaults, ...originalOpts };
      if (
        opts.progressFn &&
        isObj(opts.progressFn) &&
        !Object.keys(opts.progressFn).length
      ) {
        opts.progressFn = null;
      } else if (opts.progressFn && typeof opts.progressFn !== "function") {
        throw new Error(
          `ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: "${typeof opts.progressFn}", equal to ${JSON.stringify(
            opts.progressFn,
            null,
            4
          )}`
        );
      }
      if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
        if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
          opts.mergeType = 1;
        } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
          opts.mergeType = 2;
        } else {
          throw new Error(
            `ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(
              opts.mergeType,
              null,
              4
            )}`
          );
        }
      }
      if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
        throw new Error(
          `ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: "${typeof opts.joinRangesThatTouchEdges}", equal to ${JSON.stringify(
            opts.joinRangesThatTouchEdges,
            null,
            4
          )}`
        );
      }
    } else {
      throw new Error(
        `emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n${JSON.stringify(
          originalOpts,
          null,
          4
        )} (type ${typeof originalOpts})`
      );
    }
  } else {
    opts = { ...defaults };
  }
  const filtered = arrOfRanges
    .filter((range) => range)
    .map((subarr) => [...subarr])
    .filter(
      (rangeArr) => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]
    );
  let sortedRanges;
  let lastPercentageDone;
  let percentageDone;
  if (opts.progressFn) {
    sortedRanges = sortRanges(filtered, {
      progressFn: (percentage) => {
        percentageDone = Math.floor(percentage / 5);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      },
    });
  } else {
    sortedRanges = sortRanges(filtered);
  }
  const len = sortedRanges.length - 1;
  for (let i = len; i > 0; i--) {
    if (opts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (
        percentageDone !== lastPercentageDone &&
        percentageDone > lastPercentageDone
      ) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    if (
      sortedRanges[i][0] <= sortedRanges[i - 1][0] ||
      (!opts.joinRangesThatTouchEdges &&
        sortedRanges[i][0] < sortedRanges[i - 1][1]) ||
      (opts.joinRangesThatTouchEdges &&
        sortedRanges[i][0] <= sortedRanges[i - 1][1])
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
            if (
              opts.mergeType === 2 &&
              sortedRanges[i - 1][0] === sortedRanges[i][0]
            ) {
              sortedRanges[i - 1][2] = sortedRanges[i][2];
            } else {
              sortedRanges[i - 1][2] += sortedRanges[i][2];
            }
          } else {
            sortedRanges[i - 1][2] = sortedRanges[i][2];
          }
        }
      }
      sortedRanges.splice(i, 1);
      i = sortedRanges.length;
    }
  }
  return sortedRanges.length ? sortedRanges : null;
}

export default mergeRanges;
