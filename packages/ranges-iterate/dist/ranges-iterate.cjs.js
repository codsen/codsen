/**
 * @name ranges-iterate
 * @fileoverview Iterate a string and any changes within given string index ranges
 * @version 2.1.0
 * @author Roy Revelt, Codsen Ltd
 * @license MIT
 * {@link https://codsen.com/os/ranges-iterate/}
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var _typeof = require('@babel/runtime/helpers/typeof');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var _typeof__default = /*#__PURE__*/_interopDefaultLegacy(_typeof);

var version$1 = "2.1.0";

var version = version$1;
function rIterate(str, originalRanges, cb) {
  var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  if (typeof str !== "string") {
    throw new TypeError("ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ".concat(_typeof__default['default'](str), ", equal to: ").concat(JSON.stringify(str, null, 0)));
  } else if (!str.length) {
    throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");
  }
  if (originalRanges && !Array.isArray(originalRanges)) {
    throw new TypeError("ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ".concat(_typeof__default['default'](originalRanges), ", equal to: ").concat(JSON.stringify(originalRanges, null, 0)));
  }
  if (!cb) {
    throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");
  } else if (typeof cb !== "function") {
    throw new TypeError("ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ".concat(_typeof__default['default'](cb), ", equal to: ").concat(JSON.stringify(cb, null, 0)));
  }
  if (originalRanges === null || !originalRanges.length) {
    for (var i = 0; i < str.length; i++) {
      cb({
        i: i,
        val: str[i]
      });
    }
  } else {
    var ranges = Array.from(originalRanges);
    var currentIdx = offset;
    var finalIdx = offset;
    if (finalIdx < ranges[0][0]) {
      for (; finalIdx < ranges[0][0]; finalIdx++, currentIdx++) {
        if (!str[finalIdx]) {
          break;
        }
        cb({
          i: finalIdx,
          val: str[finalIdx]
        });
      }
    }
    if (ranges[0][0] <= currentIdx) {
      ranges.forEach(function (rangeArr, rangeArrIdx) {
        if (rangeArr[2]) {
          for (var y = 0, len = rangeArr[2].length; y < len; y++) {
            cb({
              i: finalIdx,
              val: rangeArr[2][y]
            });
            finalIdx += 1;
          }
        }
        while (currentIdx < rangeArr[1]) {
          currentIdx += 1;
        }
        var loopUntil = str.length;
        if (ranges[rangeArrIdx + 1]) {
          loopUntil = ranges[rangeArrIdx + 1][0];
        }
        for (; currentIdx < loopUntil; finalIdx++, currentIdx++) {
          cb({
            i: finalIdx,
            val: str[currentIdx]
          });
        }
      });
    }
  }
}

exports.rIterate = rIterate;
exports.version = version;
