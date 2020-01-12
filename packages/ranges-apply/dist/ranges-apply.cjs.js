/**
 * ranges-apply
 * Take an array of string slice ranges, delete/replace the string according to them
 * Version: 3.0.48
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-apply
 */

'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var isNumStr = _interopDefault(require('is-natural-number-string'));
var rangesMerge = _interopDefault(require('ranges-merge'));

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

var isArr = Array.isArray;
function existy(x) {
  return x != null;
}
function isStr(something) {
  return typeof something === "string";
}
function rangesApply(str, rangesArr, _progressFn) {
  var percentageDone = 0;
  var lastPercentageDone = 0;
  if (arguments.length === 0) {
    throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
  }
  if (!isStr(str)) {
    throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (rangesArr === null) {
    return str;
  } else if (!isArr(rangesArr)) {
    throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(_typeof(rangesArr), ", equal to: ").concat(JSON.stringify(rangesArr, null, 4)));
  }
  if (_progressFn && typeof _progressFn !== "function") {
    throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(_typeof(_progressFn), ", equal to: ").concat(JSON.stringify(_progressFn, null, 4)));
  }
  if (isArr(rangesArr) && (Number.isInteger(rangesArr[0], {
    includeZero: true
  }) || isNumStr(rangesArr[0], {
    includeZero: true
  })) && (Number.isInteger(rangesArr[1], {
    includeZero: true
  }) || isNumStr(rangesArr[1], {
    includeZero: true
  }))) {
    rangesArr = [rangesArr];
  }
  var len = rangesArr.length;
  var counter = 0;
  rangesArr.forEach(function (el, i) {
    if (_progressFn) {
      percentageDone = Math.floor(counter / len * 10);
      if (percentageDone !== lastPercentageDone) {
        lastPercentageDone = percentageDone;
        _progressFn(percentageDone);
      }
    }
    if (!isArr(el)) {
      throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has ".concat(i, "th element not an array: ").concat(JSON.stringify(el, null, 4), ", which is ").concat(_typeof(el)));
    }
    if (!Number.isInteger(el[0], {
      includeZero: true
    })) {
      if (isNumStr(el[0], {
        includeZero: true
      })) {
        rangesArr[i][0] = Number.parseInt(rangesArr[i][0], 10);
      } else {
        throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has first element not an integer, but ").concat(_typeof(el[0]), ", equal to: ").concat(JSON.stringify(el[0], null, 4), ". Computer doesn't like this."));
      }
    }
    if (!Number.isInteger(el[1], {
      includeZero: true
    })) {
      if (isNumStr(el[1], {
        includeZero: true
      })) {
        rangesArr[i][1] = Number.parseInt(rangesArr[i][1], 10);
      } else {
        throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has ".concat(i, "th element, array [").concat(el[0], ",").concat(el[1], "]. That array has second element not an integer, but ").concat(_typeof(el[1]), ", equal to: ").concat(JSON.stringify(el[1], null, 4), ". Computer doesn't like this."));
      }
    }
    counter++;
  });
  var workingRanges = rangesMerge(rangesArr, {
    progressFn: function progressFn(perc) {
      if (_progressFn) {
        percentageDone = 10 + Math.floor(perc / 10);
        if (percentageDone !== lastPercentageDone) {
          lastPercentageDone = percentageDone;
          _progressFn(percentageDone);
        }
      }
    }
  });
  var len2 = workingRanges.length;
  if (len2 > 0) {
    var tails = str.slice(workingRanges[len2 - 1][1]);
    str = workingRanges.reduce(function (acc, val, i, arr) {
      if (_progressFn) {
        percentageDone = 20 + Math.floor(i / len2 * 80);
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
