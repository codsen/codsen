/**
 * ranges-merge
 * Merge and sort arrays which mean string slice ranges
 * Version: 3.12.0
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://bitbucket.org/codsen/codsen/src/master/packages/ranges-merge
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sortRanges = _interopDefault(require('ranges-sort'));
var clone = _interopDefault(require('lodash.clonedeep'));

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function mergeRanges(arrOfRanges, _progressFn) {
  if (!Array.isArray(arrOfRanges)) {
    return arrOfRanges;
  }
  if (_progressFn && typeof _progressFn !== "function") {
    throw new Error("ranges-merge: [THROW_ID_01] the second input argument must be a function! It was given of a type: \"".concat(_typeof(_progressFn), "\", equal to ").concat(JSON.stringify(_progressFn, null, 4)));
  }
  var filtered = clone(arrOfRanges).filter(
  function (rangeArr) {
    return rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1];
  });
  var sortedRanges;
  var lastPercentageDone;
  var percentageDone;
  if (_progressFn) {
    sortedRanges = sortRanges(filtered, {
      progressFn: function progressFn(percentage) {
        percentageDone = Math.floor(percentage / 5);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          _progressFn(percentageDone);
        }
      }
    });
  } else {
    sortedRanges = sortRanges(filtered);
  }
  var len = sortedRanges.length - 1;
  for (var i = len; i > 0; i--) {
    if (_progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (percentageDone !== lastPercentageDone && percentageDone > lastPercentageDone) {
        lastPercentageDone = percentageDone;
        _progressFn(percentageDone);
      }
    }
    if (sortedRanges[i][0] <= sortedRanges[i - 1][0] || sortedRanges[i][0] <= sortedRanges[i - 1][1]) {
      sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
      sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);
      if (sortedRanges[i][2] !== undefined && (sortedRanges[i - 1][0] >= sortedRanges[i][0] || sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
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

module.exports = mergeRanges;
