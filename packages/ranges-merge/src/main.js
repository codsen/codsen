/* eslint prefer-destructuring:0 */

import sortRanges from "ranges-sort";
import clone from "lodash.clonedeep";
import isObj from "lodash.isplainobject";

// merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]
function mergeRanges(arrOfRanges, originalOpts) {
  //
  // internal functions:
  // ---------------------------------------------------------------------------
  function isStr(something) {
    return typeof something === "string";
  }

  // quick ending:
  // ---------------------------------------------------------------------------
  if (!Array.isArray(arrOfRanges)) {
    return arrOfRanges;
  }

  // tend the opts:
  // ---------------------------------------------------------------------------
  const defaults = {
    mergeType: 1,
    progressFn: null
  };

  let opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = Object.assign({}, defaults, originalOpts);
      // 1. validate opts.progressFn
      if (opts.progressFn && typeof opts.progressFn !== "function") {
        throw new Error(
          `ranges-merge: [THROW_ID_01] the second input argument must be a function! It was given of a type: "${typeof opts.progressFn}", equal to ${JSON.stringify(
            opts.progressFn,
            null,
            4
          )}`
        );
      }
      // 2. validate opts.mergeType
      if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
        if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
          opts.mergeType = 1;
        } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
          opts.mergeType = 2;
        } else {
          throw new Error(
            `ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: "${typeof opts.mergeType}", equal to ${JSON.stringify(
              opts.progressFn,
              null,
              4
            )}`
          );
        }
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
    opts = clone(defaults);
  }

  console.log(
    `113 USING ${`\u001b[${33}m${`opts`}\u001b[${39}m`} = ${JSON.stringify(
      opts,
      null,
      4
    )}`
  );

  // progress-wise, sort takes first 20%

  const filtered = clone(arrOfRanges).filter(
    // filter out futile ranges with identical starting and ending points with
    // nothing to add (no 3rd argument)
    rangeArr => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]
  );

  let sortedRanges;
  let lastPercentageDone;
  let percentageDone;

  if (opts.progressFn) {
    // progress already gets reported in [0,100] range, so we just need to
    // divide by 5 in order to "compress" that into 20% range.
    sortedRanges = sortRanges(filtered, {
      progressFn: percentage => {
        percentageDone = Math.floor(percentage / 5);
        // ensure each percent is passed only once:
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      }
    });
  } else {
    sortedRanges = sortRanges(filtered);
  }

  const len = sortedRanges.length - 1;
  // reset 80% of progress is this loop:
  for (let i = len; i > 0; i--) {
    if (opts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (
        percentageDone !== lastPercentageDone &&
        percentageDone > lastPercentageDone
      ) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
        // console.log(
        //   `065 REPORTING ${`\u001b[${33}m${`doneSoFar`}\u001b[${39}m`} = ${doneSoFar}`
        // );
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
      // reset the traversal, start from the end again
      i = sortedRanges.length;
    }
  }
  return sortedRanges;
}

export default mergeRanges;
