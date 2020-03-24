/**
 * ranges-iterate
 * Iterate a string and any changes within already existing ranges
 * Version: 1.1.34
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://gitlab.com/codsen/codsen/tree/master/packages/ranges-iterate
 */

'use strict';

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

var isArr = Array.isArray;
function rangesIterate(str, originalRanges, cb) {
  var offset = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
  if (typeof str !== "string") {
    throw new TypeError("ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as ".concat(_typeof(str), ", equal to: ").concat(JSON.stringify(str, null, 0)));
  } else if (!str.length) {
    throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");
  }
  if (originalRanges !== null && !isArr(originalRanges)) {
    throw new TypeError("ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: ".concat(_typeof(originalRanges), ", equal to: ").concat(JSON.stringify(originalRanges, null, 0)));
  }
  if (!cb) {
    throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");
  } else if (typeof cb !== "function") {
    throw new TypeError("ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: ".concat(_typeof(cb), ", equal to: ").concat(JSON.stringify(cb, null, 0)));
  }
  if (originalRanges === null || !originalRanges.length) {
    for (var i = 0; i < str.length; i++) {
      cb({
        i: i,
        val: str[i],
        push: function push(received) {
          return received;
        }
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
            finalIdx++;
          }
        }
        while (currentIdx < rangeArr[1]) {
          currentIdx++;
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

module.exports = rangesIterate;
