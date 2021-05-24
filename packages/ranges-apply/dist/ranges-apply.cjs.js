/**
 * @name ranges-apply
 * @fileoverview Take an array of string index ranges, delete/replace the string according to them
 * @version 5.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-apply/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');
var rangesMerge = require('ranges-merge');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "5.1.0";

var version = version$1;
function rApply(str, originalRangesArr, _progressFn) {
  var percentageDone = 0;
  var lastPercentageDone = 0;
  if (arguments.length === 0) {
    throw new Error("ranges-apply: [THROW_ID_01] inputs missing!");
  }
  if (typeof str !== "string") {
    throw new TypeError("ranges-apply: [THROW_ID_02] first input argument must be a string! Currently it's: ".concat(_typeof__default['default'](str), ", equal to: ").concat(JSON.stringify(str, null, 4)));
  }
  if (originalRangesArr && !Array.isArray(originalRangesArr)) {
    throw new TypeError("ranges-apply: [THROW_ID_03] second input argument must be an array (or null)! Currently it's: ".concat(_typeof__default['default'](originalRangesArr), ", equal to: ").concat(JSON.stringify(originalRangesArr, null, 4)));
  }
  if (_progressFn && typeof _progressFn !== "function") {
    throw new TypeError("ranges-apply: [THROW_ID_04] the third input argument must be a function (or falsey)! Currently it's: ".concat(_typeof__default['default'](_progressFn), ", equal to: ").concat(JSON.stringify(_progressFn, null, 4)));
  }
  if (!originalRangesArr || !originalRangesArr.filter(function (range) {
    return range;
  }).length) {
    return str;
  }
  var rangesArr;
  if (Array.isArray(originalRangesArr) && Number.isInteger(originalRangesArr[0]) && Number.isInteger(originalRangesArr[1])) {
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
      throw new TypeError("ranges-apply: [THROW_ID_05] ranges array, second input arg., has ".concat(i, "th element not an array: ").concat(JSON.stringify(el, null, 4), ", which is ").concat(_typeof__default['default'](el)));
    }
    if (!Number.isInteger(el[0])) {
      if (!Number.isInteger(+el[0]) || +el[0] < 0) {
        throw new TypeError("ranges-apply: [THROW_ID_06] ranges array, second input arg. has ".concat(i, "th element, array ").concat(JSON.stringify(el, null, 0), ". Its first element is not an integer, string index, but ").concat(_typeof__default['default'](el[0]), ", equal to: ").concat(JSON.stringify(el[0], null, 4), "."));
      } else {
        rangesArr[i][0] = +rangesArr[i][0];
      }
    }
    if (!Number.isInteger(el[1])) {
      if (!Number.isInteger(+el[1]) || +el[1] < 0) {
        throw new TypeError("ranges-apply: [THROW_ID_07] ranges array, second input arg. has ".concat(i, "th element, array ").concat(JSON.stringify(el, null, 0), ". Its second element is not an integer, string index, but ").concat(_typeof__default['default'](el[1]), ", equal to: ").concat(JSON.stringify(el[1], null, 4), "."));
      } else {
        rangesArr[i][1] = +rangesArr[i][1];
      }
    }
    counter += 1;
  });
  var workingRanges = rangesMerge.rMerge(rangesArr, {
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
  var len2 = Array.isArray(workingRanges) ? workingRanges.length : 0;
  /* istanbul ignore else */
  if (len2 > 0) {
    var tails = str.slice(workingRanges[len2 - 1][1]);
    str = workingRanges.reduce(function (acc, _val, i, arr) {
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
      return acc + str.slice(beginning, ending) + (arr[i][2] || "");
    }, "");
    str += tails;
  }
  return str;
}

exports.rApply = rApply;
exports.version = version;
