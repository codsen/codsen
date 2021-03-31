/**
 * ranges-iterate
 * Iterate a string and any changes within given string index ranges
 * Version: 2.0.12
 * Author: Roy Revelt, Codsen Ltd
 * License: MIT
 * Homepage: https://codsen.com/os/ranges-iterate/
 */

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var version$1 = "2.0.12";

var version = version$1;
function rIterate(str, originalRanges, cb, offset) {
  if (offset === void 0) {
    offset = 0;
  }
  if (typeof str !== "string") {
    throw new TypeError("ranges-iterate: [THROW_ID_01] Input string must be a string! It was given as " + typeof str + ", equal to: " + JSON.stringify(str, null, 0));
  } else if (!str.length) {
    throw new TypeError("ranges-iterate: [THROW_ID_02] Input string must be non-empty!");
  }
  if (originalRanges && !Array.isArray(originalRanges)) {
    throw new TypeError("ranges-iterate: [THROW_ID_03] Input ranges must be an array, consisting of zero or more arrays! Currently its type is: " + typeof originalRanges + ", equal to: " + JSON.stringify(originalRanges, null, 0));
  }
  if (!cb) {
    throw new TypeError("ranges-iterate: [THROW_ID_04] You should provide a callback function as third input argument!");
  } else if (typeof cb !== "function") {
    throw new TypeError("ranges-iterate: [THROW_ID_05] The calllback function (third input argument) must be a function. It was given as: " + typeof cb + ", equal to: " + JSON.stringify(cb, null, 0));
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
