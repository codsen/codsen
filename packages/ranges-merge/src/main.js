/* eslint prefer-destructuring:0 */

import sortRanges from "ranges-sort";
import clone from "lodash.clonedeep";

// merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]
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
  // progress-wise, sort takes first 20%

  const filtered = clone(arrOfRanges).filter(
    // filter out futile ranges with identical starting and ending points with
    // nothing to add (no 3rd argument)
    rangeArr => rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1]
  );

  let sortedRanges;
  if (progressFn) {
    // progress already gets reported in [0,100] range, so we just need to
    // divide by 5 in order to "compress" that into 20% range.
    sortedRanges = sortRanges(filtered, {
      progressFn: percentage => progressFn(Math.floor(percentage / 5))
    });
  } else {
    sortedRanges = sortRanges(filtered);
  }

  let lastDoneSoFar;
  let doneSoFar;
  const len = sortedRanges.length - 1;
  let counter = len + 1;
  // reset 80% of progress is this loop:
  for (let i = len; i > 0; i--) {
    if (progressFn) {
      counter--;
      doneSoFar = Math.floor((1 - counter / len) * 78) + 21;
      if (doneSoFar !== lastDoneSoFar) {
        lastDoneSoFar = doneSoFar;
        progressFn(doneSoFar);
        // console.log(
        //   `056 REPORTING ${`\u001b[${33}m${`doneSoFar`}\u001b[${39}m`} = ${doneSoFar}`
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
