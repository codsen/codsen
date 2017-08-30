'use strict';

// utils

//                              /\___/\
//                             ( o   o )
//                             (  =^=  )
//                             (        )
//                             (         )
//                             (          )))))))))))

//

// does [ [2, 5], [1, 6] ] => [ [1, 6], [2, 5] ]
// sorts first by first element, then by second. Retains possible third element.

function sortRanges(arrOfRanges) {
  if (!Array.isArray(arrOfRanges)) {
    return arrOfRanges;
  }
  return arrOfRanges.sort(function (range1, range2) {
    if (range1[0] === range2[0]) {
      if (range1[1] < range2[1]) {
        return -1;
      }
      if (range1[1] > range2[1]) {
        return 1;
      }
      return 0;
    } else {
      if (range1[0] < range2[0]) {
        return -1;
      } else {
        return 1;
      }
    }
  });
}

// merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]
function mergeRanges(arrOfRanges) {
  var sortedRanges;
  if (!Array.isArray(arrOfRanges)) {
    return arrOfRanges;
  }
  sortedRanges = sortRanges(arrOfRanges);
  for (var i = sortedRanges.length - 1; i >= 0; i--) {
    if (i > 0 && (sortedRanges[i][0] <= sortedRanges[i - 1][0] || sortedRanges[i][0] <= sortedRanges[i - 1][1])) {
      sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
      sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);

      if (sortedRanges[i][2] !== undefined) {
        if (sortedRanges[i - 1][2] !== undefined) {
          sortedRanges[i - 1][2] += sortedRanges[i][2];
        } else {
          sortedRanges[i - 1][2] = sortedRanges[i][2];
        }
      }
      sortedRanges.splice(i, 1);
      // reset the traversal, start from the end again
      i = sortedRanges.length;
    }
  }
  return sortedRanges;
}

module.exports = { sortRanges: sortRanges, mergeRanges: mergeRanges };