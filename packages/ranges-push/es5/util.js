'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var sortRanges = require('ranges-sort');

// utils

// merges the overlapping ranges
// case #1. exact extension:
// [ [1, 5], [5, 10] ] => [ [1, 10] ]
// case #2. overlap:
// [ [1, 4], [3, 5] ] => [ [1, 5] ]
function mergeRanges(arrOfRanges) {
  if (!Array.isArray(arrOfRanges)) {
    return arrOfRanges;
  }
  var sortedRanges = sortRanges(arrOfRanges);
  for (var i = sortedRanges.length - 1; i >= 0; i--) {
    if (i > 0 && (sortedRanges[i][0] <= sortedRanges[i - 1][0] || sortedRanges[i][0] <= sortedRanges[i - 1][1])) {
      sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
      sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);

      if (sortedRanges[i][2] !== undefined) {
        if (sortedRanges[i - 1][2] !== undefined) {
          sortedRanges[i - 1][2] += sortedRanges[i][2];
        } else {
          var _sortedRanges$i = _slicedToArray(sortedRanges[i], 3);
          // instead of:
          // sortedRanges[i - 1][2] = sortedRanges[i][2]
          // let's use ES6 destructuring:


          sortedRanges[i - 1][2] = _sortedRanges$i[2];
        }
      }
      sortedRanges.splice(i, 1);
      // reset the traversal, start from the end again
      i = sortedRanges.length;
    }
  }
  return sortedRanges;
}

module.exports = { mergeRanges: mergeRanges, sortRanges: sortRanges };