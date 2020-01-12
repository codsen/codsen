/**
 * ranges-merge
 * Merge and sort arrays which mean string slice ranges
 * Version: 4.2.31
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-merge
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var sortRanges = _interopDefault(require('ranges-sort'));
var clone = _interopDefault(require('lodash.clonedeep'));
var isObj = _interopDefault(require('lodash.isplainobject'));

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

function mergeRanges(arrOfRanges, originalOpts) {
  function isStr(something) {
    return typeof something === "string";
  }
  if (!Array.isArray(arrOfRanges)) {
    return arrOfRanges;
  }
  var defaults = {
    mergeType: 1,
    progressFn: null,
    joinRangesThatTouchEdges: true
  };
  var opts;
  if (originalOpts) {
    if (isObj(originalOpts)) {
      opts = Object.assign({}, defaults, originalOpts);
      if (opts.progressFn && isObj(opts.progressFn) && !Object.keys(opts.progressFn).length) {
        opts.progressFn = null;
      } else if (opts.progressFn && typeof opts.progressFn !== "function") {
        throw new Error("ranges-merge: [THROW_ID_01] opts.progressFn must be a function! It was given of a type: \"".concat(_typeof(opts.progressFn), "\", equal to ").concat(JSON.stringify(opts.progressFn, null, 4)));
      }
      if (opts.mergeType && opts.mergeType !== 1 && opts.mergeType !== 2) {
        if (isStr(opts.mergeType) && opts.mergeType.trim() === "1") {
          opts.mergeType = 1;
        } else if (isStr(opts.mergeType) && opts.mergeType.trim() === "2") {
          opts.mergeType = 2;
        } else {
          throw new Error("ranges-merge: [THROW_ID_02] opts.mergeType was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.mergeType), "\", equal to ").concat(JSON.stringify(opts.mergeType, null, 4)));
        }
      }
      if (typeof opts.joinRangesThatTouchEdges !== "boolean") {
        throw new Error("ranges-merge: [THROW_ID_04] opts.joinRangesThatTouchEdges was customised to a wrong thing! It was given of a type: \"".concat(_typeof(opts.joinRangesThatTouchEdges), "\", equal to ").concat(JSON.stringify(opts.joinRangesThatTouchEdges, null, 4)));
      }
    } else {
      throw new Error("emlint: [THROW_ID_03] the second input argument must be a plain object. It was given as:\n".concat(JSON.stringify(originalOpts, null, 4), " (type ").concat(_typeof(originalOpts), ")"));
    }
  } else {
    opts = clone(defaults);
  }
  var filtered = clone(arrOfRanges).filter(
  function (rangeArr) {
    return rangeArr[2] !== undefined || rangeArr[0] !== rangeArr[1];
  });
  var sortedRanges;
  var lastPercentageDone;
  var percentageDone;
  if (opts.progressFn) {
    sortedRanges = sortRanges(filtered, {
      progressFn: function progressFn(percentage) {
        percentageDone = Math.floor(percentage / 5);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          opts.progressFn(percentageDone);
        }
      }
    });
  } else {
    sortedRanges = sortRanges(filtered);
  }
  var len = sortedRanges.length - 1;
  for (var i = len; i > 0; i--) {
    if (opts.progressFn) {
      percentageDone = Math.floor((1 - i / len) * 78) + 21;
      if (percentageDone !== lastPercentageDone && percentageDone > lastPercentageDone) {
        lastPercentageDone = percentageDone;
        opts.progressFn(percentageDone);
      }
    }
    if (sortedRanges[i][0] <= sortedRanges[i - 1][0] || !opts.joinRangesThatTouchEdges && sortedRanges[i][0] < sortedRanges[i - 1][1] || opts.joinRangesThatTouchEdges && sortedRanges[i][0] <= sortedRanges[i - 1][1]) {
      sortedRanges[i - 1][0] = Math.min(sortedRanges[i][0], sortedRanges[i - 1][0]);
      sortedRanges[i - 1][1] = Math.max(sortedRanges[i][1], sortedRanges[i - 1][1]);
      if (sortedRanges[i][2] !== undefined && (sortedRanges[i - 1][0] >= sortedRanges[i][0] || sortedRanges[i - 1][1] <= sortedRanges[i][1])) {
        if (sortedRanges[i - 1][2] !== null) {
          if (sortedRanges[i][2] === null && sortedRanges[i - 1][2] !== null) {
            sortedRanges[i - 1][2] = null;
          } else if (sortedRanges[i - 1][2] !== undefined) {
            if (opts.mergeType === 2 && sortedRanges[i - 1][0] === sortedRanges[i][0]) {
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
  return sortedRanges;
}

module.exports = mergeRanges;
