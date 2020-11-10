/**
 * ranges-apply
 * Take an array of string index ranges, delete/replace the string according to them
 * Version: 3.2.4
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-apply/
 */

'use strict';

var rangesMerge = require('ranges-merge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var rangesMerge__default = /*#__PURE__*/_interopDefaultLegacy(rangesMerge);

function _typeof(obj) {
  "@babel/helpers - typeof";

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

function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function rangesApply(str, originalRangesArr, _progressFn) {
  var percentageDone = 0;
  var lastPercentageDone = 0;
  if (arguments.length === 0) {
    throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
  }
  if (!isStr(str)) {
    throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (originalRangesArr && !Array.isArray(originalRangesArr)) {
    throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(_typeof(originalRangesArr), ", equal to: ").concat(JSON.stringify(originalRangesArr, null, 4)));
  }
  if (_progressFn && typeof _progressFn !== "function") {
    throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(_typeof(_progressFn), ", equal to: ").concat(JSON.stringify(_progressFn, null, 4)));
  }
  if (!originalRangesArr || !originalRangesArr.filter(function (range) {
    return range;
  }).length) {
    return str;
  }
  var rangesArr;
  if (Array.isArray(originalRangesArr) && (Number.isInteger(originalRangesArr[0]) && originalRangesArr[0] >= 0 || /^\d*$/.test(originalRangesArr[0])) && (Number.isInteger(originalRangesArr[1]) && originalRangesArr[1] >= 0 || /^\d*$/.test(originalRangesArr[1]))) {
    rangesArr = [Array.from(originalRangesArr)];
  } else {
    rangesArr = Array.from(originalRangesArr);
  }
  var len = rangesArr.length;
  var counter = 0;
  rangesArr.filter(function (range) {
    return range;
  }).forEach(function (el, i) {
    if (_progressFn) {
      percentageDone = Math.floor(counter / len * 10);
      /* istanbul ignore else */
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        _progressFn(percentageDone);
      }
    }
    if (!Array.isArray(el)) {
      throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has ".concat(i, "th element not an array: ").concat(JSON.stringify(el, null, 4), ", which is ").concat(_typeof(el)));
    }
    if (!Number.isInteger(el[0]) || el[0] < 0) {
      if (/^\d*$/.test(el[0])) {
        rangesArr[i][0] = Number.parseInt(rangesArr[i][0], 10);
      } else {
        throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has first element not an integer, but ").concat(_typeof(el[0]), ", equal to: ").concat(JSON.stringify(el[0], null, 4), ". Computer doesn't like this."));
      }
    }
    if (!Number.isInteger(el[1])) {
      if (/^\d*$/.test(el[1])) {
        rangesArr[i][1] = Number.parseInt(rangesArr[i][1], 10);
      } else {
        throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has second element not an integer, but ").concat(_typeof(el[1]), ", equal to: ").concat(JSON.stringify(el[1], null, 4), ". Computer doesn't like this."));
      }
    }
    counter += 1;
  });
  var workingRanges = rangesMerge__default['default'](rangesArr, {
    progressFn: function progressFn(perc) {
      if (_progressFn) {
        percentageDone = 10 + Math.floor(perc / 10);
        /* istanbul ignore else */
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          _progressFn(percentageDone);
        }
      }
    }
  });
  if (!workingRanges) {
    return str;
  }
  var len2 = workingRanges.length;
  /* istanbul ignore else */
  if (len2 > 0) {
    var tails = str.slice(workingRanges[len2 - 1][1]);
    str = workingRanges.reduce(function (acc, val, i, arr) {
      if (_progressFn) {
        percentageDone = 20 + Math.floor(i / len2 * 80);
        /* istanbul ignore else */
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          _progressFn(percentageDone);
        }
      }
      var beginning = i === 0 ? 0 : arr[i - 1][1];
      var ending = arr[i][0];
      return acc + str.slice(beginning, ending) + (existy(arr[i][2]) ? arr[i][2] : "");
    }, "");
    str += tails;
  }
  return str;
}

module.exports = rangesApply;
